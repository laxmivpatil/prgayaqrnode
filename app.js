const express = require('express');
// const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const path = require('path');

const studentFinalRoutes = require('./route/studentfinal');

const QRCode = require('qrcode');
const mongoose = require('mongoose');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const Jimp = require('jimp');
const sharp = require('sharp');
// const QRCode = require('qrcode');
const multer = require('multer');
const app = express();
const fs = require("fs");
const bodyParser = require('body-parser');
app.use("/store", express.static("store"));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
const PORT = 7000;
 const { google } = require("googleapis");
// const sharp = require('sharp');
const jsQR = require('jsqr');
const service = google.sheets("v4");
 
// Enable CORS for the frontend
app.use(cors());

// Middleware to handle file uploads
app.use(fileUpload());


 

app.use('/studentfinal', studentFinalRoutes);


app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  });
  
  
  mongoose
    .connect(
      'mongodb+srv://techversedb:MongoDBazure%40@rentlemongodbcluster.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256'
    )
    .then(result => {
        console.log('connected');
      
    })
    .catch(err => console.log(err));


    

    
const server = app.listen(process.env.PORT || 7000, () => {
  console.log(`Server is running on port ${process.env.PORT || 7000}`);
});
    server.setTimeout(60000);
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });