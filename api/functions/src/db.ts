require('dotenv').config();

// ------     PRODUCTION DATABASE --- 
import admin = require('firebase-admin');
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: 'https://realtime-ava-api.firebaseio.com/'
});
export const prodDB = admin.database();


// ------     TESTING DATABASE ------ 
// Test on a Realtime Database Emulator
import firebase = require("@firebase/testing");
export const testDB = firebase.initializeAdminApp({ databaseName: "test-database" }).database();
async () => {
  await firebase.loadDatabaseRules({
    databaseName: "test-database",
    rules: "{'rules': {'.read': true,'.write': true}"
  });
}
