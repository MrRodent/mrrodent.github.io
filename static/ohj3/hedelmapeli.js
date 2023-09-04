// Winning factors
const FOUR_MONEYBAGS = 10;
const FOUR_APPLES = 6;
const FOUR_MELONS = 5;
const FOUR_PEARS = 4;
const FOUR_CHERRIES = 3;
const THREE_MONEYBAGS = 5;

// Globals
let bet = 1;
let money = 10;
let coinTimer;
const fruits = ['cherry', 'pear', 'melon', 'apple', 'moneybag'];
let results = [];


let currentlyLocked = false;
let lockBtnsDisabled = true;
let didWin = false;

// Buttons
const lockBtn1 = document.getElementById('lock-btn1');
const lockBtn2 = document.getElementById('lock-btn2');
const lockBtn3 = document.getElementById('lock-btn3');
const lockBtn4 = document.getElementById('lock-btn4');
const playBtn = document.getElementById('play-btn');
const betBtn = document.getElementById('bet-btn');
const coinBtn = document.getElementById('coin-btn');

playBtn.addEventListener('click', play, false);
betBtn.addEventListener('click', changeBet, false);
coinBtn.addEventListener('click', addCoins, false);

function enablePlayBtn() {
  if (playBtn.classList.contains('disabled')) {
    playBtn.classList.remove('disabled');
  }
}

function disablePlayBtn() {
  if (!playBtn.classList.contains('disabled')) {
    playBtn.classList.add('disabled');
  }
}

function changeBet() {
  let betTxt = document.getElementById('bettxt');
  
  if (bet < 5) {
    bet++;
  } else {
    bet = 1;
  };
  betTxt.innerHTML = `Panos: ${bet}€`

  if (bet > money) {
    disablePlayBtn();
  }
  else if (bet <= money) {
    enablePlayBtn();
  }

  prizesInfo();
}

function getRandomFruit() {
  const rndm = Math.floor(Math.random() * 5);
  return fruits[rndm];
}

function getLockArray() {
  let isLocked1 = lockBtn1.getAttribute('aria-pressed');
  let isLocked2 = lockBtn2.getAttribute('aria-pressed');
  let isLocked3 = lockBtn3.getAttribute('aria-pressed');
  let isLocked4 = lockBtn4.getAttribute('aria-pressed');
  return [isLocked1, isLocked2, isLocked3, isLocked4];
}

/* Figures out the state of the lock buttons and switches them either on or off */
function toggleLock(lockArray) {
  for (i = 0; i < lockArray.length; i++) {
    if (lockArray[i] === 'true')
    {
      currentlyLocked = true;
    }
  };

  if (lockBtnsDisabled) {
    lockBtnsDisabled = false;

    lockBtn1.classList.remove('disabled');
    lockBtn2.classList.remove('disabled');
    lockBtn3.classList.remove('disabled');
    lockBtn4.classList.remove('disabled');
  };

  if (currentlyLocked) {
    lockBtnsDisabled = true;
    currentlyLocked = false;

    lockBtn1.classList.add('disabled');
    lockBtn2.classList.add('disabled');
    lockBtn3.classList.add('disabled');
    lockBtn4.classList.add('disabled');
    
    lockBtn1.classList.remove('active');
    lockBtn2.classList.remove('active');
    lockBtn3.classList.remove('active');
    lockBtn4.classList.remove('active');
    
    lockBtn1.setAttribute('aria-pressed', 'false');
    lockBtn2.setAttribute('aria-pressed', 'false');
    lockBtn3.setAttribute('aria-pressed', 'false');
    lockBtn4.setAttribute('aria-pressed', 'false');
  };
}

function rollFruits(lockArray) {
  for (i = 0; i < 4; i++) {
    if (lockArray[i] === 'false') {
      results[i] = getRandomFruit();
    };
  };
  return results;
}

function printFruits(results) {
  let result1 = document.getElementById('result-display1');
  let result2 = document.getElementById('result-display2');
  let result3 = document.getElementById('result-display3');
  let result4 = document.getElementById('result-display4');
  let convert = [];

  for (i = 0; i < results.length; i++) {
    if (results[i] === 'cherry') {
      convert[i] = '🍒';
    }
    if (results[i] === 'pear') {
      convert[i] = '🍐';
    }
    if (results[i] === 'melon') {
      convert[i] = '🍈';
    }
    if (results[i] === 'apple') {
      convert[i] = '🍎';
    }
    else if (results[i] === 'moneybag') {
      convert[i] = '💰';
    };
  };

  result1.innerHTML = convert[0];
  result2.innerHTML = convert[1];
  result3.innerHTML = convert[2];
  result4.innerHTML = convert[3];
}

function updateMoney(prize) {
  let moneyTxt = document.getElementById('money-txt');
  let prizeDisplay = document.getElementById('prize-display');

  money -= bet;

  if (didWin) {
    money += prize;
    prizeDisplay.innerHTML = `Voitit ${prize}€ !`;
    didWin = false;
  } else {
    prizeDisplay.innerHTML = 'Ei voittoa';
  };

  if (money < bet) {
    disablePlayBtn();
  };

  if (money <= 0) {
    money = 0;
    disablePlayBtn();
    prizeDisplay.innerHTML = 'Rahat loppu!';
    outOfMoney();
  };

  moneyTxt.innerHTML = `Rahaa: ${money}€`;
}

function outOfMoney() {
  let fruitScreen = document.getElementById('fruit-screen');
  fruitScreen.classList.add('d-none');
  let coinScreen = document.getElementById('insert-coin-screen');
  coinScreen.classList.remove('d-none');

  betBtn.classList.add('disabled');
}

let isAddingCoins = false;
function addCoins() {
  let moneyTxt = document.getElementById('money-txt');
  let prizeDisplay = document.getElementById('prize-display');

  // Clicking the button again stops inserting coins and brings back the game screen
  if (isAddingCoins) {
    let fruitScreen = document.getElementById('fruit-screen');
    fruitScreen.classList.remove('d-none');
    let coinScreen = document.getElementById('insert-coin-screen');
    coinScreen.classList.add('d-none');

    enablePlayBtn();
    betBtn.classList.remove('disabled');

    clearInterval(coinTimer);

    prizeDisplay.innerHTML = 'Tervetuloa takaisin';
    moneyTxt.style.cssText = '';
    coinBtn.innerHTML = 'Mee töihin';
    isAddingCoins = false;
    return;
  };

  // Starting the coin inserting process
  isAddingCoins = true;
  
  coinTimer = setInterval(function(){
    money++;
    moneyTxt.innerHTML = `Rahaa: ${money}€`;
  }, 800);
  
  moneyTxt.style.cssText = 'color: green';
  prizeDisplay.innerHTML = 'Paiskitaan hommia..';
  coinBtn.innerHTML = 'Takaisin pelaamaan';
  
}

function checkWinnings(results) {
  const isIdentical = results.every((fruit) => fruit === results[0]);
  let prize = 0;
  
  if (isIdentical && results[0] === 'cherry') {
    prize = FOUR_CHERRIES * bet;
  }
  else if (isIdentical && results[0] === 'pear') {
    prize = FOUR_PEARS * bet;
  }
  else if (isIdentical && results[0] === 'melon') {
    prize = FOUR_MELONS * bet;
  }
  else if (isIdentical && results[0] === 'apple') {
    prize = FOUR_APPLES * bet;
  }
  else if (isIdentical && results[0] === 'moneybag') {
    prize = FOUR_MONEYBAGS * bet;
  } else {
    let bagCounter = 0;

    results.forEach(item => {
      if (item === 'moneybag') {
        bagCounter++;
      }
    });

    if (bagCounter === 3) {
      prize = THREE_MONEYBAGS * bet;
    }
  };

  prize > 0 ? didWin = true : false;
  return prize;
}

function play() {
  let lockArray = getLockArray();
  toggleLock(lockArray);

  results = rollFruits(lockArray);
  printFruits(results);
  
  let prize = checkWinnings(results);
  updateMoney(prize);
}

function prizesInfo() {
  let infoTxt = document.getElementById('info-txt');
  infoTxt.innerHTML = `
  💰💰💰💰 = <strong>${FOUR_MONEYBAGS * bet}€</strong> <br>
  🍎🍎🍎🍎 = <strong>${FOUR_APPLES * bet}€</strong> <br>
  🍈🍈🍈🍈 = <strong>${FOUR_MELONS * bet}€</strong> <br>
  💰💰💰 = <strong>${THREE_MONEYBAGS * bet}€</strong> <br>
  🍐🍐🍐🍐 = <strong>${FOUR_PEARS * bet}€</strong> <br>
  🍒🍒🍒🍒 = <strong>${FOUR_CHERRIES * bet}€</strong> <br>
  `;
}

function startGame() {
  prizesInfo();
}
// Debug
startGame();

function voita() {
  results = ['cherry', 'cherry', 'cherry', 'cherry']
  printFruits(results);
  
  let prize = checkWinnings(results);
  updateMoney(prize);
}

function voita2() {
  results = ['moneybag', 'cherry', 'moneybag', 'moneybag']
  checkWinnings(results);
  printFruits(results);

  let prize = checkWinnings(results);
  updateMoney(prize);
}