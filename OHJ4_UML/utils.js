import { login } from "./login.js";

export function getUsers() {
  const users = localStorage.getItem("users");
  const parsed = JSON.parse(users);
  return parsed;
}

export function getPolls() {
  const polls = localStorage.getItem("polls");
  const parsed = JSON.parse(polls);
  return parsed;
}

// Checks whether the ID exists in localStorage
export function findID(idToFind) {
  const users = getUsers();
  for (const user of users) {
    if (idToFind === user.id) {
      return true;
    }
  }
  return false;
}

export function isUserAdmin(id) {
  const users = getUsers();
  for (const user of users) {
    if (id === user.id) {
      if (user.admin) {
        return true;
      }
      return false;
    }
  }
}

// Called in main when entering the page.
export function checkIfLoggedIn() {
  const users = getUsers();
  for (const user of users) {
    if (user.isLoggedIn) {
      login(user.id);
    }
  }
}

const toast = document.getElementById('liveToast');
export function showToast(header, msg) {
  let toastHeader = document.getElementById('toastHeader');
  toastHeader.textContent = header;
  let toastMsg = document.getElementById('toastMsg');
  toastMsg.textContent = msg;

  const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toast);
  toastBootstrap.show();
}