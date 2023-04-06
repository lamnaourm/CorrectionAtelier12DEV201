const express = require('express')
const amqp = require('amqplib')
const mongoose = require('mongoose')
const orderModel = require('./model/order')

const app = express()

var connection, channel;
const queueName1 = "order-service-queue"
const queueName2 = "produit-service-queue"
const queueName3 = "notification-service-queue"

app.use(express.json())

mongoose
    .connect(`mongodb://mongo:27017/dborders`, { useNewUrlParser: true })
    .then(() => console.log("connexion BD reussie"))
    .catch((error) => console.log('Erreur de connexion' + error));


async function connectToRabbitMQ() {
    const amqpServer = "amqp://guest:guest@rabbit:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue(queueName1);
    await channel.assertQueue(queueName2);
    await channel.assertQueue(queueName3);
}


connectToRabbitMQ().then(() => {

    channel.consume(queueName1, (data) => {
        const products = JSON.parse(data.content.toString());
        let total = 0; 
        products.forEach(element => {
            total += element.price;
        });

        const order = new orderModel({products, total})

        order.save().then((ord) => {
            channel.sendToQueue(queueName2, Buffer.from(JSON.stringify(ord)));
            channel.sendToQueue(queueName3, Buffer.from(JSON.stringify(ord)));
        } )

        channel.ack(data);
    })
})

app.listen(3000, () => {
    console.log("Server orders started");
})