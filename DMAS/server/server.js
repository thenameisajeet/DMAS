const express = require("express");

const cors = require("cors");

const admin = require("firebase-admin");


const {

  initializeApp

} = require("firebase/app");


const {

  getFirestore,
  collection,
  getDocs

} = require("firebase/firestore");


const serviceAccount = require(

  "./serviceAccountKey.json"

);


admin.initializeApp({

  credential:

  admin.credential.cert(
    serviceAccount
  )

});


// FIREBASE CLIENT CONFIG

const firebaseConfig = {

  apiKey:
  "AIzaSyBE7UWWcOs5MEXg1pNwy-5BLRGFIFj9ksw",

  authDomain:
  "dmas-173314.firebaseapp.com",

  projectId:
  "dmas-173314",

  storageBucket:
  "dmas-173314.firebasestorage.app",

  messagingSenderId:
  "640512715844",

  appId:
  "1:640512715844:web:9d66519d26f31fda972011"

};


// FIRESTORE

const firebaseApp =
initializeApp(firebaseConfig);

const db =
getFirestore(firebaseApp);


const app = express();

app.use(cors());

app.use(express.json());


// TEST ROUTE

app.get(

  "/",

  function(req,res){

    res.send(

      "DMAS Notification Server Running"

    );

  }

);

// TEST PUSH NOTIFICATION

app.get(

  "/test-notification",

  async function(req,res){

    try{

      const message = {

        notification: {

          title:
          "DMAS Emergency Alert",

          body:
          "This is a real push notification test"

        },

        token:
        "cb_Gt7qnhtU099zg62ii7q:APA91bFEwmxleS_GUHBKjDllyxnmN-16aBZQEHF0l-JG8CUyaMmLaKeM1u4gwYOz_280WtdFSalxBFWIr6oNYk2DzZB_mryiwtAr4dpBd7hRJLuWHFkYKnA"

      };


      await admin
      .messaging()
      .send(message);

      res.send(

        "Notification sent"

      );

    }

    catch(error){

      console.log(error);

      res.send(error.message);

    }

  }

);

// SEND NOTIFICATION TO ALL STUDENTS

app.post(

  "/send-notification",

  async function(req,res){

    try{

      const {

        title,
        body

      } = req.body;


      const tokensSnapshot =

      await getDocs(

        collection(
          db,
          "fcmTokens"
        )

      );


      const tokens = [];

      tokensSnapshot.forEach(function(doc){

        const data = doc.data();

        if(data.token){

          tokens.push(data.token);

        }

      });


      if(tokens.length === 0){

        return res.send({

          success:false,

          message:
          "No tokens found"

        });

      }


      const message = {

        notification: {

          title:title,

          body:body

        },

        tokens:tokens

      };


      const response =

      await admin
      .messaging()
      .sendEachForMulticast(
        message
      );


      res.send({

        success:true,

        sent:response.successCount

      });

    }

    catch(error){

      console.log(error);

      res.send({

        success:false,

        error:error.message

      });

    }

  }

);




// START SERVER

app.listen(

  5000,

  function(){

    console.log(

      "Server running on port 5000"

    );

  }

);