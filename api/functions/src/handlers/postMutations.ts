import {Request, Response} from 'express'
import {prodDB, testDB} from '../db'

// import { makeOps } from '../OTAlgorithm';

export default async (req: Request, res: Response) => {
  // const payload: Conversation = req.body  // [TODO][optional] create the Conversation interface
  const payload = req.body;
  let db = undefined;
  process.env.NODE_ENV === 'development' ? db = testDB : db = prodDB // choose db based on environment
  
  try {
    const ref = db.ref();
    let val: any = undefined;
    let msg = "";
    let text = payload.data.text;

    ref.child('conversations').orderByChild("conversationId").equalTo(payload.conversationId).once("value", (snapshot: { exists: () => any; val: () => any; }) => {
      if (snapshot.exists()){
        val = snapshot.val();
        console.log("conversation exists!", val);
        text = val;
      } else {
        console.log("conversation doesn't exist!", val);
      }
      ref.push(payload);
    }, (errorObject: { code: string; }) => {
      msg = errorObject.code;
    });

    // ref.on("value", (snapshot: { val: () => any; }) => {
    //   val = snapshot.val();
    //   if(!val) {
    //     ref.push(payload);
    //   } else {
    //     console.log('snapshot.val()');
    //     console.log(val);
    //     text = val[0].data.text;
    //   }
    // }, (errorObject: { code: string; }) => {
    //   msg = errorObject.code;
    // });

    const response = {
      "msg": msg,
      "ok": !!(msg === ""),
      "text": text
    }

    res.status(201).json(response)
  } catch (e) {
    res.status(400).json({error: e.name, msg: 'error caught'})
  }
}


// Example Request
/*
{
  "author": "alice | bob",
  "conversationId": "string",
  "data": {
    "index": "number",
    "length": "number | undefined",
    "text": "string | undefined",
    "type": "insert | delete"
  },
  "origin": {
    "alice": "integer",
    "bob": "integer"
  }
}
*/