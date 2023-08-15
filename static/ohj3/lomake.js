// Validointifunktiot
function validoiID(kayttajaID) {
    if (kayttajaID.length < 6) {
        document.getElementById('virheID').innerHTML = 'Minimipituus 6 merkkiä.';
        return false;
    }
    document.getElementById('virheID').innerHTML = '';
    return true;
};

function validoiSalasana(salasana) {
    if (salasana.length < 8) {
        document.getElementById('virheSalasana').innerHTML = 'Minimipituus 8 merkkiä.';
        return false;
    }
    document.getElementById('virheSalasana').innerHTML = '';
    return true;
};

function validoiOsoite(osoite) {
    if (osoite.length < 2) {
        document.getElementById('virheOsoite').innerHTML = 'Anna osoite.';
        return false;
    }
    document.getElementById('virheOsoite').innerHTML = '';
    return true;
};

function validoiKaupunki(kaupunki) {
    if (kaupunki.length < 2) {
        document.getElementById('virheKaupunki').innerHTML = 'Anna kaupunki.';
        return false;
    }
    document.getElementById('virheKaupunki').innerHTML = '';
    return true;
};

function validoiEmail(sposti) 
{
    // HUOM! Muista funktioista poiketen 'return true' ehdon sisällä.
    // Käytetään Regular Expressionia
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(sposti)) {
        document.getElementById('virheEmail').innerHTML = '';
        return true;
    }
    document.getElementById('virheEmail').innerHTML = 'Tarkista että sähköpostiosoite on oikein.';
    return false;
};

function validoiMaa(maa) {
    if (maa == 0) {
        document.getElementById('virheMaa').innerHTML = 'Valitse maa.';
        return false;
    }
    document.getElementById('virheMaa').innerHTML = '';
    return true;
};

function validoiPostinro(postinro) {
    if (isNaN(postinro)) {
        document.getElementById('virhePostinro').innerHTML = 'Ainoastaan numeroita.';
        return false;
    }
    if (postinro.length != 5) {
        document.getElementById('virhePostinro').innerHTML = 'Tarkista että postinumero on tasan 5 numeroa.';
        return false;
    }
    document.getElementById('virhePostinro').innerHTML = '';
    return true;
};

function tarkistaUutiskirje(kirje) {
    if (!kirje) {
        document.getElementById('virheUutiskirje').innerHTML = 'Spämmi on väistämätöntä.';
        return false;
    }
    document.getElementById('virheUutiskirje').innerHTML = '';
    return true;
};

// Suuri validointi
function validointi() {
    const kayttajaID = document.getElementById('inputID').value;
    const salasana = document.getElementById('inputSalasana').value;
    const sposti = document.getElementById('inputEmail').value;
    const osoite = document.getElementById('inputOsoite').value;
    const kaupunki = document.getElementById('inputKaupunki').value;
    const maa = document.getElementById('inputMaa').selectedIndex;
    const postinro = document.getElementById('inputPostinro').value;
    const kirje = document.getElementById('uutiskirje').checked;
    
    // Validoinnit
    if (validoiID(kayttajaID)
        & validoiSalasana(salasana)
        & validoiEmail(sposti)
        & validoiOsoite(osoite)
        & validoiKaupunki(kaupunki)
        & validoiMaa(maa)
        & validoiPostinro(postinro)
        & tarkistaUutiskirje(kirje)) {
            return true;
        };
    return false;
};

// Lähetysnappi
function lahetys() {
    const viesti = document.getElementById('lahetysviesti');

    if (validointi()) {
        viesti.classList.remove('text-danger');
        viesti.classList.add('text-success');
        viesti.innerHTML = 'Kiitos rekisteröitymisestä!';
    }
    else {
        viesti.classList.add('text-danger');
        viesti.innerHTML= 'Tarkista että tiedot ovat oikein.';
    }
};