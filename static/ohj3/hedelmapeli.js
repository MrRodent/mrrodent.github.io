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
  };
}

function disablePlayBtn() {
  if (!playBtn.classList.contains('disabled')) {
    playBtn.classList.add('disabled');
  };
}

function enableBetBtn() {
  if (betBtn.classList.contains('disabled')) {
    betBtn.classList.remove('disabled');
  };
}

function disableBetBtn() {
  if (!betBtn.classList.contains('disabled')) {
    betBtn.classList.add('disabled');
  };
}

function enableLockBtns() {
  lockBtnsDisabled = false;

  lockBtn1.classList.remove('disabled');
  lockBtn2.classList.remove('disabled');
  lockBtn3.classList.remove('disabled');
  lockBtn4.classList.remove('disabled');

  lockBtn1.classList.replace('btn-outline-secondary', 'btn-outline-primary');
  lockBtn2.classList.replace('btn-outline-secondary', 'btn-outline-primary');
  lockBtn3.classList.replace('btn-outline-secondary', 'btn-outline-primary');
  lockBtn4.classList.replace('btn-outline-secondary', 'btn-outline-primary');
}

function disableLockBtns() {
  lockBtnsDisabled = true;

  lockBtn1.classList.add('disabled');
  lockBtn2.classList.add('disabled');
  lockBtn3.classList.add('disabled');
  lockBtn4.classList.add('disabled');
  
  lockBtn1.classList.remove('active');
  lockBtn2.classList.remove('active');
  lockBtn3.classList.remove('active');
  lockBtn4.classList.remove('active');

  lockBtn1.classList.replace('btn-outline-primary', 'btn-outline-secondary');
  lockBtn2.classList.replace('btn-outline-primary', 'btn-outline-secondary');
  lockBtn3.classList.replace('btn-outline-primary', 'btn-outline-secondary');
  lockBtn4.classList.replace('btn-outline-primary', 'btn-outline-secondary');
  
  lockBtn1.setAttribute('aria-pressed', 'false');
  lockBtn2.setAttribute('aria-pressed', 'false');
  lockBtn3.setAttribute('aria-pressed', 'false');
  lockBtn4.setAttribute('aria-pressed', 'false');
}

function hideLockBtns() {
  if (!lockBtn1.classList.contains('d-none')) {
    lockBtn1.classList.add('d-none');
    lockBtn2.classList.add('d-none');
    lockBtn3.classList.add('d-none');
    lockBtn4.classList.add('d-none');
  };
}

function showLockBtns() {
  if (lockBtn1.classList.contains('d-none')) {
    lockBtn1.classList.remove('d-none');
    lockBtn2.classList.remove('d-none');
    lockBtn3.classList.remove('d-none');
    lockBtn4.classList.remove('d-none');
  };
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
  };

  prizesInfo();
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
    enableLockBtns();
  };

  if (currentlyLocked) {
    currentlyLocked = false;
    disableLockBtns();
  };
}

function getRandomFruit() {
  const rndm = Math.floor(Math.random() * 5);
  return fruits[rndm];
}

function rollFruits(lockArray) {
  for (i = 0; i < 4; i++) {
    if (lockArray[i] === 'false') {
      results[i] = getRandomFruit();
    };
  };
  return results;
}

function outOfMoney() {
  let coinScreen = document.getElementById('insert-coin-screen');
  coinScreen.classList.remove('d-none');

  disableBetBtn();
  hideLockBtns();
}

let isAddingCoins = false;
function addCoins() {
  let moneyTxt = document.getElementById('money-txt');
  let coinTxt = document.getElementById('coin-txt');
  let prizeDisplay = document.getElementById('prize-display');

  // Clicking the button again stops inserting coins and brings back the game screen
  if (isAddingCoins) {
    let fruitScreen = document.getElementById('fruit-screen');
    fruitScreen.classList.remove('d-none');
    let coinScreen = document.getElementById('insert-coin-screen');
    coinScreen.classList.add('d-none');

    enablePlayBtn();
    enableBetBtn();
    showLockBtns();
    disableLockBtns();

    clearInterval(coinTimer);

    prizeDisplay.innerHTML = 'Tervetuloa takaisin';
    coinTxt.innerHTML = '. . .';
    moneyTxt.style.cssText = '';
    coinBtn.innerHTML = 'Mee töihin';
    isAddingCoins = false;
    return;
  };
  
  // Starting the coin inserting process
  isAddingCoins = true;
  money++;
  coinTxt.innerHTML = `Tienattu: ${money}€`;
  
  coinTimer = setInterval(function(){
    money++;
    coinTxt.innerHTML = `Tienattu: ${money}€`;
    moneyTxt.innerHTML = `Rahaa: ${money}€`;
  }, 1000);
  
  coinBtn.innerHTML = 'Takaisin pelaamaan';
  moneyTxt.style.cssText = 'color: green; font-weight: bold;';
  prizeDisplay.innerHTML = 'Paiskitaan hommia..';
  
}

function determinePrizes(results) {
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

  if (prize > 0) {
    didWin = true;
    disableLockBtns();
  };

  return prize;
}

function payPrizes(prize) {
  let prizeDisplay = document.getElementById('prize-display');

  if (didWin) {
    didWin = false;
    money += prize;
    prizeDisplay.innerHTML = `Voitit ${prize}€ !`;
    updateMoneyTxt();
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
}

function updateMoneyTxt() {
  let moneyTxt = document.getElementById('money-txt');
  moneyTxt.innerHTML = `Rahaa: ${money}€`;
}

function convertToEmojis(results) {
  let conversion = [];
  for (i = 0; i < results.length; i++) {
    if (results[i] === 'cherry') {
      conversion[i] = '🍒';
    }
    if (results[i] === 'pear') {
      conversion[i] = '🍐';
    }
    if (results[i] === 'melon') {
      conversion[i] = '🍈';
    }
    if (results[i] === 'apple') {
      conversion[i] = '🍎';
    }
    else if (results[i] === 'moneybag') {
      conversion[i] = '💰';
    };
  };
  return conversion;
}

// Takes care of adding a delay between pressing the play button and paying the possible prizes.
// It also assigns and prints emojis to the randomized results array.
function animateFruits(lockArray, results) {
  let result1 = document.getElementById('result-display1');
  let result2 = document.getElementById('result-display2');
  let result3 = document.getElementById('result-display3');
  let result4 = document.getElementById('result-display4');
  let prizeDisplay = document.getElementById('prize-display');

  let convertedResults = convertToEmojis(results);

  // Disable buttons while animating
  disablePlayBtn();
  disableBetBtn();
  disableLockBtns();
  prizeDisplay.innerHTML = '. . .';

  // Fruit rolling animations
  let animArray = ['🍒', '🍐', '🍈', '🍎', '💰'];
  let frameCount = 0;
  let timeLeft = 28;
  let timerMilliseconds = 100;

  // Timer 1
  let isOverTimer1 = false;
  if (lockArray[0] === 'false') {
    let animTimer1 = setInterval(function() {
      if (timeLeft <= 21) {
        clearInterval(animTimer1);
        result1.innerHTML = convertedResults[0];
        isOverTimer1 = true;
      } else {
        result1.innerHTML = animArray[frameCount];
        
        if (frameCount > 3) {
          frameCount = 0;
        } else {
          frameCount++;
        };
      }
    }, timerMilliseconds);
  } else {
    isOverTimer1 = true;
  };
  
  // Timer 2
  let isOverTimer2 = false;
  if (lockArray[1] === 'false') {
    let animTimer2 = setInterval(function() {
      if (timeLeft <= 14) {
        clearInterval(animTimer2);
        result2.innerHTML = convertedResults[1];
        isOverTimer2 = true;
      } else {
        result2.innerHTML = animArray[frameCount];
        
        if (frameCount > 3) {
          frameCount = 0;
        } else {
          frameCount++;
        };
      }
    }, timerMilliseconds);
  } else {
    isOverTimer2 = true;
  };
  
  // Timer 3
  let isOverTimer3 = false;
  if (lockArray[2] === 'false') {
    let animTimer3 = setInterval(function() {
      if (timeLeft <= 7) {
        clearInterval(animTimer3);
        result3.innerHTML = convertedResults[2];
        isOverTimer3 = true;
      } else {
        result3.innerHTML = animArray[frameCount];
        
        if (frameCount > 3) {
          frameCount = 0;
        } else {
          frameCount++;
        };
      }
    }, timerMilliseconds);
  } else {
    isOverTimer3 = true;
  };

  // Timer 4
  let isOverTimer4 = false;
  if (lockArray[3] === 'false') {
    let animTimer4 = setInterval(function() {
      if (timeLeft <= 0) {
        clearInterval(animTimer4);
        result4.innerHTML = convertedResults[3];
        isOverTimer4 = true;
      } else {
        result4.innerHTML = animArray[frameCount];
        
        if (frameCount > 3) {
          frameCount = 0;
        } else {
          frameCount++;
        };
      }
    }, timerMilliseconds);
  } else {
    isOverTimer4 = true;
  };

  // This timer controls the timeLeft variable and payment of prizes
  let overallTimer = setInterval(function() {
    if (timeLeft <= 0 || (isOverTimer1 && isOverTimer2 && isOverTimer3 && isOverTimer4)) {
      clearInterval(overallTimer);
      // Enable buttons
      enablePlayBtn();
      enableBetBtn();
      toggleLock(lockArray);

      // Pay prizes
      let prize = determinePrizes(results);
      payPrizes(prize);
    } else {
      timeLeft -= 1;
    }
  }, timerMilliseconds);
}

function play() {
  money -= bet;
  updateMoneyTxt();

  let lockArray = getLockArray();
  toggleLock(lockArray);

  results = rollFruits(lockArray);
  animateFruits(lockArray, results);
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

// Debug functions
function voita() {
  results = ['cherry', 'cherry', 'cherry', 'cherry']
  let lockArray = getLockArray();
  animateFruits(lockArray, results);
}

function voita2() {
  results = ['moneybag', 'cherry', 'moneybag', 'moneybag']
  let lockArray = getLockArray();
  animateFruits(lockArray, results);
}

function vararikko() {
  money = 0;
  payPrizes();
}

// Print prizes on launch
prizesInfo();