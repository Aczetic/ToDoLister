// TODO:when the add card is clicked following things need to be done:
//     title and description elements to be created and inserted inside another created data element
//     the background color is to be set to the background color of its parent
// TODO: elipsses should be shown in the card if the text goes out of the container
// TODO: the current alert creation is wrong because it uses the same element for displaying errors instead of differnt ones being created and appended

// let objs = document.getElementsByClassName("note");
// for (let elem in objs) {
//   objs[elem].addEventListener("click", (event) => {
//     if (event.target.className.indexOf("note") != -1) {
//       console.log("true");
//     } else {
//       console.log("false");
//     }
//   });
// }

let isNoteCreateDialogueBoxOpen = false;
function closeClicked(id) {
  let elem = document.getElementById(id);
  elem.style.transform = "scale(0)";
}
setAlertBoxToOriginalPosition = undefined; // this variable holdes the reference to the setTimeout function
// USE : the setTimeout invokes after 2 seconds but when another alert is created the previous one should be cleared
function createAlert(message, messageType, isAlertPromptType = false) {
  if (isAlertPromptType === false) {
    //first clear the previous call of setTimeout

    if (Boolean(setAlertBoxToOriginalPosition))
      clearTimeout(setAlertBoxToOriginalPosition);

    // if it does not has optional buttons
    let elem = document.querySelector("#alertBox");
    let colors = {
      error: "rgba(255,60,60,0.5)", // red
      warning: "rgba(255, 255, 0,0.5)", //yellow
      message: "rgba(60,60,200,0.5)", //blue
      success: "rgba(60,200,60,0.5)", //green
    };
    elem.innerText = message; // set the message
    elem.style.border = "3px solid " + colors[messageType]; // set the border color
    elem.style.backgroundColor = colors[messageType]; // set the text color
    elem.style.top = "50px"; // bring the message box down

    setAlertBoxToOriginalPosition = setTimeout(() => {
      // call an async function to put back the alert box to its original position
      elem.style.top = "-100px";
      setAlertBoxToOriginalPosition = undefined;
    }, 2000);
  }
}

function createNote() {
  // bring the dialogue box up
  let noteFormElem = document.querySelector("#noteForm");
  noteFormElem.style.transform = "scale(1)";
  // set the heading text
  noteFormElem.querySelector("h2").innerText = "Create A New Note";
}

let selectedColor = undefined;

function setColor(event) {
  selectedColor = event.target.getAttribute("class");
  selectedColor = selectedColor.substr(
    selectedColor.indexOf("tiles") + "tiles".length + 1
  );
  backgroundColors = {
    red: "rgba(255,0,0,0.5)",
    orange: "rgba(252, 156, 13, 0.2)",
    yellow: "rgba(236, 253, 9, 0.2)",
    green: "rgba(18, 255, 58, 0.2)",
    blue: "rgba(35, 134, 255, 0.2)",
    indigo: "rgba(42, 35, 255, 0.2)",
    violet: "rgba(255, 35, 171, 0.2)",
  };
  document.querySelector("#noteForm").style.backgroundColor =
    backgroundColors[selectedColor];
}

function publishNote() {
  // check if the inputs are not empty if empty then alert and let the dialogue box open
  //  close the dialogue box
  // get title info
  let title = document.querySelector("#noteForm").querySelector("#title").value;
  // get note data
  let noteData = document
    .querySelector("#noteForm")
    .querySelector("#noteData").value;
  //error checking
  if (Boolean(title) === false) {
    createAlert("Title is empty!", "error");
    return;
  } else if (Boolean(noteData) === false) {
    createAlert("Description is empty!", "error");
    return;
  } else if (selectedColor === undefined) {
    createAlert("Please select a color for your note!", "error");
    return;
  }
  let newNote = document.createElement("div");
  newNote.setAttribute("class", `note ${selectedColor}`);
  newNote.appendChild(document.createElement("div"));
  let data = newNote.querySelector("div");
  data.setAttribute("class", "data");
  let notedata = ` <p class="heading">${title}</p>
  <p class="description">
    ${noteData}
  </p>`;
  data.innerHTML = notedata;
  document
    .querySelector("#notes")
    .insertBefore(newNote, document.querySelector(".add"));

  console.log(selectedColor);

  createAlert("Note successfully added", "success");
  // reset the form after the note has been published;
  document.querySelector("form").reset();
  // set the selectedColor to undefined again
  selectedColor = undefined;
  // bring form to orginal color which was changed by selectedColor
  document.querySelector("#noteForm").style.backgroundColor =
    "rgba(0, 0, 0, 0.2)";
  //close the form
  closeClicked("noteForm");
}

let isDeleteNoteActive = 0;
function deleteNote(event) {
  // first show the message in an alert box
}
