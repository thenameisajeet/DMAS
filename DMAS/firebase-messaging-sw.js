importScripts(

  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js"

);

importScripts(

  "https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js"

);


// FIREBASE CONFIG

firebase.initializeApp({

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

});


// MESSAGING

const messaging =
firebase.messaging();


// BACKGROUND NOTIFICATIONS

messaging.onBackgroundMessage(

  function(payload){

    console.log(

      "Background notification:",

      payload

    );

    self.registration.showNotification(

      payload.notification.title,

      {

        body:
        payload.notification.body,

        icon:
        "/favicon.ico"

      }

    );

  }

);