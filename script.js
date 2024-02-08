// TODO:when the add card is clicked following things need to be done:
//     title and description elements to be created and inserted inside another created data element
//     the background color is to be set to the background color of its parent
// TODO: elipsses should be shown in the card if the text goes out of the container in both title and description
// TODO: the current alert creation is wrong because it uses the same element for displaying errors instead of differnt ones being created and appended
// TODO : use a different form to show selected notes and different form to add notes or use a draft variable in session storage
// TODO : now the notes should be created by tallying data from draft when publishing and note reading from html
// as that will be more sequential and easy to follow through
// TODO: the color should be saved in draft even if it is not selected then also an empty value should be there or undefined

let notesObject = {
    // this is a global variable which whill store all the current notes
    notes: {
      title: [],
      description: [],
      color: [],
      dateTime: [],
    },
  },
  selectedNote = undefined, // to store the selected note either for editing or deleting.
  selectedColor = undefined, // to store the current selected color
  backgroundColors = {
    red: "rgba(255,0,0,0.5)",
    orange: "rgba(252, 156, 13, 0.2)",
    yellow: "rgba(236, 253, 9, 0.2)",
    green: "rgba(18, 255, 58, 0.2)",
    blue: "rgba(35, 134, 255, 0.2)",
    indigo: "rgba(42, 35, 255, 0.2)",
    violet: "rgba(255, 35, 171, 0.2)",
  };

// when the body loads if there already some pre-created notes then create them first
document.addEventListener("DOMContentLoaded", () => {
  if (window.sessionStorage.getItem("notesObject") != null) {
    notesObject = JSON.parse(window.sessionStorage.getItem("notesObject"));
    for (let i = 0; i < notesObject.notes.title.length; i++) {
      addNoteToHTML(
        notesObject.notes.title[i],
        notesObject.notes.description[i],
        notesObject.notes.color[i],
        notesObject.notes.dateTime[i]
      );
    }
  }
});

let isNoteCreateDialogueBoxOpen = false;

function closeClicked(id) {
  let elem = document.getElementById(id);
  elem.style.transform = "scale(0)";
  // some default actions
  if (selectedNote != undefined) {
    console.log("hereinsdie");
    document.querySelector("form").reset(); // reset the form if the selectNote option was the last action;
    selectedNote = undefined;
  } else {
    let title = elem.querySelector("#title").value;
    let description = elem.querySelector("#noteData").value;
    if (Boolean(title) || Boolean(description)) {
      let backgroundColor = elem.style.backgroundColor;
      let draft = {
        title: title,
        description: description,
        backgroundColor: Object.keys(backgroundColors).find(
          (color) => backgroundColors[color] === backgroundColor
        ),
      };
      window.sessionStorage.setItem("draft", JSON.stringify(draft));
    }
  }
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
  noteFormElem.querySelector("h2").style.display = "initial";
  noteFormElem.querySelector("h2").innerText = "Create A New Note"; // these 3 need to be done because these styles were removed when note is selected
  noteFormElem.querySelector("#publish").style.display = "flex";
  noteFormElem.querySelector("input").removeAttribute("disabled");
  noteFormElem.querySelector("textArea").removeAttribute("disabled");

  // if there is any data in draft then set it in form already to show the earlier work instead of destroying it
  let draft = JSON.parse(window.sessionStorage.getItem("draft"));
  if (draft != null) {
    // if the draft exists then get any available data from it
    console.log("enetered");
    noteFormElem.querySelector("#title").value = Boolean(draft.title)
      ? draft.title
      : null;
    noteFormElem.querySelector("#noteData").value = Boolean(draft.description)
      ? draft.description
      : null;
    noteFormElem.style.backgroundColor = Boolean(draft.backgroundColor)
      ? backgroundColors[draft.backgroundColor]
      : "rgba(0, 0, 0, 0.2)";
    console.log("overhear");
    selectedColor = Boolean(draft.backgroundColor)
      ? draft.backgroundColor // here the name of the class is required that is they key and not its value
      : undefined;
  } else {
    // use some default values otherwise
    noteFormElem.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    selectedColor = undefined;
    document.querySelector("form").reset();
  }
}

function setColor(elem) {
  selectedColor = elem.getAttribute("class");
  if (selectedColor.indexOf("tiles") !== -1) {
    selectedColor = selectedColor.substr(
      selectedColor.indexOf("tiles") + "tiles".length + 1
    );
  } else {
    selectedColor = elem.getAttribute("class").substring(5);
  }
  document.querySelector("#noteForm").style.backgroundColor =
    backgroundColors[selectedColor];
}

function addNoteToHTML(title, description, color, dateTime) {
  //this function creates the note cards and appends them in html document
  console.log(color);
  let newNote = document.createElement("div");
  newNote.setAttribute("class", `note ${color}`);
  newNote.addEventListener("click", selectNote);
  newNote.appendChild(document.createElement("div"));
  let data = newNote.querySelector("div");
  data.setAttribute("class", "data");
  let notedata = ` <p class="heading">${title}</p>
  <p class="description">
    ${description}
  </p><p class="noteDate">${dateTime}</p>`;
  data.innerHTML = notedata;
  document
    .querySelector("#notes")
    .insertBefore(newNote, document.querySelector(".add"));
}

function publishNote() {
  // check if the inputs are not empty if empty then alert and let the dialogue box open
  //getTime of creation
  let dateTime = String(new Date()).substring(4, 23);
  // get title info
  let title = document.querySelector("#noteForm").querySelector("#title").value;
  // get note data
  let description = document
    .querySelector("#noteForm")
    .querySelector("#noteData").value;
  //error checking
  if (Boolean(title) === false) {
    createAlert("Title is empty!", "error");
    return;
  } else if (Boolean(description) === false) {
    createAlert("Description is empty!", "error");
    return;
  } else if (selectedColor === undefined) {
    createAlert("Please select a color for your note!", "error");
    return;
  }

  //create the html for the note card

  addNoteToHTML(title, description, selectedColor, dateTime);

  // set the values in the session storage for now
  notesObject.notes.title.push(title);
  notesObject.notes.description.push(description);
  notesObject.notes.color.push(selectedColor);
  notesObject.notes.dateTime.push(dateTime);
  window.sessionStorage.setItem("notesObject", JSON.stringify(notesObject));
  // also clear the draft which was only to help publish the note
  window.sessionStorage.removeItem("draft");

  createAlert("Note successfully added", "success");
  // reset the form after the note has been published;
  formReset();
  //close the form
  closeClicked("noteForm");
}

function deleteNote(event) {
  // first show the message in an alert box
}

function selectNote(event) {
  // let index = Array.from(document.querySelector("#notes").children).indexOf(
  //   document.querySelector(`.`)

  selectedNote = event.target;
  while (selectedNote.className != "data") {
    selectedNote = selectedNote.parentNode;
  }
  let index = notesObject.notes.dateTime.indexOf(
    selectedNote.querySelector(".noteDate").innerText
  );
  // bring the dialogue box up
  let noteFormElem = document.querySelector("#noteForm");
  noteFormElem.style.transform = "scale(1)";
  // set the heading to invisible
  noteFormElem.querySelector("h2").style.display = "none";
  noteFormElem.querySelector("input").value = notesObject.notes.title[index];
  noteFormElem.querySelector("input").setAttribute("disabled", "disabled");
  noteFormElem.querySelector("textArea").value =
    notesObject.notes.description[index];
  noteFormElem.querySelector("textArea").setAttribute("disabled", "disabled");
  noteFormElem.querySelector("#publish").style.display = "none";
  setColor(selectedNote.parentNode);
}

function formReset() {
  let formElem = document.querySelector("#noteForm");
  formElem.querySelector("form").reset();
  formElem.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
  selectedColor = undefined;
  window.sessionStorage.removeItem("draft");
}
