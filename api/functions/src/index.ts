import * as functions from 'firebase-functions';
import {Request, Response} from 'express';
import routes from './routes'
import * as bodyParser from "body-parser";

import express = require("express");
import cors = require("cors");

const app = express();
app.use(cors({origin: true})); // Automatically allow cross-origin requests
app.use('/', routes) // Routes
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

exports.api = functions.https.onRequest((request: Request, response: Response) => {
  if (!request.path) {
    request.url = `/${request.url}`; // Prepend '/' to keep query params if any
  }
  return app(request, response);
});



// -------------------------------- DEBUGGING --------------------------------
// Creates an endpoint to test and debug Firebase-related bugs
// exports.debug = functions.https.onRequest((request: Request, response: Response) => {
//   response.json('debugging info')
// });