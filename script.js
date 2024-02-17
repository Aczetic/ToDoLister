// TODO: elipsses should be shown in the card if the text goes out of the container in both title and description
// TODO: the current alert creation is wrong because it uses the same element for displaying errors instead of differnt ones being created and appended
// TODO : now the notes should be created by tallying data from draft when publishing and note reading from html
// as that will be more sequential and easy to follow through
// TODO: the color should be saved in draft even if it is not selected then also an empty value should be there or undefined
// TOOD: currently when the note is clicked it's date value is taken and then index is found which is not a secure way it should find the index of the element
// PROBLEM : edited can't be shown in noteDate element as it obstructs the functioning of selectnote
let notesObject = {
    // this is a global variable which whill store all the current notes
    notes: {
      title: [],
      description: [],
      color: [],
      dateTime: [],
      markUp: [],
    },
  },
  selectedNote = undefined, // to store the selected note either for editing or deleting.
  selectedNoteIndex = -1; // to store the index of the selected note
(selectedColor = undefined), // to store the current selected color
  (alertBoxAnswer = undefined),
  (isFormEnabled = false),
  (backgroundColors = {
    red: "rgba(255, 0, 0, 0.5)",
    orange: "rgba(252, 156, 13, 0.2)",
    yellow: "rgba(236, 253, 9, 0.2)",
    green: "rgba(18, 255, 58, 0.2)",
    blue: "rgba(35, 134, 255, 0.2)",
    indigo: "rgba(42, 35, 255, 0.2)",
    violet: "rgba(255, 35, 171, 0.2)",
  });

// when the body loads if there already some pre-created notes then create them first
document.addEventListener("DOMContentLoaded", () => {
  if (window.sessionStorage.getItem("notesObject") != null) {
    notesObject = JSON.parse(window.sessionStorage.getItem("notesObject"));
    for (let i = 0; i < notesObject.notes.title.length; i++) {
      addNoteToHTML(
        notesObject.notes.title[i],
        notesObject.notes.description[i],
        notesObject.notes.color[i],
        notesObject.notes.dateTime[i],
        notesObject.notes.markUp[i]
      );
    }
  }
});

let isNoteCreateDialogueBoxOpen = false;

function closeClicked(id) {
  let elem = document.getElementById(id); // get the form

  // some actions that needed to be done
  if (selectedNote != undefined) {
    if (isFormEnabled === true) {
      // if the form was enabled and a note was selected that means it was being edited
      createAlert(
        "Do you want to save the changes?",
        "confirmation",
        updateNote
      );
      return; // to prevent the note from closing.
    }
    document.querySelector("form").reset(); // reset the form if the selectNote option was the last action;
    selectedNote = undefined;
    selectedNoteIndex = -1;
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
  // set the isFormEnabled flag to false
  isFormEnabled = false;
  elem.style.transform = "scale(0)";
}
setAlertBoxToOriginalPosition = undefined; // this variable holdes the reference to the setTimeout function
// USE : the setTimeout invokes after 2 seconds but when another alert is created the previous one should be cleared
function createAlert(message, messageType, callback = undefined) {
  // clear the previous call of setTimeout

  if (Boolean(setAlertBoxToOriginalPosition))
    clearTimeout(setAlertBoxToOriginalPosition);

  let alertElem = document.querySelector("#alertBox"); // select the alert box alertElement
  let colors = {
    error: "rgba(255,60,60,0.5)", // red
    warning: "rgba(255, 255, 0,0.5)", //yellow
    message: "rgba(60,60,200,0.5)", //blue
    success: "rgba(60,200,60,0.5)", //green
    confirmation: "rgba(80,80,80,0.5)", //whitish
  };
  // bring the alert box down
  alertElem.style.border = "3px solid " + colors[messageType]; // set the border color
  alertElem.style.backgroundColor = colors[messageType]; // set the text color
  alertElem.style.top = "50px"; // bring the message box down

  if (messageType !== "confirmation") {
    alertElem.innerText = message; // set the message

    setAlertBoxToOriginalPosition = setTimeout(
      () => {
        // call an async function to put back the alert box to its original position
        alertElem.style.top = "-100px";
        setAlertBoxToOriginalPosition = undefined;
      },
      2000 // change the timing of alertbox based what type of alert message it is
    );
  } else {
    // if the alert type needs a confirmation then
    document.querySelector("#controlBlocker").style.display = "block"; // bring the viewblocker up
    let markup = `<div id='alertMessage'>${message}</div><div id='alertBoxOptions'><div class='material-symbols-outlined'>done</div><div class='material-symbols-outlined'>close</div>`;
    alertElem.innerHTML = markup;
    alertBoxAnswer = undefined;
    alertElem
      .querySelector("#alertBoxOptions")
      .querySelectorAll("div")[0]
      .addEventListener("click", () => {
        (alertBoxAnswer = true), callback();
        document.querySelector("#controlBlocker").style.display = "none";
        // put the alert box back to its original position
        alertElem.style.top = "-100px";
        setAlertBoxToOriginalPosition = undefined;
      });
    alertElem
      .querySelector("#alertBoxOptions")
      .querySelectorAll("div")[1]
      .addEventListener("click", () => {
        alertBoxAnswer = false;
        callback();
        document.querySelector("#controlBlocker").style.display = "none";
        // put the alert box back to its original position
        alertElem.style.top = "-100px";
        setAlertBoxToOriginalPosition = undefined;
      });
  }
}

function createNote() {
  // some default actions so unselected any selected note
  selectedNote = undefined;
  selectedNoteIndex = -1;
  // bring the form box up and set the form enabled flag to true
  let noteFormElem = document.querySelector("#noteForm");
  noteFormElem.style.transform = "scale(1)";
  isFormEnabled = true;

  // set the heading text
  noteFormElem.querySelector("h2").style.display = "initial";
  noteFormElem.querySelector("h2").innerText = "Create A New Note"; // these 3 need to be done because these styles were removed when note is selected
  noteFormElem.querySelector("#publish").style.display = "flex";
  noteFormElem.querySelector("#update").style.display = "none";
  noteFormElem.querySelector("input").removeAttribute("disabled");
  noteFormElem.querySelector("textArea").removeAttribute("disabled");

  // if there is already any data in the draft then set it in form to show the earlier work instead of destroying it
  let draft = JSON.parse(window.sessionStorage.getItem("draft"));
  if (draft != null) {
    // if the draft exists then get any available data from it

    noteFormElem.querySelector("#title").value = Boolean(draft.title)
      ? draft.title
      : null;
    noteFormElem.querySelector("#noteData").value = Boolean(draft.description)
      ? draft.description
      : null;
    noteFormElem.style.backgroundColor = Boolean(draft.backgroundColor)
      ? backgroundColors[draft.backgroundColor]
      : "rgba(0, 0, 0, 0.2)";

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
  // set the color of the form only when a note has not been selected and  when #noteForm's transform === 'scale(1)'
  selectedColor = elem.getAttribute("class");
  if (isFormEnabled === true) {
    selectedColor = selectedColor.substr(
      selectedColor.indexOf("tiles") + "tiles".length + 1
    );
  } else {
    //selectedColor = elem.getAttribute("class").substring(5);
    createAlert("Invalid action", "error");
    console.log("enterd in else block of set color");
  }
  document.querySelector("#noteForm").style.backgroundColor =
    backgroundColors[selectedColor];

  // otherwise create alert stating invalid action
  //  createAlert("Invalid action", "error");
}

function addNoteToHTML(title, description, color, dateTime, markUp) {
  //this function appends the notes in html document

  let newNote = document.createElement("div");
  newNote.setAttribute("class", `note ${color}`); // set the color of card
  newNote.addEventListener("click", selectNote);
  newNote.appendChild(document.createElement("div"));
  let data = newNote.querySelector("div");
  data.setAttribute("class", "data");
  data.innerHTML = markUp;
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
  let augmentedDescription =
    description.length > 192
      ? description.substring(0, 192) + ".....<b>see more</b>"
      : description; // if the description overflows the card then show ellipses
  let markUp = ` <p class="heading">${title}</p>
  <p class="description">
    ${augmentedDescription}
  </p><p class="noteDate">${dateTime}</p>`;
  // add it in dom
  addNoteToHTML(title, description, selectedColor, dateTime, markUp);

  // set the values in the session storage for now
  notesObject.notes.title.push(title);
  notesObject.notes.description.push(description);
  notesObject.notes.color.push(selectedColor);
  notesObject.notes.dateTime.push(dateTime);
  notesObject.notes.markUp.push(markUp);
  window.sessionStorage.setItem("notesObject", JSON.stringify(notesObject));

  createAlert("Note successfully added", "success");
  //close the form
  closeClicked("noteForm");
  // also clear the draft which was only to help publish the note
  window.sessionStorage.removeItem("draft");
  // reset the form after the note has been published;
  formReset();
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
  selectedNoteIndex = index; // set the value to the global variable as well
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
  noteFormElem.querySelector("#update").style.display = "none";
  noteFormElem.style.backgroundColor =
    backgroundColors[notesObject.notes.color[selectedNoteIndex]];
}

function deleteNote() {
  if (selectedNote == undefined) {
    createAlert("Please select a note to delete", "error");
    return;
  }
  let confirmedToDelete = alertBoxAnswer;
  if (confirmedToDelete == undefined) {
    createAlert(
      "Are you sure you want to delete this note?",
      "confirmation",
      deleteNote
    );
  } else if (confirmedToDelete) {
    console.log("deleted");
    let elem = document
      .querySelector("#notesBody")
      .querySelector("#notes")
      .querySelectorAll(".note")[selectedNoteIndex + 1];

    document.getElementById("notes").removeChild(elem);
    setTimeout(() => createAlert("Note deleted", "success"), 400);
    // clearing the session storage
    notesObject.notes.title.splice(selectedNoteIndex, 1);
    notesObject.notes.description.splice(selectedNoteIndex, 1);
    notesObject.notes.dateTime.splice(selectedNoteIndex, 1);
    notesObject.notes.color.splice(selectedNoteIndex, 1);
    window.sessionStorage.setItem("notesObject", JSON.stringify(notesObject));
    byPassClosingForUpdateFunction(); // close the form after that
    alertBoxAnswer = undefined; // reset the value when true
  } else {
    console.log("deletion rejected");
    setTimeout(() => createAlert("Note deletion rejected", "message"), 400);
    alertBoxAnswer = undefined; // reset the value when false;
  }
}

function formReset() {
  if (selectedNote == undefined) {
    // reset the form only when there is no note selected
    let formElem = document.querySelector("#noteForm");
    formElem.querySelector("form").reset();
    formElem.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    selectedColor = undefined;
  } else {
    createAlert("Invalid action", "error");
  }
}
// 265 is the maximum number of characters that should be visible in a note card.

function editNote() {
  // set the isFormEnabled flag to true
  isFormEnabled = true;
  let noteFormElem = document.querySelector("#noteForm");
  if (selectedNote == undefined) {
    // if no note is selected then show alert
    createAlert("Please selecte a note to  edit", "error");
  } else {
    noteFormElem.querySelector("h2").style.display = "initial";
    noteFormElem.querySelector("h2").innerText = "Edit Note"; // these 3 need to be done because these styles were removed when note is selected
    noteFormElem.querySelector("#update").style.display = "flex";
    noteFormElem.querySelector("#publish").style.display = "none";
    noteFormElem.querySelector("input").removeAttribute("disabled");
    noteFormElem.querySelector("textArea").removeAttribute("disabled");
  }
}

function byPassClosingForUpdateFunction() {
  document.querySelector("form").reset(); // reset the form if the selectNote option was the last action;
  selectedNote = undefined;
  selectedNoteIndex = -1;
  // set the isFormEnabled flag to false
  isFormEnabled = false;
  document.querySelector("#noteForm").style.transform = "scale(0)";
}

function updateNote() {
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
  }
  let confirmToUpdate = alertBoxAnswer;
  if (confirmToUpdate == undefined) {
    createAlert("Do you want to save the changes?", "confirmation", updateNote);
    confirmToUpdate = alertBoxAnswer;
  } else {
    if (confirmToUpdate) {
      let augmentedDescription =
        description.length > 192
          ? description.substring(0, 192) + ".....<b>see more</b>"
          : description; // if the description overflows the card then show ellipses
      let markUp = ` <p class="heading">${title}</p>
    <p class="description">
      ${augmentedDescription}
    </p><p class = 'editedTextLabel'><b>Edited</b></p><p class="noteDate">${dateTime}</p>`;

      document
        .querySelectorAll(".note")
        [selectedNoteIndex + 1].querySelector(".data").innerHTML = markUp;

      // set the values in the session storage for now
      notesObject.notes.title[selectedNoteIndex] = title;
      notesObject.notes.description[selectedNoteIndex] = description;
      notesObject.notes.color[selectedNoteIndex] = Boolean(selectedColor)
        ? selectedColor
        : notesObject.notes.color[selectedNoteIndex];
      notesObject.notes.dateTime[selectedNoteIndex] = dateTime;
      notesObject.notes.markUp[selectedNoteIndex] = markUp;
      window.sessionStorage.setItem("notesObject", JSON.stringify(notesObject));
      document
        .querySelectorAll(".note")
        [selectedNoteIndex + 1].setAttribute(
          "class",
          `note ${notesObject.notes.color[selectedNoteIndex]}`
        );
      //close the form
      //closeClicked("noteForm"); not using this and doing below upto line 426 because the close clicked will call the save changes too on note close during edit mode
      byPassClosingForUpdateFunction();

      // reset the form after the note has been published;
      formReset();
      // window.sessionStorage.removeItem("updateDraft"); // also this statement has been put here because when the close button on the form is clicked then it creates the draft
      // so this statement removes it nevertheless.
      alertBoxAnswer = undefined; // reset the value if true;
      console.log("Your note has been updated");
      setTimeout(
        () => createAlert("Note successfully updated", "success"),
        400
      );
    } else {
      setTimeout(() => createAlert("Changes not saved", "warning"), 400);
      //close the form
      byPassClosingForUpdateFunction();

      // reset the form after the note has been published;
      formReset();
      alertBoxAnswer = undefined; // reset the value if false;
    }
  }
}
