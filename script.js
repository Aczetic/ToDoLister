// TODO:when the add card is clicked following things need to be done:
//     title and description elements to be created and inserted inside another created data element
//     the background color is to be set to the background color of its parent
// TODO: elipsses should be shown in the card if the text goes out of the container
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

let isNoteCreateDialogueBoxOpen = true;
function closeClicked(id) {
  let elem = document.getElementById(id);
  elem.style.transform = "scale(0)";
}

function createNote() {
  document.getElementById("formToCreateNote").style.transform = "scale(1)";
}

function setValues() {}
