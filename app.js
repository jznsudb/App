const express = require('express');
const app = express();
const port = 5000;
const mongoose = require('mongoose');
const {mongouri} = require('./keys')

require("./models/user")
require("./models/post")
app.use(express.json())
app.use(require('./routes/auth'))
app.use(require('./routes/post'))

mongoose.connect(mongouri);

mongoose.connection.on('connected',()=>{
    console.log("connected successfully");
})

mongoose.connection.on('error',(error)=>{
    console.log(error);
})

app.listen(port, ()=>{console.log("Server Started");})