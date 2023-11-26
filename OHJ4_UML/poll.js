import { showVotingOptions } from "./login.js";
import { getPolls } from "./utils.js";

export class pollCard {
  constructor (id, subject, description, choices, testVotes) {
    this.id = id;
    this.subject = subject;
    this.description = description;
    this.choices = choices;
    this.testVotes = testVotes;
    this.justVoted = false;
    this.pollName = `poll${id}`;
    this.totalVotes = 0;
    this.form;

    // Create a vote counter for each choice
    this.voteCounts = {};
    choices.forEach((choice, index) => {
      if (testVotes) {
        const random = Math.floor(Math.random() * 100) + 10;
        this.totalVotes += random;
        this.voteCounts[index] = random;
      } else {
        this.voteCounts[index] = 0;
      }
    });

    this.create();
  }

  create() {
    const pollContainer = document.getElementById('poll-container');
    
    // Card container
    const newCard = document.createElement('div');
    newCard.id = `poll-card${this.id}`;
    newCard.classList.add('col', 'mb-4');
    const div1 = document.createElement('div');
    div1.classList.add('card');
    newCard.appendChild(div1);

    // Delete button
    const deleteBtnDiv = document.createElement('div');
    deleteBtnDiv.classList.add('float-end', 'm-1', 'position-absolute', 'delete-button', 'd-none');
    const deleteBtn = document.createElement('button');
    deleteBtn.id = `delete-button${this.id}`;
    deleteBtn.type = 'button';
    deleteBtn.classList.add('btn-close');
    deleteBtn.setAttribute('aria-label', 'Delete');
    deleteBtnDiv.appendChild(deleteBtn);
    div1.appendChild(deleteBtnDiv);
    
    const div2 = document.createElement('div');
    div2.classList.add('card-body', 'text-center');
    div1.appendChild(div2);

    // Subject and description
    const header = document.createElement('h5');
    header.classList.add('fw-bold', 'mb-3');
    header.textContent = this.subject;
    div2.appendChild(header);
    const desc = document.createElement('p');
    desc.classList.add('mx-4');
    desc.textContent = this.description;
    div2.appendChild(desc);
    div2.appendChild(document.createElement('hr'));

    // Create the form
    this.form = document.createElement('form');
    this.form.classList.add('px-4');
    this.form.action = "";   // NOTE: This would be used to send the form to a server if there was one

    // Loop through the choices and create their form elements
    let choiceIndex = 0;
    this.choices.forEach(choice => {
      const newChoice = document.createElement('div');
      newChoice.classList.add('form-check', 'mb-2');

      // Radio button
      const radio = document.createElement('input');
      radio.classList.add('form-check-input', 'bg-body-tertiary', 'link-dark');
      radio.type = 'radio';
      radio.name = this.pollName;
      radio.id = `${radio.name}-choice${choiceIndex}`;
      radio.setAttribute('data-index', choiceIndex);

      // Progress bar
      const progressDiv = document.createElement('div');
      progressDiv.classList.add('progress');
      progressDiv.style.height = '2rem';
      const progressBar = document.createElement('div');
      progressBar.id = (`${radio.id}-progress`);
      progressBar.classList.add('progress-bar', 'bg-body-tertiary');
      progressBar.style.width = '100%';   // NOTE: Full bar to hide the progress
      // Set ARIA attributes
      progressDiv.setAttribute('role', 'progressbar');
      progressDiv.setAttribute('aria-valuemin', '0');
      progressDiv.setAttribute('aria-valuemax', '100');
      progressDiv.setAttribute('aria-valuenow', 'hidden');

      // Preselect first choice       // TODO: keep or scrap
      if (choiceIndex === 0) {
        radio.checked = true;
        progressBar.classList.replace('bg-body-tertiary', 'bg-secondary');
      } else {
        progressBar.classList.add('bg-body-tertiary');
      }

      // Change colour when selected
      this.form.addEventListener('click', () => {
        if (radio.checked === true) {
          progressBar.classList.replace('bg-body-tertiary', 'bg-secondary');
        } else {
          progressBar.classList.replace('bg-secondary', 'bg-body-tertiary');
        }
      }) 

      // Extend the click to whole progress bar
      progressBar.addEventListener('click', () => {
        radio.checked = true;
      })

      // Label
      const label = document.createElement('label');
      label.classList.add('form-check-label');
      label.style.position = 'absolute';
      label.style.marginLeft = '1rem';

      label.htmlFor =  radio.id;
      label.textContent = choice;
      
      progressBar.appendChild(label);
      progressDiv.appendChild(progressBar);
      newChoice.appendChild(radio);
      newChoice.appendChild(progressDiv);
      this.form.appendChild(newChoice);
      choiceIndex++;
    });
    div2.appendChild(this.form);

    // Footer
    const footer = document.createElement('div');
    footer.classList.add('card-footer', 'd-flex', 'justify-content-between');

    // Result button
    const resultBtn = document.createElement('button');
    resultBtn.classList.add('btn', 'btn-sm', 'result-button', 'invisible');
    resultBtn.type = 'button';
    resultBtn.id = `result-button-${this.id}`;
    resultBtn.textContent = 'Katso tulokset';
    footer.appendChild(resultBtn);

    // Login reminder (when not signed in)
    const logTxt = document.createElement('p');
    logTxt.classList.add('small', 'm-auto', 'fst-italic', 'login-reminder');
    logTxt.textContent = 'Kirjaudu sisään äänestääksesi';
    footer.appendChild(logTxt);

    // Vote button
    const voteBtn = document.createElement('button');
    voteBtn.classList.add('btn', 'btn-outline-light', 'vote-button', 'invisible');
    voteBtn.type = 'button';
    voteBtn.id = `vote-button-${this.id}`;
    voteBtn.textContent = 'Äänestä';
    footer.appendChild(voteBtn);

    div1.appendChild(footer);
    pollContainer.appendChild(newCard);

    // Delete button functionality
    deleteBtn.addEventListener('click', () => {
      this.deletePoll(newCard, deleteBtn);
    })

    // Result button functionality
    resultBtn.addEventListener('click', (event) => {
      event.preventDefault();
      this.skipVoting(div1, resultBtn, voteBtn);
    })

    // Vote button functionality
    voteBtn.addEventListener('click', (event) => {
      event.preventDefault();
      const selectedChoice = document.querySelector(`input[name=${this.pollName}]:checked`);
      this.vote(selectedChoice);
      this.justVoted = true;
      this.showResults(resultBtn, voteBtn);
    })
  }

    vote(choice) {
        const index = choice.getAttribute('data-index');
        this.totalVotes++;
        this.voteCounts[index]++;

        // Save vote counts
        let polls = getPolls();
        let result = polls.find(poll => poll.id === this.id);
        result.totalVotes++;
        result.voteCounts[index]++;
        let pollJson = JSON.stringify(polls);
        localStorage.setItem('polls', pollJson);
    }

    getPercentage(voteCount) {
      if (this.totalVotes === 0) {
          return 0;
      }
      const float = (voteCount / this.totalVotes) * 100;
      return float.toFixed(1);
    }

    deletePoll(card, deleteBtn) {
      deleteBtn.classList.add('disabled');
      const div1 = card.firstElementChild;

      // Create the HTML elements
      const div = document.createElement('div');
      div.classList.add('bg-danger-subtle', 'rounded-2');
      const confirmText = document.createElement('p');
      confirmText.classList.add('text-center', 'm-2', 'small', 'fst-italic');
      confirmText.textContent = 'Haluatko varmasti poistaa äänestyksen?';
      div.appendChild(confirmText);
      
      const buttonDiv = document.createElement('div');
      buttonDiv.classList.add('text-center', 'm-2');

      const confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.classList.add('btn', 'btn-sm', 'btn-outline-light', 'm-1');
      confirmBtn.textContent = 'Kyllä';

      const declineBtn = document.createElement('button');
      declineBtn.type = 'button';
      declineBtn.classList.add('btn', 'btn-sm', 'btn-outline-light', 'm-1');
      declineBtn.textContent = 'En, älä poista';

      buttonDiv.appendChild(confirmBtn);
      buttonDiv.appendChild(declineBtn);
      div.appendChild(buttonDiv);
      div1.appendChild(div);

      // Confirm button functionality
      confirmBtn.addEventListener('click', () => {
          card.remove();
          // Remove from local storage
          let polls = getPolls();
          polls = polls.filter(poll => poll.id !== this.id);
          let json = JSON.stringify(polls);
          localStorage.setItem('polls', json);
      });

      // Decline button functionality
      declineBtn.addEventListener('click', () => {
        div1.removeChild(div);
        deleteBtn.classList.remove('disabled');
      });
    }

    showResults(resultBtn, voteBtn) {
      resultBtn.classList.add('invisible');
      voteBtn.classList.add('disabled', 'fst-italic');
      voteBtn.textContent = `Ääniä: ${this.totalVotes}`;

      const choices = this.form.children;
      for (const choice of choices) {
        const input = choice.childNodes[0];
        const progressDiv = choice.childNodes[1];
        const progressBar = progressDiv.childNodes[0];
        const label = progressBar.childNodes[0];

        // Highlight user's choice
        if (input.checked && this.justVoted) {
            progressBar.classList.replace('bg-secondary', 'bg-success');
        } else {
            progressBar.classList.replace('bg-secondary', 'bg-body-tertiary');
        }

        const index = input.getAttribute('data-index');
        const voteCount = this.voteCounts[index];

        const percentage = this.getPercentage(voteCount);
        label.innerHTML += `<br><b>${percentage}%</b> &nbsp;<i>(${voteCount})</i>`;
        progressBar.style.width = `${percentage}%`;
        progressDiv.style.height = '3rem';
        progressDiv.setAttribute('aria-valuenow', percentage);

        // Hide radio button
        input.classList.add('invisible');
      }
    }

    skipVoting(parent, resultBtn, voteBtn) {
      resultBtn.classList.add('disabled', 'fst-italic');
      voteBtn.classList.add('disabled', 'fst-italic');

      // Create the HTML elements
      const div = document.createElement('div');
      div.classList.add('bg-danger-subtle', 'rounded-2');
      const confirmText = document.createElement('p');
      confirmText.classList.add('text-center', 'm-2', 'small', 'fst-italic');
      confirmText.textContent = 'Haluatko varmasti jättää äänestämättä?';
      div.appendChild(confirmText);
      
      const buttonDiv = document.createElement('div');
      buttonDiv.classList.add('text-center', 'm-2');

      const confirmBtn = document.createElement('button');
      confirmBtn.type = 'button';
      confirmBtn.classList.add('btn', 'btn-sm', 'btn-outline-light', 'm-1');
      confirmBtn.textContent = 'Kyllä';

      const declineBtn = document.createElement('button');
      declineBtn.type = 'button';
      declineBtn.classList.add('btn', 'btn-sm', 'btn-outline-light', 'm-1');
      declineBtn.textContent = 'En, haluan äänestää';

      buttonDiv.appendChild(confirmBtn);
      buttonDiv.appendChild(declineBtn);
      div.appendChild(buttonDiv);
      parent.appendChild(div);

      // Confirm button functionality
      confirmBtn.addEventListener('click', () => {
          this.showResults(resultBtn, voteBtn);
          parent.removeChild(div);
      });

      // Decline button functionality
      declineBtn.addEventListener('click', () => {
          resultBtn.classList.remove('disabled', 'fst-italic');
          voteBtn.classList.remove('disabled', 'fst-italic');
          parent.removeChild(div);
      });
    }
}

//////////////
// Poll creation tools
const createBtn = document.getElementById('create-poll-button');

function emptyNewPollFields() {
  let inputs = document.querySelectorAll('.new-poll-input');
  inputs.forEach(input => {
    input.value = '';
  });
}

function createNewPoll() {
  const id = (getPolls().length + 1);
  const subject = document.getElementById('new-poll-header').value;
  const description = document.getElementById('new-poll-description').value;

  let optionArray = [];
  const options = document.querySelectorAll('.new-poll-option');
  options.forEach(option => {
    if (option.value !== '') {
      optionArray.push(option.value);
    }
  });
  
  const testVotes = document.getElementById('test-votes').checked;
  const card = new pollCard(id, subject, description, optionArray, testVotes);

  showVotingOptions();
  emptyNewPollFields();
  savePoll(card);
}
createBtn.addEventListener('click', createNewPoll);

function savePoll(card) {
  let polls = getPolls();
  polls.push(card);
  let json = JSON.stringify(polls);
  localStorage.setItem('polls', json);
}

// Requires some input to the fields before enabling the creation button.
function checkPollInputs() {
  const requiredInputs = document.querySelectorAll('.required-poll-input');
  const pollOptions = document.querySelectorAll('.new-poll-option');
  const pollError = document.getElementById('new-poll-error');

  const checkInputFields = () => {
    let allFieldsValid = true;
    let optionsUnder30 = true;
    requiredInputs.forEach(input => {
      if (input.value.length < 1) {
        allFieldsValid = false;
      }

      pollOptions.forEach(input => {
        if (input.value.length > 30) {
          allFieldsValid = false;
          optionsUnder30 = false;
          input.classList.add('is-invalid');
          pollError.classList.remove('invisible');
        } else {
          input.classList.remove('is-invalid');
        }
      });

      if (optionsUnder30) {
        pollError.classList.add('invisible');
      }
    });
    
    if (allFieldsValid) {
      createBtn.classList.remove('disabled');
    } else {
      createBtn.classList.add('disabled');
    }
  }

  requiredInputs.forEach(input => {
    input.addEventListener('keyup', checkInputFields);
  });
}
checkPollInputs();

export function createDefaultPolls() {
  if (localStorage.getItem("polls") !== null) return;
  console.info("No polls found. Creating default polls");

  let polls = [];
  const card0 = new pollCard(0, 'Lempieläin', 'Mikä on lempieläimesi?', ['Kissa', 'Koira'], true);
  const card1 = new pollCard(1, 'Ohjelmointikielet', 'Mikä on paras ohjelmointikieli?', ['Python', 'JavaScript', 'C', 'Scratch'], true);
  const card2 = new pollCard(2, 'Äänestäminen', 'Aiotko äänestää?', ['Kyllä', 'En', 'Ehkä'], true);
  polls.push(card0, card1, card2);

  const json = JSON.stringify(polls);
  localStorage.setItem("polls", json);
}

export function loadPolls() {
  const polls = getPolls();
  polls.forEach(poll => {
    new pollCard(poll.id, poll.subject, poll.description, poll.choices, poll.testVotes);
  });
}