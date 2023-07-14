import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {
  getDatabase,
  ref,
  push,
  onValue,
  set,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL: "https://endorsements-e0f9d-default-rtdb.firebaseio.com/",
};

const app = initializeApp(appSettings);
const database = getDatabase(app);
const endorsementsInDB = ref(database, "endorsements");

// const container = document.getElementById("container");

const endorsementField = document.getElementById("endorsement-field");
const toField = document.getElementById("to-field");
const fromField = document.getElementById("from-field");

const publishBtn = document.getElementById("publish-btn");

// array used to convert month number to month name

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// gets todays date for post

let date = new Date();
let year = date.getFullYear();
let month = monthNames[date.getMonth()];
let day = date.getDate();
let currentDate = `${month} ${day}, ${year}`;

// stores the input field values in variables

publishBtn.addEventListener("click", function () {
  let toFieldValue = toField.value;
  let endorsementFieldValue = endorsementField.value;
  let fromFieldValue = fromField.value;
  let likes = 0;

  // clears input fields

  endorsementField.value = "";
  fromField.value = "";
  toField.value = "";

  // converts to object

  let endorsementItem = {
    toDB: toFieldValue,
    dateDB: currentDate,
    endorsementDB: endorsementFieldValue,
    fromDB: fromFieldValue,
    likes: likes,
  };

  // Pushes object to the database

  push(endorsementsInDB, endorsementItem);
});

// enters object from onValue below into fields

function getEndorsement(endorsementID, endorsementValue) {
  let endorsementItem = document.createElement("div");

  endorsementItem.innerHTML = /*html*/ `
        <div class="post">
          <div class="info">
            <p class="tofrom">To: ${endorsementValue.toDB}</p>
            <p>${endorsementValue.dateDB}</p>
          </div>
          <p class="endorsement-text">${endorsementValue.endorsementDB}</p>
          <div class="info">
              <p class="tofrom">From: ${endorsementValue.fromDB}</p>
              <p id="${endorsementID}" class="like-counter">❤️ ${endorsementValue.likes}</p>
          </div>
        </div>`;

  // allows likes to be added

  let likeBtn = endorsementItem.querySelector(`#${endorsementID}`);

  likeBtn.addEventListener("click", function () {
    endorsementValue.likes += 1;
    likeBtn.innerHTML = `❤️ ${endorsementValue.likes}`;
    let endorsementRef = ref(database, `endorsements/${endorsementID}/likes`);
    set(endorsementRef, endorsementValue.likes);
  });

  container.prepend(endorsementItem);
}

// gets objects from DB

onValue(endorsementsInDB, function (snapshot) {
  if (snapshot.exists()) {
    let itemsArray = Object.entries(snapshot.val());

    container.innerHTML = "";

    for (let i = 0; i < itemsArray.length; i++) {
      let currentItem = itemsArray[i];
      let endorsementID = currentItem[0];
      let endorsementValue = currentItem[1];

      getEndorsement(endorsementID, endorsementValue);
    }
  } else {
    container.innerHTML = "No Endorsements";
  }
});
