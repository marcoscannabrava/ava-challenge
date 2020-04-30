import functions from 'firebase-functions';
import express from 'express';
import {Request, Response} from 'express';
import cors from 'cors';
import routes from './src/routes'

const app = express();
app.use(cors({origin: true})); // Automatically allow cross-origin requests
app.use('/', routes) // Routes

// app.use(myMiddleware); // Add middleware to authenticate requests

// Expose Express API as a single Cloud Function:
// exports.widgets = functions.https.onRequest(app);

exports.api = functions.https.onRequest((request: Request, response: Response) => {
  if (!request.path) {
    request.url = `/${request.url}`; // Prepend '/' to keep query params if any
  }
  return app(request, response);
});