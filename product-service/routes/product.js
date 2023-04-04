const express = require('express')
const amqp = require('amqplib')
const productModel = require('../model/product')

const routes = express.Router();
var connection, channel;
const queueName1 = "order-service-queue"
const queueName2 = "produit-service-queue"

async function connectToRabbitMQ() {
    const amqpServer = "amqp://guest:guest@localhost:5672";
    connection = await amqp.connect(amqpServer);
    channel = await connection.createChannel();
    await channel.assertQueue(queueName1);
    await channel.assertQueue(queueName2);
 }

 connectToRabbitMQ().then(() => {
    console.log("Connection RabbitMQ resussie")
 })


routes.post('/', (req, res) => {

    const product = new productModel(req.body);

    product.save().then((p) => {
        res.status(201).json({
            message: "Produit cree avec succes",
            produit: p
        })
    }).catch((error) => {
        res.status(500).json({
            message: "erreur creation product",
        })
    })

})

routes.post('/buy', (req, res) => {
    
    productModel.find({_id: {$in: req.body}}).then((prods) => {
        channel.sendToQueue(queueName1, Buffer.from(JSON.stringify(prods)));
        res.sendStatus(200);
    });
})

module.exports = routes;