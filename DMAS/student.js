import {

  initializeApp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

  getFirestore,
  collection,
  onSnapshot,
  doc,
  getDoc,
  deleteDoc,
  query,
  orderBy,
  setDoc,
  serverTimestamp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import {

  getAuth,
  onAuthStateChanged,
  signOut,
  deleteUser

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";


import {

  getMessaging,
  getToken,
  onMessage

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js";



// FIREBASE CONFIG

const firebaseConfig = {

  apiKey: "AIzaSyBE7UWWcOs5MEXg1pNwy-5BLRGFIFj9ksw",

  authDomain: "dmas-173314.firebaseapp.com",

  projectId: "dmas-173314",

  storageBucket: "dmas-173314.firebasestorage.app",

  messagingSenderId: "640512715844",

  appId: "1:640512715844:web:9d66519d26f31fda972011"

};


// INITIALIZE

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

const auth =
getAuth(app);

const messaging =
getMessaging(app);

// FOREGROUND NOTIFICATIONS

onMessage(

  messaging,

  function(payload){

    console.log(

      "Notification received:",

      payload

    );

    alert(

      payload.notification.title
      + "\n\n" +
      payload.notification.body
    );

  }

);





// PROFILE ELEMENTS

const studentNameDisplay =

document.getElementById(
"student-name-display"
);

const studentEmailDisplay =

document.getElementById(
"student-email-display"
);

const popupStudentName =

document.getElementById(
"popup-student-name"
);

const popupStudentEmail =

document.getElementById(
"popup-student-email"
);

const studentPrnDisplay =

document.getElementById(
"student-prn-display"
);

const studentMobileDisplay =

document.getElementById(
"student-mobile-display"
);

const studentAvatar =

document.getElementById(
"student-avatar"
);

const popupAvatar =

document.getElementById(
"popup-avatar"
);


// AUTH CHECK

onAuthStateChanged(

  auth,

  function(user){

    if(user){

      window.currentStudentUser =
      user;

      // NOTIFICATION PERMISSION

      Notification.requestPermission()

      .then(function(permission){

        if(permission === "granted"){

          getToken(

            messaging,

            {

              vapidKey:
              "BOtkgBL6XopbLiPwZejI0T82N5ib4Y0dQfxwDKHfEc4C2QjLOdyrxR_iN-c9jjR6Qlq8w-MiNwJ8hhI4JvU3d08"

            }

          )

          .then(function(currentToken){

            if(currentToken){

              console.log(

                "FCM TOKEN:",
                currentToken

              );

              window.studentToken =
              currentToken;


              setDoc(

                doc(
                  db,
                  "fcmTokens",
                  user.uid
                ),

                {

                  token:currentToken,

                  email:user.email

                }

              );

            }

          });

        }

      });

      // EMAIL

      studentEmailDisplay.innerText =
      user.email;

      popupStudentEmail.innerText =
      user.email;

      // GET STUDENT DATABASE DATA

      const studentRef =

      doc(
        db,
        "students",
        user.uid
      );


      getDoc(studentRef)

      .then(function(studentSnap){

        if(studentSnap.exists()){

          const studentData =

          studentSnap.data();


          // FULL NAME

          studentNameDisplay.innerText =

          studentData.fullName;


          popupStudentName.innerText =

          studentData.fullName;

          // PRN

          studentPrnDisplay.innerText =

          studentData.prn;


          // MOBILE

          studentMobileDisplay.innerText =

          studentData.mobile;

          // AVATAR INITIAL

          const firstLetter =

          studentData.fullName
          .charAt(0)
          .toUpperCase();


          studentAvatar.innerText =
          firstLetter;

          popupAvatar.innerText =
          firstLetter;

        }

        else{

          studentNameDisplay.innerText =
          "Student User";

          popupStudentName.innerText =
          "Student User";

          studentPrnDisplay.innerText =
          "Not Found";

          studentMobileDisplay.innerText =
          "Not Found";
        }

      });



    }

    else{

      window.location.href =
      "student-login.html";
    }

  }

);



// STUDENT PROFILE

const studentProfile =

document.getElementById(
"student-profile"
);

const studentPopup =

document.getElementById(
"student-panel-popup"
);



const logoutBtn =

document.getElementById(
"logout-btn"
);

const deleteAccountBtn =

document.getElementById(
"delete-account-btn"
);

const campusStatus =

document.getElementById(
"campus-status"
);

const campusStatusText =

document.getElementById(
"campus-status-text"
);

const studentResponseActions =

document.getElementById(
"student-response-actions"
);

const safeBtn =

document.getElementById(
"safe-btn"
);

const helpBtn =

document.getElementById(
"help-btn"
);

// LOGOUT

logoutBtn.addEventListener(

  "click",

  async function(){

    await signOut(auth);

    window.location.href =

    "student-login.html";

  }

);



// TOGGLE POPUP

studentProfile.addEventListener(
"click",
function(e){

  e.stopPropagation();

  studentPopup.classList.toggle(
    "show"
  );

});


// PREVENT POPUP CLOSE

studentPopup.addEventListener(
"click",
function(e){

  e.stopPropagation();
});


// CLOSE ON OUTSIDE CLICK

document.addEventListener(
"click",
function(){

  studentPopup.classList.remove(
    "show"
  );

});


// FIREBASE ALERTS

// LIVE POPUP

const livePopup =

document.getElementById(
"live-alert-popup"
);

const popupTitle =

document.getElementById(
"popup-title"
);

const popupMessage =

document.getElementById(
"popup-message"
);



const studentAlertList =

document.getElementById(
"student-alert-list"
);


const alertsRef =

query(

  collection(db,"alerts"),

  orderBy(
    "createdAt",
    "desc"
  )

);

let latestAlertId = null;

onSnapshot(

  alertsRef,

  function(snapshot){

    studentAlertList.innerHTML = "";

    const alertsArray = [];

    let activeIncidentCount = 0;

    snapshot.forEach(function(doc){

      const data = doc.data();

      if(data.status !== "ACTIVE"){

        return;
      }

      if(data.status === "ACTIVE"){

        activeIncidentCount++;
      }

      alertsArray.push(data);

      const alertCard =

      document.createElement("div");


      alertCard.classList.add(
        "student-alert"
      );

      if(data.level === "Level 1"){

        alertCard.classList.add(
          "low-alert"
        );
      }

      else if(data.level === "Level 2"){

        alertCard.classList.add(
          "medium-alert"
        );
      }

      else if(data.level === "Level 3"){

        alertCard.classList.add(
          "critical-alert"
        );
      }


      alertCard.innerHTML = `

        <strong>
          ${data.title}
        </strong>

        <p>
          ${data.message}
        </p>

        <span class="student-alert-time">

          ${new Date(
            data.createdAt
          ).toLocaleTimeString()}

        </span>

      `;


      studentAlertList.appendChild(
        alertCard
      );


      if(

        studentAlertList.children.length > 8

      ){

        studentAlertList.removeChild(

          studentAlertList.lastElementChild

        );

      }

      // SHOW POPUP ONLY FOR NEW ACTIVE ALERT

      // SHOW POPUP ONLY FOR LATEST ALERT

      if(

        alertsArray.length > 0

      ){

        const latestAlert =

        alertsArray[0];

        if(

          latestAlertId !== latestAlert.createdAt

        ){

          latestAlertId =

          latestAlert.createdAt;

          popupTitle.innerText =
          latestAlert.title;

          popupMessage.innerText =
          latestAlert.message;

          livePopup.classList.add(
            "show"
          );

          setTimeout(function(){

            livePopup.classList.remove(
              "show"
            );

          },5000);

        }

      }

    });

    // REALTIME CAMPUS STATUS

    if(activeIncidentCount > 0){

      campusStatus.innerText =
      "ACTIVE ALERTS";

      campusStatus.style.color =
      "#ff2d2d";

      campusStatusText.innerText =
      "Emergency incidents are currently active across campus. Stay alert and follow DMAS instructions.";

      studentResponseActions.style.display =
      "flex";
    }

    else{

      campusStatus.innerText =
      "NORMAL";

      campusStatus.style.color =
      "#4da3ff";

      campusStatusText.innerText =
      "No active emergency threats detected.";

      studentResponseActions.style.display =
      "none";
    }

  }

);




// LOGOUT

logoutBtn.addEventListener(

  "click",

  function(){

    signOut(auth)

    .then(function(){

      window.location.href =
      "student-login.html";
    });

  }

);

// DELETE ACCOUNT

deleteAccountBtn.addEventListener(

  "click",

  async function(){

    const confirmDelete =

    confirm(

      "Delete this student account permanently?"

    );


    if(!confirmDelete){

      return;
    }


    const user =
    auth.currentUser;


    try{

      // DELETE FIRESTORE DATA

      await deleteDoc(

        doc(
          db,
          "students",
          user.uid
        )

      );


      // DELETE AUTH ACCOUNT

      signOut(auth)

      .then(function(){

        window.location.href =
        "student-login.html";
      });


      alert(
        "Account Deleted"
      );


      window.location.href =
      "student-login.html";

    }

    catch(error){

      alert(
        error.message
      );
    }

  }

);


// STUDENT RESPONSE SYSTEM

async function submitEmergencyResponse(
  responseType
){

  const user =
  auth.currentUser;

  if(!user){

    return;
  }

  try{

    await setDoc(

      doc(
        db,
        "responses",
        user.uid
      ),

      {

        response: responseType,

        updatedAt:
        serverTimestamp(),

        email:user.email

      }

    );

    if(responseType === "SAFE"){

      safeBtn.innerText =
      "✅ MARKED SAFE";
    }

    else{

      helpBtn.innerText =
      "🚨 HELP REQUESTED";
    }

  }

  catch(error){

    console.log(error);
  }

}


// SAFE BUTTON

safeBtn.addEventListener(

  "click",

  function(){

    submitEmergencyResponse(
      "SAFE"
    );

  }

);


// HELP BUTTON

helpBtn.addEventListener(

  "click",

  function(){

    submitEmergencyResponse(
      "HELP"
    );

  }

);




