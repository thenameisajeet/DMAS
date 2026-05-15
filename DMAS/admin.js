// ADMIN AUTH PROTECTION

if(

  localStorage.getItem(
    "dmasAdmin"
  )

  !==

  "true"

){

  window.location.href =
  "admin-login.html";

}

import {

  initializeApp

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import {

  getFirestore,
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where

}

from

"https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


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

// =========================
// LIVE CLOCK
// =========================

function updateClock(){

  const clock =
  document.getElementById("clock");

  const now = new Date();

  let hours = now.getHours();
  let minutes = now.getMinutes();

  let ampm = "AM";

  if(hours >= 12){

    ampm = "PM";
  }

  if(hours > 12){

    hours = hours - 12;
  }

  if(minutes < 10){

    minutes = "0" + minutes;
  }

  clock.innerText =
  hours + ":" + minutes + " " + ampm;
}

updateClock();

setInterval(updateClock,1000);



// =========================
// TOAST SYSTEM
// =========================

const toast =
document.getElementById("toast");

const toastMessage =
document.getElementById("toast-message");

function showToast(message){

  toastMessage.innerText = message;

  toast.classList.add("show");

  setTimeout(function(){

    toast.classList.remove("show");

  },3000);
}



// =========================
// ALERT BUTTONS
// =========================

const fire =
document.querySelector(".fire");

const flood =
document.querySelector(".flood");

const earthquake =
document.querySelector(".earthquake");

const stopAlertButton =

document.getElementById(
"stop-alert-btn"
);



// FIRE PRESET

fire.addEventListener("click",function(){

  presetMode = true;

  customModal.classList.add("show");

  alertTitle.value =
  "Campus Fire Emergency";

  alertCategory.value =
  "Fire";

  alertTitle.disabled = true;

  alertCategory.disabled = true;
});


// FLOOD PRESET

flood.addEventListener("click",function(){

  presetMode = true;

  customModal.classList.add("show");

  alertTitle.value =
  "Campus Flood Warning";

  alertCategory.value =
  "Flood";

  alertTitle.disabled = true;

  alertCategory.disabled = true;
});


// EARTHQUAKE PRESET

earthquake.addEventListener("click",function(){

  presetMode = true;

  customModal.classList.add("show");

  alertTitle.value =
  "Earthquake Emergency";

  alertCategory.value =
  "Other";

  alertTitle.disabled = true;

  alertCategory.disabled = true;
});


// =========================
// CUSTOM ALERT MODAL
// =========================

const customButton =
document.querySelector(".custom-alert-btn");

const customModal =
document.getElementById("custom-modal");

const closeModal =
document.getElementById("close-modal");

// ADMIN PANEL

const adminProfile =
document.getElementById("admin-profile");

const adminPanel =
document.getElementById("admin-panel");


const modalTitle =
document.getElementById("modal-title");


// OPEN MODAL

customButton.addEventListener("click",function(){

  presetMode = false;

  customModal.classList.add("show");


  // RESET FIELDS

  alertTitle.value = "";

  alertMessage.value = "";


  // ENABLE INPUTS

  alertTitle.disabled = false;

  alertCategory.disabled = false;

});


// CLOSE MODAL

closeModal.addEventListener("click",function(){

  customModal.classList.remove("show");

});


// CLOSE ON OUTSIDE CLICK

customModal.addEventListener("click",function(e){

  if(e.target === customModal){

    customModal.classList.remove("show");
  }

});

// =========================
// SEND CUSTOM ALERT
// =========================

const sendAlertButton =
document.querySelector(".send-alert-btn");

const incidentList =
document.querySelector(".incident-list");

// DASHBOARD STATS

const safeCount =
document.getElementById("safe-count");

const pendingCount =
document.getElementById("pending-count");

const priorityCount =
document.getElementById("priority-count");

const activeAlertCount =
document.getElementById("active-alert-count");


// INPUTS

const alertTitle =
document.getElementById("alert-title");

const alertCategory =
document.getElementById("alert-category");

const alertLevel =
document.getElementById("alert-level");

const alertMessage =
document.getElementById("alert-message");

// PRESET ALERT MODE

let presetMode = false;


// SEND ALERT

sendAlertButton.addEventListener("click",function(){

  // VALIDATION

  if(

    alertTitle.value.trim() === "" ||

    alertMessage.value.trim() === ""

  ){

    showToast(

      "⚠ Please fill required information"

    );

    return;
  }




// SAVE TO FIREBASE

addDoc(

  collection(db,"alerts"),

  {

    title: alertTitle.value,

    message: alertMessage.value,

    level: alertLevel.value,

    category: alertCategory.value,

    status: "ACTIVE",

    createdAt: Date.now(),

    resolvedAt: null

  }

);


// SEND PUSH NOTIFICATION

fetch(
  
    "https://dmas-2e3w.onrender.com/send-notification",

  {

    method:"POST",

    headers:{

      "Content-Type":
      "application/json"

    },

    body:JSON.stringify({

    title:alertTitle.value,

    body:alertMessage.value

  })

  }

)

.then(function(response){

  return response.json();

})

.then(function(data){

  console.log(

    "Push Notification Result:",

    data

  );

});



// TOAST

showToast(
  "🚨 Emergency Alert Sent Successfully"
);


// CLOSE MODAL

customModal.classList.remove("show");


// CLEAR FORM

alertTitle.value = "";

alertMessage.value = "";

// RESET PRESET MODE

presetMode = false;

alertTitle.disabled = false;

alertCategory.disabled = false;

});

// ADMIN PANEL TOGGLE

adminProfile.addEventListener("click",function(){

  adminPanel.classList.toggle("show");

});

// CLOSE PANEL ON OUTSIDE CLICK

document.addEventListener("click",function(e){

  if(

    !adminProfile.contains(e.target) &&

    !adminPanel.contains(e.target)

  ){

    adminPanel.classList.remove("show");

  }

});


// STOP ACTIVE ALERTS

stopAlertButton.addEventListener(

  "click",

  async function(){

    const confirmStop =

    confirm(

      "Resolve all active emergency alerts?"
    );

    if(!confirmStop){

      return;
    }

    try{

      const alertsSnapshot =

      await getDocs(

        collection(db,"alerts")
      );

      for(const alertDoc of alertsSnapshot.docs){

        const data =
        alertDoc.data();

        if(data.status === "ACTIVE"){

          await updateDoc(

            doc(
              db,
              "alerts",
              alertDoc.id
            ),

            {

              status:"RESOLVED",

              resolvedAt:Date.now()

            }

          );

        }

      }

      showToast(

        "✅ All emergency alerts resolved"

      );

      // CLEAR ALL STUDENT RESPONSES

      const responsesSnapshot =

      await getDocs(

        collection(db,"responses")

      );

      for(const responseDoc of responsesSnapshot.docs){

        await deleteDoc(

          doc(
            db,
            "responses",
            responseDoc.id
          )

        );

      }


      // RESET COUNTERS

      safeCount.innerText = "0";

      priorityCount.innerText = "0";

      pendingCount.innerText = "0";// CLEAR ALL STUDENT RESPONSES

      const responsesSnapshot =

      await getDocs(

        collection(db,"responses")

      );

      for(const responseDoc of responsesSnapshot.docs){

        await deleteDoc(

          doc(
            db,
            "responses",
            responseDoc.id
          )

        );

      }


      // RESET COUNTERS

      safeCount.innerText = "0";

      priorityCount.innerText = "0";

      pendingCount.innerText = "0";

    }

    catch(error){

      console.log(error);

      showToast(

        "❌ Failed to resolve alerts"

      );

    }

  }

);

// REALTIME ADMIN ALERTS

const adminAlertsQuery =

query(

  collection(db,"alerts"),

  orderBy(
    "createdAt",
    "desc"
  )

);

onSnapshot(

  adminAlertsQuery,

  function(snapshot){

    incidentList.innerHTML = "";

    let activeCount = 0;

    snapshot.forEach(function(alertDoc){

      const data =
      alertDoc.data();

      if(data.status !== "ACTIVE"){

        return;
      }

      activeCount++;

      const incidentCard =

      document.createElement("div");

      incidentCard.classList.add(
        "incident"
      );

      let icon = "🚨";

      if(data.category === "Fire"){
        icon = "🔥";
      }

      else if(data.category === "Flood"){
        icon = "🌊";
      }

      else if(data.category === "Medical"){
        icon = "🚑";
      }

      else if(data.category === "Security"){
        icon = "⚠";
      }

      else if(data.category === "Weather"){
        icon = "🌩";
      }

      incidentCard.innerHTML = `

        <div class="incident-header">

          <div class="incident-title-wrap">

            <span>

              ${icon}
              <strong>${data.title}</strong>

            </span>

            <div class="incident-badge">

              ${data.category}

            </div>

            <button class="expand-btn">

              View

            </button>

          </div>

        </div>

        <div class="incident-details">

          <p>
            ${data.message}
          </p>

          <br>

          <span class="incident-level">

            ${data.level}

          </span>

          <br><br>

          <span class="incident-time">

            ${new Date(
              data.createdAt
            ).toLocaleTimeString()}

          </span>

        </div>
      `;

      incidentList.appendChild(
        incidentCard
      );

      // EXPAND INCIDENT

      const expandButton =

      incidentCard.querySelector(
        ".expand-btn"
      );

      const incidentDetails =

      incidentCard.querySelector(
        ".incident-details"
      );

      incidentDetails.style.display =
      "none";


      expandButton.addEventListener(

        "click",

        function(){

          const isOpen =

          incidentDetails.style.display
          === "block";

          if(isOpen){

            incidentDetails.style.display =
            "none";

            expandButton.innerText =
            "View";
          }

          else{

            incidentDetails.style.display =
            "block";

            expandButton.innerText =
            "Close";
          }

        }

      );

    });

    activeAlertCount.innerText =
    activeCount;

  }

);

// REALTIME STUDENT RESPONSES

const responseQuery =

collection(
  db,
  "responses"
);

onSnapshot(

  responseQuery,

  function(snapshot){

    let safeStudents = 0;

    let helpStudents = 0;

    snapshot.forEach(function(responseDoc){

      const data =
      responseDoc.data();

      if(data.response === "SAFE"){

        safeStudents++;
      }

      else if(
        data.response === "HELP"
      ){

        helpStudents++;
      }

    });

    safeCount.innerText =
    safeStudents;

    priorityCount.innerText =
    helpStudents;

    pendingCount.innerText =
    activeAlertCount.innerText -
    (
      safeStudents +
      helpStudents
    );

    if(
      pendingCount.innerText < 0
    ){

      pendingCount.innerText = 0;
    }

  }

);

// ADMIN LOGOUT

const logoutButton =

document.querySelector(
  ".logout-btn"
);

logoutButton.addEventListener(

  "click",

  function(){

    localStorage.removeItem(
      "dmasAdmin"
    );


    window.location.href =
    "admin-login.html";

  }

);
