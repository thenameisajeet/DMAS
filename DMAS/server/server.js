const express = require("express");

const cors = require("cors");

const axios = require("axios");

const admin = require("firebase-admin")


const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT
);


admin.initializeApp({

  credential:

  admin.credential.cert(
    serviceAccount
  )

});

const db = admin.firestore();

// FIRESTORE

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

async function sendSMS(messageText){

  try{

    const studentsSnapshot =

    await db
    .collection("students")
    .get();

    const numbers = [];

    studentsSnapshot.forEach(function(doc){

      const data = doc.data();

      if(data.mobile){

        numbers.push(data.mobile);

      }

    });

    if(numbers.length === 0){

      console.log(
        "No mobile numbers found"
      );

      return;
    }

    await axios.post(

      "https://www.fast2sms.com/dev/bulkV2",

      {

        route:"q",

        message:messageText,

        language:"english",

        numbers:numbers.join(",")

      },

      {

        headers:{

          authorization:
          process.env.FAST2SMS_API_KEY

        }

      }

    );

    console.log(
      "SMS SENT SUCCESSFULLY"
    );

  }

  catch(error){

    console.log(
      "SMS ERROR",
      error.message
    );

  }

}

app.post(

  "/send-notification",

  async function(req,res){

    try{

      const {

        title,
        body

      } = req.body;


      const tokensSnapshot =
      await db.collection("fcmTokens").get();


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

      await sendSMS(

        title + " : " + body

      );

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
