const express = require('express');
const app = express();
const database = require('./config/db');
const consign = require('consign');

// Consign
consign()
    .then('./config/middlewares.js')
    .then('./api/')
    .then('./config/routes.js')
    .into(app); // Put "app" as Param in the function

app.db = database;

const port = 3333;
app.listen(port, () => console.log(`Server is Running on port: ${port}`));