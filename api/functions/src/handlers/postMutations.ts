import {Request, Response} from 'express'
import {prodDB, testDB} from '../db'

import SimpleTextOperation = require('../simpleTextOT');

const Insert = SimpleTextOperation.Insert;
const Delete = SimpleTextOperation.Delete;

export default async (req: Request, res: Response) => {
  // const payload: Conversation = req.body  // [TODO][optional] create the Conversation interface
  const payload = req.body;
  let db = undefined;

  // choose db based on environment
  process.env.NODE_ENV === 'development' ? db = testDB : db = prodDB
  
  try {
    const ref = db.ref();
    let val: any = undefined;
    let msg = "";
    let text = payload.data.text;

    // conversation exists in db ? updates text : starts conversation
    ref.child('conversations').orderByChild("conversationId").equalTo(payload.conversationId).once("value", (snapshot: { exists: () => any; val: () => any; }) => {
      if (snapshot.exists()){
        // get text from conversation and update it
        // if origin doesn't match return an error
        val = snapshot.val();
        if (payload.data.type === "insert") text = new Insert(text, payload.data.index).apply(val.text);
        if (payload.data.type === "delete") text = new Delete(payload.data.length, payload.data.index).apply(val.text);
      } else {
        // create conversation
        ref.child('conversations').push({'conversationId': payload.conversationId, 'text': text});
      }
      ref.child('mutations').push(payload);
    }, (errorObject: { code: string; }) => {
      msg = errorObject.code;
    });

    const response = {
      "msg": msg,
      "ok": !!(msg === ""),
      "text": text
    }

    res.status(201).json(response)
  } catch (e) {
    res.status(400).json({"msg": `${e.name}: error updating database...`, "ok": false, "text": "something went wrong... sorry"})
  }
}


// Expected Request
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

// Example Conversation Object from DB
/*
{
  conversationId: "string",
  text: "string"
}
*/