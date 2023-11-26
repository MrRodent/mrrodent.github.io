import { hideRegistrationForm } from "./registration.js";
import { findID, getUsers, isUserAdmin, showToast } from "./utils.js";

//////////////
// DOM elements
let pollContainer = document.getElementById('poll-container');
let form = document.getElementById('loginForm');
let errorMsgID = document.getElementById('loginErrorMsgID');
let errorMsgPw = document.getElementById('loginErrorMsgPw');
const idField = document.getElementById('loginInputID');
const pwField = document.getElementById('loginInputPw');

//////////////
// Logging in
function checkID(id, password) {
  const idLower = id.toLowerCase();
  if (!findID(idLower)) {
    idField.classList.add('is-invalid');
    errorMsgID.innerHTML = 'Käyttäjätunnusta ei löydy';
    return false;
  } else {
    idField.classList.remove('is-invalid');
  }

  let users = getUsers();
  for (const user of users) {
    if (idLower === user.id) {
        if (password === user.pw) {
          pwField.classList.remove('is-invalid');
          return true;
        } else {
          pwField.classList.add('is-invalid');
          errorMsgPw.innerHTML = 'Väärä salasana'
        }
    }
  }
  return false;
}

export function hideLoginForm() {
  form.classList.replace('visible', 'invisible');
  pollContainer.classList.remove('blur');
}

function showLoginForm() {
  hideRegistrationForm();
  form.classList.replace('invisible', 'visible');
  pollContainer.classList.add('blur');
}

function updateNavbarOnLogin(id) {
  let nameDisplay = document.getElementById('nav-left-id');
  nameDisplay.textContent = id;

  const loginLinks = document.querySelectorAll('.login-link');
  loginLinks.forEach(link => {
    link.removeEventListener('click', showLoginForm);
    link.addEventListener('click', logOut);
    if (link.id !== 'login-link-form') {
      link.textContent = 'Kirjaudu ulos';
    }
  });

  const regLinks = document.querySelectorAll('.register-link');
  regLinks.forEach(link => {
    link.classList.add('disabled');
  });

  if (isUserAdmin(id)) {
    const createBtns = document.querySelectorAll('.open-poll-creation');
    createBtns.forEach(button => {
      button.classList.remove('invisible');
    });

    const deleteBtns = document.querySelectorAll('.delete-button');
    deleteBtns.forEach(button => {
      button.classList.remove('d-none');
    });
  }
}

export function showVotingOptions() {
  const voteButtons = document.querySelectorAll('.vote-button');
  voteButtons.forEach(button => {
    button.classList.remove('invisible');
  })

  const resultButtons = document.querySelectorAll('.result-button');
  resultButtons.forEach(button => {
    button.classList.remove('invisible');
  })

  const loginReminders = document.querySelectorAll('.login-reminder');
  loginReminders.forEach(text => {
    text.classList.add('invisible');
  });
}

function emptyLoginFields() {
  errorMsgID.innerHTML = '';
  errorMsgPw.innerHTML = '';
  idField.value = '';
  pwField.value = '';
}

export let currentlyLoggedUser;
export function login(id) {
  currentlyLoggedUser = id;
  updateNavbarOnLogin(id);
  showVotingOptions();
  setLoginStatus(id, true);
}

function setLoginStatus(id, value = false) {
  // Save user's status to local storage
  let users = getUsers();
  users.forEach(user => {
    if (id === user.id) {
      user.isLoggedIn = value;
      let json = JSON.stringify(users);
      localStorage.setItem('users', json);
      return;
    }
  });
}

// Sending
function send() {  
  if (checkID(idField.value, pwField.value)) {
    showToast(`Tervetuloa ${idField.value}`, 'Olet nyt kirjautunut sisään.');
    login(idField.value);
    hideLoginForm();
    emptyLoginFields();
  }
}

//////////////
// Logging out
function hideVotingOptions() {
  const voteButtons = document.querySelectorAll('.vote-button');
  voteButtons.forEach(button => {
    button.classList.add('invisible');
  })

  const resultButtons = document.querySelectorAll('.result-button');
  resultButtons.forEach(button => {
    button.classList.add('invisible');
  })

  const loginReminders = document.querySelectorAll('.login-reminder');
  loginReminders.forEach(text => {
    text.classList.remove('invisible');
  });
}

function logOut() {
  const deleteBtns = document.querySelectorAll('.delete-button');
  deleteBtns.forEach(button => {
    button.classList.add('d-none');
  });

  updateNavbarOnLogout();
  hideVotingOptions();
  setLoginStatus(currentlyLoggedUser, false);
  currentlyLoggedUser = null;
  showToast('Hei hei!', 'Olet nyt kirjautunut ulos');
}

function updateNavbarOnLogout() {
  let nameDisplay = document.getElementById('nav-left-id');
  nameDisplay.textContent = '';

  const loginLinks = document.querySelectorAll('.login-link');
  loginLinks.forEach(link => {
    link.removeEventListener('click', logOut);
    link.addEventListener('click', showLoginForm);
    if (link.id !== 'login-link-form') {
      link.textContent = 'Kirjaudu sisään';
    }
  });

  const regLinks = document.querySelectorAll('.register-link');
  regLinks.forEach(link => {
    link.classList.remove('disabled');
  });

  const createBtns = document.querySelectorAll('.open-poll-creation');
  createBtns.forEach(button => {
    button.classList.add('invisible');
  });
}

//////////////
// Links and buttons
const loginLinks = document.querySelectorAll('.login-link');
loginLinks.forEach(link => {
  link.addEventListener('click', showLoginForm);
  if (link.id !== 'login-link-form') {
    link.textContent = 'Kirjaudu sisään';
  }
});

const loginCloseBtn = document.getElementById('loginCloseBtn');
loginCloseBtn.addEventListener('click', hideLoginForm);

const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', send);