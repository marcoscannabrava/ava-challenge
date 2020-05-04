import {Request, Response} from 'express'
import {prodDB, testDB} from '../db'

import ServerConstructor = require('../serverOtOperations');
import hydrateOperations = require('../serverOtOperations');

export default async (req: Request, res: Response) => {
  // const payload: Conversation = req.body  // [TODO][optional] create the Conversation interface
  const payload = req.body;
  let db = undefined;
  let server = undefined;

  // choose db based on environment
  process.env.NODE_ENV === 'development' ? db = testDB : db = prodDB
  
  try {
    const ref = db.ref();
    let val: any = undefined;
    let msg = "";
    let text = payload.data.text;
    let operations: JSON[] = [
      JSON.parse({
      type: payload.data.type,
      text: payload.data.text,
      index: payload.data.index,
      length: payload.data.length
    }.toString())];

    // conversation exists in db ? updates text : starts conversation
    ref.child('conversations').orderByChild("conversationId").equalTo(payload.conversationId).once("value", (snapshot: { exists: () => any; val: () => any; }) => {
      if (snapshot.exists()){
        // get text from conversation and update it
        val = snapshot.val();
        // operations.push(val.operations);
        operations = hydrateOperations(operations);

        try {
          server = ServerConstructor.new(val.text, operations); 
          // [WIP] what is revision? track number of mutations? 
          server.receiveOperation()
        } catch (e) {
          // operation revision not in history
        }
      } else {
        // create conversation
        // [potential][BUG] Assynchronous 'conversation' push to DB might not finish before pushing 'operations' child
        ref.child('conversations').push({'conversationId': payload.conversationId, 'text': text});
      }

      ref.child('conversations/' + payload.conversationId).child('operations').set(operations);

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


// Expected Request (payload)
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

// Example SimpleTextOperation Behavior
/*
test.strictEqual("Hallo Welt!", new Insert("Welt", 6).apply("Hallo !"));
test.strictEqual("Hallo !", new Delete(4, 6).apply("Hallo Welt!"));
*/