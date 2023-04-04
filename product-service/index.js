const express = require('express')
const mongoose = require('mongoose')
const productRoute = require('./routes/product')

const app = express()

app.use(express.json())

mongoose
    .connect(`mongodb://localhost:27017/dbproducts`, { useNewUrlParser: true })
    .then(() => console.log("connexion BD reussie"))
    .catch((error) => console.log('Erreur de connexion' + error));

app.use("/products", productRoute);

app.listen(3000, () => {
    console.log("Server product started");
})