// Numerot määritelty täällä ylhäällä jotta niihin pääsee helposti käsiksi
let pisteet = 1000000;
let lopetus = false;
// Klikin voima sekä päivitykset klikkiin
let klikkivoima = 1;
const unlockKlikki1 = 5;
const unlockKlikki2 = 50;
const unlockKlikki3 = 2000;
const unlockKlikki4 = 10000;
// Kuusivaiheet määrittävät spriteframen
const kuusiVaihe1 = 850000;
const kuusiVaihe2 = 300000;
const kuusiVaihe3 = 100000;
// Unlockvaiheet määrittävät päivitysten avautumisen
const unlockVaihe1 = 999980;
const unlockVaihe2 = 999500;
const unlockVaihe3 = 990000;
const unlockVaihe4 = 500000;

// Canvaksen toiminta
// Ladataan ensin spritesheet
let kuusipuu = new Image();
kuusipuu.src = '../../static/images/clicker/kuusipuu.png';
kuusipuu.onload = function() {
    init();
};

// Canvaksen määrittely
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
const leveys = 130;
const korkeus = 250;
let frame = 0;

function init() {
    ctx.drawImage(kuusipuu, 0, 0, leveys, korkeus, 0, 0, leveys, korkeus);
};

function seuraavaFrame() {
    // Jos toisiksiviimeinen frame, palataan.
    // Viimeisen saa auki ainoastaan painamalla upgrade 5.
    if (frame == 4) {
        return;
    }
    // Tyhjennys
    ctx.clearRect(0, 0, 130, 250);
    // Seuraavan framen piirto
    frame++;
    ctx.drawImage(kuusipuu, leveys * frame, 0, leveys, korkeus, 0, 0, leveys, korkeus);
};

// Asettaa visuaaliset elementit (laskurin sekä framen)
function refresh() {
    let pisteteksti = document.getElementById('pisteteksti');
    
    // Laskurin teksti
    if (pisteet > 1) {
        pisteteksti.innerHTML = `${pisteet} <br>neulasta`;
        document.title = pisteet + ' neulasta';
    }
    else if (pisteet <= 1) {
        pelinLopetus();
    };

    // Framen vaihto
    if (pisteet <= kuusiVaihe1 && frame == 0) {
        seuraavaFrame();
    }
    else if (pisteet <= kuusiVaihe2 && frame == 1) {
        seuraavaFrame();
    }
    else if (pisteet <= kuusiVaihe3 && frame == 2) {
        seuraavaFrame();
    };

    // Päivitysten avautuminen
    if (pisteet <= unlockVaihe1 && upgrade == 0) {
        unlockUpgrade();
    }
    else if (pisteet <= unlockVaihe2 && upgrade == 1) {
        unlockUpgrade();
    }
    else if (pisteet <= unlockVaihe3 && upgrade == 2) {
        unlockUpgrade();
    }
    else if (pisteet <= unlockVaihe4 && upgrade == 3) {
        unlockUpgrade();
    };
};

// Upgradet
let upgrade = 0;
function unlockUpgrade() {
    if (upgrade == 5)
    {
        return;
    }
    upgrade++;
    const img = document.getElementById(`upg${upgrade}`);
    img.src = `../../static/images/clicker/u_upg${upgrade}.png`
    // Annetaan kuvalle kasa attribuutteja jotta se toimii klikattavana nappina
    img.setAttribute('onclick', `buyUpg${upgrade}()`);
    img.setAttribute('onmouseout', `this.src = '../../static/images/clicker/u_upg${upgrade}.png'; infoteksti("voima")`);
    img.setAttribute('onmouseover', `this.src = '../../static/images/clicker/hl_upg${upgrade}.png'; infoteksti(${upgrade});`);
};

function infoteksti(info) {
    if (!lopetus) {
        const teksti = document.getElementById('infoteksti');
        if (info == "voima") {
            teksti.innerHTML = `Klikkivoima: <b>${klikkivoima}</b>`;
        }
        else if (info == 1) {
            teksti.innerHTML = `Pikkulinnut nokkivat ${unlockKlikki1} neulasta sekunnissa.<br>Päivitetty klikkivoima: <b>${unlockKlikki1}</b>`;
        }
        else if (info == 2) {
            teksti.innerHTML = `Oravat järsivät ${unlockKlikki2} neulasta sekunnissa.<br>Päivitetty klikkivoima: <b>${unlockKlikki2}</b>`;
        }
        else if (info == 3) {
            teksti.innerHTML = `Vuohet syövät oksia ${unlockKlikki3} neulasen sekuntivauhtia.<br>Päivitetty klikkivoima: <b>${unlockKlikki3}</b>`;
        }
        else if (info == 4) {
            teksti.innerHTML = `Jättiläiskarhuja!<br>${unlockKlikki4} neulasta sekunnissa.<br>Päivitetty klikkivoima: <b>${unlockKlikki4}</b>`;
        }
        else if (info == 5) {
            teksti.innerHTML = "Luulis että tällä lähtee.";
        };
    };
};

function ostoRutiini(img) {
    // Poistaa ostetusta päivityksestä attribuutit
    img.removeAttribute('onclick');
    img.removeAttribute('onmouseover');
    img.removeAttribute('onmouseout');
};

function buyUpg1() {
    // Linnut
    const img = document.getElementById('upg1');
    img.src = '../../static/images/clicker/upg1.png';
    ostoRutiini(img);
    // 5 neulasta sekunnissa
    ajastin1 = setInterval(upg1Timer, 200);
    function upg1Timer() {
        pisteet--;
        refresh();
        pudotaRandom();
    };
    klikkivoima = unlockKlikki1;
    infoteksti("voima");
};

function buyUpg2() {
    // Oravat
    const img = document.getElementById('upg2');
    img.src = '../../static/images/clicker/upg2.png';
    ostoRutiini(img)
    // 50 neulasta sekunnissa
    ajastin2 = setInterval(upg2Timer, 20);
    function upg2Timer() {
        pisteet--;
        refresh();
        pudotaRandom();
    };
    klikkivoima = unlockKlikki2;
    infoteksti("voima");
};

function buyUpg3() {
    // Vuohet
    const img = document.getElementById('upg3');
    img.src = '../../static/images/clicker/upg3.png';
    ostoRutiini(img)
    // 2000 neulasta sekunnissa
    ajastin3 = setInterval(upg3Timer, 500);
    function upg3Timer() {
        pisteet = pisteet - 1000;
        refresh();
        pudotaRandom();
    };
    klikkivoima = unlockKlikki3;
    infoteksti("voima");
};

function buyUpg4() {
    // Karhut
    const img = document.getElementById('upg4');
    img.src = '../../static/images/clicker/upg4.png';
    ostoRutiini(img)
    // 10000 neulasta sekunnissa
    ajastin4 = setInterval(upg4Timer, 100);
    function upg4Timer() {
        pisteet = pisteet - 1000;
        refresh();
        pudotaRandom();
    };
    klikkivoima = unlockKlikki4;
    infoteksti("voima");
};

function buyUpg5() {
    // Saha
    const img = document.getElementById('upg5');
    img.src = '../../static/images/clicker/upg5.png';
    ostoRutiini(img);
    if (!lopetus) {
        pelinLopetus();
    };
    kaato();
};

function klikkaus() {
    if (!lopetus) {
        pisteet = pisteet - klikkivoima;
        refresh();
        pudotaKlikkaus();
    };
};

function pelinLopetus() {
    lopetus = true;
    console.log(lopetus);
    // Pysäytä ajastimet mikäli niitä on
    if (typeof ajastin1 !== 'undefined') {
        clearInterval(ajastin1);
    };
    if (typeof ajastin2 !== 'undefined') {
        clearInterval(ajastin2);
    };
    if (typeof ajastin3 !== 'undefined') {
        clearInterval(ajastin3);
    };
    if (typeof ajastin4 !== 'undefined') {
        clearInterval(ajastin4);
    };

    pisteet = 1;
    document.getElementById('pisteteksti').innerHTML = 'Vielä yksi perhanan <br>neulanen';
    document.title = '1 neulanen';

    unlockUpgrade();
    seuraavaFrame();
};

function kaato() {
    // Vaihtaa kuvaksi kannon ja ilmoittaa pelin olevan ohi
    ctx.clearRect(0, 0, 130, 250);
    ctx.drawImage(kuusipuu, leveys * 5, 0, leveys, korkeus, 0, 0, leveys, korkeus);
    document.getElementById('pisteteksti').innerHTML = 'Game over'
    document.getElementById('infoteksti').innerHTML = 'Se oli siinä.';
};

// Animoinnit
function luoNeula() {
    // Array neulasten kuvista
    let neulaArray = [
        '../../static/images/clicker/neula1.png',
        '../../static/images/clicker/neula2.png',
        '../../static/images/clicker/neula3.png',
        '../../static/images/clicker/neula4.png',
        '../../static/images/clicker/neula5.png',
        '../../static/images/clicker/neula6.png',
        '../../static/images/clicker/neula7.png',
        '../../static/images/clicker/neula8.png'
    ];    
    // Valitse random kuva
    let randomIndex = Math.floor(Math.random() * neulaArray.length);
    let randomNeula = neulaArray[randomIndex];
    // Luo kuva ja palauta
    let img = new Image();
    img.src = randomNeula;
    img.style.position = 'absolute';
    img.style.width = '3px';
    img.style.height = '3px';
    return img;
};

function pudotaKlikkaus() {
    let img = luoNeula();
    document.body.appendChild(img);
    // Animointi
    document.onclick = function(event) {
        img.style.left = event.clientX + 'px';
        img.style.top = event.clientY + 'px';
        let pos = event.clientY;
        let offset = Math.floor(Math.random() * 120) - 60;
        let id = setInterval(frame, 1);
        // Pudota neulanen näkyvän ikkunan yli ja poista jottei vie liikaa resursseja
        function frame() {
            if (pos == window.innerHeight + 100) {
                clearInterval(id);
                img.remove();
            } 
            else {
                pos++;
                img.style.top = pos + 'px';
                img.style.left = (event.clientX + offset) + 'px';
            }
        }
    };
};

function pudotaRandom () {
    let img = luoNeula();
    document.body.appendChild(img);
    // Animointi
    let pos = 0;
    let left = Math.floor(Math.random() * window.innerWidth);
    img.style.left = left + 'px';
    let id = setInterval(frame, 2);
    // Pudota neulanen näkyvän ikkunan yli ja poista jottei vie liikaa resursseja
    function frame() {
        if (pos == window.innerHeight + 100) {
            clearInterval(id);
            img.remove();
        } 
        else {
            pos++;
            img.style.top = pos + 'px';
        };
    };
};

// Debug-työkaluja
function miinus100() {
    pisteet = pisteet - 100;
    refresh();
};

function miinus1000() {
    pisteet = pisteet - 1000;
    refresh();
};

function miinus10000() {
    pisteet = pisteet - 10000;
    refresh();
};

function miinus100000() {
    pisteet = pisteet - 100000;
    refresh();
};
// Debug-agendan teksti on toteutettu täällä dynaamisuuden vuoksi.
document.getElementById('debug-agenda').innerHTML = 
    `<u>Aukeamisajat ja klikkivoima:</u><br>
    Upg1: ${unlockVaihe1} / ${unlockKlikki1}<br>
    Upg2: ${unlockVaihe2} / ${unlockKlikki2}<br>
    Upg3: ${unlockVaihe3} / ${unlockKlikki3}<br>
    Upg4: ${unlockVaihe4} / ${unlockKlikki4}`;