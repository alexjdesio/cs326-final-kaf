import pkg from "faker";
import express from "express";
import * as bodyParser from "body-parser";
const {name,internet,company,address,lorem,commerce,image} = pkg;


'use strict';

//EXPERIMENTING WITH EXPRESS.JS
const app = express(); // this is the "app"
const port = 8080;     // we will listen on this port

app.listen(port, () => {
      console.log('App listening at http://localhost:${port}');
});

app.use('/',express.static('./html')); //Serves static pages(index.html, search.html, etc.)
