import { createDefaultPolls, loadPolls } from "./poll.js";
import { createDefaultUsers } from "./registration.js";
import { checkIfLoggedIn } from "./utils.js";

//////////////
// Settings
export const idMinLength = 4;
export const pwMinLength = 5;

//////////////
// DOM
document.addEventListener("DOMContentLoaded", (event) => {
  console.log("DOM fully loaded and parsed");
  createDefaultUsers();
  if (localStorage.getItem('polls') === null) {
    createDefaultPolls();
  } else {
    loadPolls();
  }
  checkIfLoggedIn();
});
  