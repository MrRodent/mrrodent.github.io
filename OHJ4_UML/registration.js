import { hideLoginForm } from "./login.js";
import { idMinLength, pwMinLength } from "./main.js";
import { findID, showToast } from "./utils.js";

//////////////
// DOM elements
let pollContainer = document.getElementById('poll-container');
let form = document.getElementById('registrationForm');
let errorMsgID = document.getElementById('regErrorMsgID');
let errorMsgPw = document.getElementById('regErrorMsgPw');

const idField = document.getElementById('regInputID');
const pwField = document.getElementById('regInputPw');

//////////////
// Validating
function validateID(userID) {
  if (userID.length < idMinLength) {
    idField.classList.add('is-invalid');
    errorMsgID.innerHTML = `Minimipituus ${idMinLength} merkkiä.`;
    return false;
  }
  if (findID(userID)) {
    idField.classList.add('is-invalid');
    errorMsgID.innerHTML = `Käyttäjätunnus on jo rekisteröity.`;
    return false;
  }
  errorMsgID.innerHTML = '';
  idField.classList.remove('is-invalid');
  return true;
}

function validatePassword(password) {
  if (password.length < pwMinLength) {
    pwField.classList.add('is-invalid');
    errorMsgPw.innerHTML = `Minimipituus ${pwMinLength} merkkiä.`;
    return false;
  }
  pwField.classList.remove('is-invalid');
  errorMsgPw.innerHTML = '';
  return true;
}

//////////////
// Saving
function saveToLocalStorage(idField, pwField, adminCheck) {
  if (localStorage.getItem("users") === null) {
    createDefaultUsers();
  }
  const users = localStorage.getItem("users");
  const parsed = JSON.parse(users);
  const newUser = {id: idField, pw: pwField, admin: adminCheck, isLoggedIn: false};
  parsed.push(newUser);
  console.log(parsed);
  console.log(users);
  const json = JSON.stringify(parsed);
  localStorage.setItem("users", json);
}

// Sending
function send() {
  const adminCheck = document.getElementById('checkAdmin').checked;
  
  if (validateID(idField.value)
    & validatePassword(pwField.value)) {
      saveToLocalStorage(idField.value, pwField.value, adminCheck);
      const loginField = document.getElementById('loginInputID');
      loginField.value = idField.value;
      emptyRegFields();
      showToast('Tunnuksen luonti onnistui', 'Voit nyt kirjautua sisään.');
      hideRegistrationForm();      
      return true;
    };
    return false;
}

export function hideRegistrationForm() {
  form.classList.replace('visible', 'invisible');
  pollContainer.classList.remove('blur');
}

function showRegistrationForm() {
  hideLoginForm();
  form.classList.replace('invisible', 'visible');
  pollContainer.classList.add('blur');
}

export function createDefaultUsers() {
  if (localStorage.getItem("users") !== null) return;
  console.info("No users found. Creating default users.");

  const users = [{id: "admin", pw: "admin", admin: true, isLoggedIn: false}
              , {id: "user", pw: "user", admin: false, isLoggedIn: false}];
  const json = JSON.stringify(users);
  localStorage.setItem("users", json);
}

function emptyRegFields() {
  let id = document.getElementById('regInputID');
  let pw = document.getElementById('regInputPw');
  let adminCheck = document.getElementById('checkAdmin');

  id.value = '';
  pw.value = '';
  adminCheck.checked = false;
}

//////////////
// Links and buttons
const regLinks = document.querySelectorAll('.register-link');
regLinks.forEach(link => {
  link.addEventListener('click', showRegistrationForm);
});

const regCloseBtn = document.getElementById('regCloseBtn');
regCloseBtn.addEventListener('click', hideRegistrationForm);

const regBtn = document.getElementById('registrationBtn');
regBtn.addEventListener('click', send);