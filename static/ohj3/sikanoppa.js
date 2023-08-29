const lyhytpeli = 25;
const peruspeli = 100;
const pitkapeli = 300;

let pelionohi = false;
let alkuruutu = true;
let ekaheitto = true;
let yhdennopanpeli = false;

class Pelaaja {
    constructor(nimi, pisteet, passannut, vuorossa) {
        this.nimi = nimi;
        this.pisteet = pisteet;
        this.passannut = passannut;
        this.vuorossa = vuorossa;
    }
};

// Napit
let uusipeli = document.getElementById('uusipelinappi');
uusipeli.addEventListener('click', palaaAlkuruutuun, false);
let pelaajanappi = document.getElementById('pelaajanappi');
pelaajanappi.addEventListener('click', luoPelaaja, false);
let aloitusnappi = document.getElementById('aloitusnappi')
aloitusnappi.addEventListener('click', aloitaPeli, false);
let heittonappi = document.getElementById('heittonappi');

// ALOITUSRUUTU
document.querySelector("label[for='pelinpituus1']").innerHTML = `Lyhyt: ${lyhytpeli} pistettä`;
document.querySelector("label[for='pelinpituus2']").innerHTML = `Perus: ${peruspeli} pistettä`;
document.querySelector("label[for='pelinpituus3']").innerHTML = `Pitkä: ${pitkapeli} pistettä`;

// Luo instanssi pelaajasta ja lisää se pelaajat-arrayhyn.
let pelaajat = [];
function luoPelaaja() {
    let nimi = document.getElementById('inputpelaajanappi').value;
    if (nimi == '') {
        infoFunktio('tyhjapelaaja');
        return;
    };
    if (pelaajat.length >= 7) {
        infoFunktio('maksimipelaajamaara');
        pelaajanappi.classList.add('disabled');
    };
    pelaajat.forEach(pelaaja => {
        if (nimi == pelaaja.nimi) {
            nimi = 'Pikku-' + nimi;
        }
    });
    
    // Luo pelaaja ja aseta vuoroon mikäli ensimmäinen
    let pelaaja = new Pelaaja(nimi, 0, false);
    if (pelaajat.length == 0) {
        pelaaja.vuorossa = true;
    };
    pelaajat.push(pelaaja)
    
    tulostaPelaajat();
    // Jos pelaajia on enemmän kuin 2, peli voi alkaa
    if (pelaajat.length >= 2) {
        aktivoiAloitusnappi();
    };
}

function aktivoiAloitusnappi() {
    aloitusnappi.classList.replace('btn-secondary', 'btn-outline-danger');
    aloitusnappi.classList.remove('disabled');
    aloitusnappi.innerHTML = 'Aloita peli';
};

function tulostaPelaajat() {
    let lista = document.getElementById('pelaajalista');
    // Tyhjennä
    lista.innerHTML = '';
    // Tulosta
    let jarjestys = 0;
    pelaajat.forEach(pelaaja => {
        jarjestys++;
        if (pelaaja.vuorossa) {
            lista.innerHTML += `<strong>${jarjestys}. ${pelaaja.nimi}: ${pelaaja.pisteet}</strong><br>`
        }
        else {
            // Jos pisteet ylittävät asetetun rajapyykin, muutetaan pelaajan nimi vihreäksi.
            if (pelaaja.pisteet >= valittupituus && !alkuruutu) {
                lista.innerHTML += `${jarjestys}. ${pelaaja.nimi}:
                <span style="color: green; font-weight: bold"> ${pelaaja.pisteet}</span><br>`
            }
            else {
                lista.innerHTML += `${jarjestys}. ${pelaaja.nimi}: ${pelaaja.pisteet}<br>`
            }
        }
    });
};

const noppakuva1 = document.getElementById('noppakuva1');
const noppakuva2 = document.getElementById('noppakuva2');
let pistedisplay = document.getElementById('pistedisplay');
let pistejana = document.getElementById('pistejana');

// Aktivoi heittonapin ja nopat, kirkastaa noppakuvat
function aktivoiHeittonappi(isTrue) {
    if (isTrue){
        heittonappi.classList.remove('disabled');
        heittonappi.classList.replace('btn-secondary', 'btn-outline-danger');
        passausnappi.innerHTML = 'Pankki';
        noppakuva1.classList.remove('dimmed');
        noppakuva2.classList.remove('dimmed');

        if (yhdennopanpeli) {
            noppakuva1.addEventListener('click', yhdenNopanHeitto, false);
        }
        else {
            noppakuva1.addEventListener('click', kahdenNopanHeitto, false);
            noppakuva2.addEventListener('click', kahdenNopanHeitto, false);
        };
    }
    else {
        heittonappi.classList.add('disabled');
        heittonappi.classList.replace('btn-outline-danger', 'btn-secondary');
        passausnappi.innerHTML = 'Passaa';
        noppakuva1.classList.add('dimmed');
        noppakuva2.classList.add('dimmed');
        noppakuva1.removeEventListener('click', yhdenNopanHeitto, false);

        if (yhdennopanpeli) {
            noppakuva1.removeEventListener('click', yhdenNopanHeitto, false);
        }
        else {
            noppakuva1.removeEventListener('click', kahdenNopanHeitto, false);
            noppakuva2.removeEventListener('click', kahdenNopanHeitto, false);
        };
    };
};

let valittupituus = 0;
function aloitaPeli() {
    pelionohi = false;
    let pituus = document.querySelector('input[name="pelinpituus"]:checked').id;

    if (pituus == "pelinpituus1") {
        valittupituus = lyhytpeli;
    }
    else if (pituus == "pelinpituus2") {
        valittupituus = peruspeli;
    }
    else if (pituus == "pelinpituus3") {
        valittupituus = pitkapeli;
    };
    
    let noppia = document.querySelector('input[name="noppamaara"]:checked').id;
    if (noppia == 'yksinoppa') {
        yksinoppa(valittupituus);
    }
    else if (noppia == 'kaksinoppaa') {
        kaksinoppaa(valittupituus);
    };
    poistuAlkuruudusta();
};

// Piilottaa alkuruudun elementit ja tuo tilalle peliruudun
function poistuAlkuruudusta() {
    alkuruutu = false;
    document.getElementById('otsikko').classList.add('d-none');
    document.getElementById('alkuruutu').classList.add('d-none');
    document.getElementById('heittonappi').classList.remove('d-none');
    document.getElementById('passausnappi').classList.remove('d-none');
    document.getElementById('aloitusnappi').classList.add('d-none');
    document.getElementById('peliruutu').classList.remove('d-none');
    let pituusinfo = document.getElementById('pelinpituusinfo');
    pituusinfo.classList.remove('d-none')
    pituusinfo.innerHTML= `Pelin pituus: <strong>${valittupituus}</strong> pistettä`

    if (!yhdennopanpeli) {
        document.getElementById('kahdensaannot').classList.remove('d-none');
    };
};

function palaaAlkuruutuun() {
    alkuruutu = true;
    ekaheitto = true;
    document.getElementById('alkuruutu').classList.remove('d-none');
    document.getElementById('peliruutu').classList.add('d-none');
    document.getElementById('pelinpituusinfo').classList.add('d-none');
    document.getElementById('uusipelinappi').classList.add('d-none');
    document.getElementById('aloitusnappi').classList.remove('d-none');

    if (!yhdennopanpeli) {
        document.getElementById('kahdensaannot').classList.add('d-none');
        noppakuva2.classList.add('d-none');
    };

    pelaajat.forEach(pelaaja => {
        pelaaja.pisteet = 0;
    });

    pistedisplay.innerHTML = 'Terve taas';
    pistejana.innerHTML = '🎲 ';
    tulostaPelaajat();
};

// Pelin valmistelu
function yksinoppa(pituus) {
    yhdennopanpeli = true;
    infoFunktio('alkuinfo_yksinoppa', pituus);
    heittonappi.addEventListener('click', yhdenNopanHeitto, false);
    aktivoiHeittonappi(true);
};

// Pelin valmistelu
function kaksinoppaa(pituus) {
    yhdennopanpeli = false;
    infoFunktio('alkuinfo_kaksinoppaa', pituus);
    noppakuva2.classList.remove('d-none');
    heittonappi.addEventListener('click', kahdenNopanHeitto, false);
    aktivoiHeittonappi(true);
};

const noppa_array = [
    '../../static/images/sika/1_dot.png',
    '../../static/images/sika/2_dots.png',
    '../../static/images/sika/3_dots.png',
    '../../static/images/sika/4_dots.png',
    '../../static/images/sika/5_dots.png',
    '../../static/images/sika/6_dots.png'
];

// Nopanheitto
let pisteet = 0;
function yhdenNopanHeitto() {
    let luku = arvoLuku();
    let kuva = document.getElementById('noppakuva1');
    kuva.src = noppa_array[luku-1];
    
    // Yhden nopan pelissä ykkösestä menettää pisteet ja vuoro siirtyy seuraavalle
    if (yhdennopanpeli && luku === 1) {
        pistejana.innerHTML += `<span style="color: darkred; font-weight: bold">1</span> = `
        huonoHeitto(kuva);
        infoFunktio('yksisilma');
    }
    else {
        heittoAnimaatio(kuva);
        pisteet += luku;
        pistedisplay.innerHTML = `Pisteet: ${pisteet}`;
        pistejana.innerHTML += `${luku} + `
    };

    ekaheitto = false;
};

let tuplalaskuri = 0;
function kahdenNopanHeitto() {
    let luku1 = arvoLuku();
    let luku2 = arvoLuku();
    let yhteisluku = luku1 + luku2;
    let kuva1 = document.getElementById('noppakuva1');
    kuva1.src = noppa_array[luku1-1];
    let kuva2 = document.getElementById('noppakuva2');
    kuva2.src = noppa_array[luku2-1];

    // Jos vain toinen luvuista on ykkönen, menettää pisteet ja vuoro siirtyy
    if ((luku1 === 1 && luku2 !== 1) || (luku1 !== 1 && luku2 === 1)) {
        pistejana.innerHTML += `<span style="color: darkred; font-weight: bold">1</span> = `
        huonoHeitto(kuva1, kuva2);
        infoFunktio('yksisilma');
        return;
    }
    // Tuplat antavat nopista tuplapisteet (tai 25 jos tuplaykköset)
    else if (luku1 === luku2) {
        tuplalaskuri++;
        if (tuplalaskuri === 3) {
            pistejana.innerHTML += `<span style="color: darkred; font-weight: bold">${yhteisluku}</span> = `
            huonoHeitto(kuva1, kuva2);
            pistedisplay.innerHTML += '💸';
            infoFunktio('triplat');
            return;
        };

        if (luku1 === 1) {
            yhteisluku = 25;
            pisteet += yhteisluku;
            pistedisplay.innerHTML = `Pisteet: <span style="color: red; font-weight: bold">${pisteet}</span>`;
            pistejana.innerHTML += `<span style="color: red; font-weight: bold">${yhteisluku}</span> + `
        }
        else {
            yhteisluku = luku1 * 2 + luku2 * 2;
            pisteet += yhteisluku;
            pistedisplay.innerHTML = `Pisteet: <span style="color: blue; font-weight: bold">${pisteet}</span>`;
            pistejana.innerHTML += `<span style="color: blue; font-weight: bold">${yhteisluku}</span> + `
        }
    }
    else {
        pisteet += yhteisluku;
        pistedisplay.innerHTML = `Pisteet: ${pisteet}`;
        pistejana.innerHTML += `${yhteisluku} + `
    };
    
    heittoAnimaatio(kuva1);
    heittoAnimaatio(kuva2);

    ekaheitto = false;
};

function arvoLuku() {
    let luku = Math.floor(Math.random() * 6) + 1;
    // Jos ensimmäinen heitto antaisi ykkösen, muutetaan kakkoseksi ettei tunnu niin pahalta.
    if (ekaheitto && luku == 1) {
        console.log('Kohtaloa on kopeloitu.');
        luku = 2;
    };
    return luku;
};

function huonoHeitto(kuva1, kuva2) {
    huonoheittoAnimaatio(kuva1);
    if (kuva2) {
        huonoheittoAnimaatio(kuva2);
    };
    pisteet = 0;
    pistedisplay.innerHTML = 'Pisteet: 💔';
    pistejana.innerHTML += '💀';
    aktivoiHeittonappi(false);
};

// Animaatiot
function heittoAnimaatio(kuva) {
    if (kuva.classList.contains('huonoheittoanimaatio')) {
        kuva.classList.remove('huonoheittoanimaatio')
    };

    kuva.classList.remove('heittoanimaatio');
    // Tarvitaan animaation resettaamiseen
    void kuva.offsetWidth;
    kuva.classList.add('heittoanimaatio');
};

function huonoheittoAnimaatio(kuva) {
    kuva.classList.remove('huonoheittoanimaatio');
    void kuva.offsetWidth;
    kuva.classList.add('huonoheittoanimaatio');
};

// Passaaminen
let passausnappi = document.getElementById('passausnappi');
passausnappi.addEventListener('click', passaus, false);

function passaus() {
    // Filtteröi vuorossa oleva pelaaja omaan arrayhin
    let pelaaja = pelaajat.filter(p => p.vuorossa);
    // Lisää pisteet ja vaihda vuoro
    pelaaja[0].pisteet += pisteet;
    pelaaja[0].vuorossa = false;
    pelaaja[0].passannut = true;
    // Filtteröi pelaajat jotka eivät olleet vielä vuorossa
    let seuraavat = pelaajat.filter(p => !p.passannut);

    if (seuraavat.length == 0)  {
        if (!pelionohi) {
            infoFunktio('uusikierros', pelaaja[0].nimi, pisteet, pelaajat[0].nimi);
        }
        uusiKierros();
    }
    else {
        seuraavat[0].vuorossa = true;
        infoFunktio('passaus', pelaaja[0].nimi, pisteet, seuraavat[0].nimi);
    };

    // Jos peli ei ole ohi, nollaa pistenäyttö
    if (pelionohi) {
        pisteet = 0;
        return;
    }
    else {
        // Nollaa pisteet
        pisteet = 0;
        pistedisplay.innerHTML = 'Pisteet: 0';
        pistejana.innerHTML = '🎲 ';
    
        ekaheitto = true;
        tuplalaskuri = 0;
        aktivoiHeittonappi(true);
        tulostaPelaajat();
    };
};

function uusiKierros() {
    // Tarkista mikäli joku ylittänyt vaaditun pistemäärän
    pelaajat.forEach(pelaaja => {
        if (pelaaja.pisteet >= valittupituus) {
            peliOhi();
            return;
        };
    });
    // Vaihda kaikkien 'passannut' falseksi
    pelaajat.forEach(pelaaja => {
        pelaaja.passannut = false;
    });
    pelaajat[0].vuorossa = true;
};

// Lopetusfunktio
function peliOhi() {
    pelionohi = true;

    // Tummenna noppakuvat
    aktivoiHeittonappi(false);
    // Tulosta loppupisteet
    tulostaPelaajat();

    // Selvitä voittaja tai tasapeli
    const maxPisteet = Math.max(...pelaajat.map(p => p.pisteet));
    const voittajat = pelaajat.filter(p => p.pisteet === maxPisteet);

    if (voittajat.length > 1) {
        pistedisplay.innerHTML = 'Tasapeli';
        pistejana.innerHTML = '\u{1F91D}';
        infoFunktio('tasapeli');
    } 
    else {
        pistedisplay.innerHTML = voittajat[0].nimi;
        pistejana.innerHTML = `voitti <span style="color: green; font-weight: bold">
        ${voittajat[0].pisteet}</span> pisteellä!`
        infoFunktio('voitto', voittajat[0].nimi);
    }

    // Poista eventlistenerit heittonapista
    if (yhdennopanpeli) {
        heittonappi.removeEventListener('click', yhdenNopanHeitto, false);
    }
    else {
        heittonappi.removeEventListener('click', kahdenNopanHeitto, false);
    }

    // Muuta napit
    heittonappi.classList.add('d-none');
    passausnappi.classList.add('d-none');
    uusipeli.classList.remove('d-none');
};

// Infoteksti
function infoFunktio(info, info2, info3, info4) {
    let infoteksti = document.getElementById('infoteksti');
    let infolaatikko = document.getElementById('infolaatikko');

    function varoitus() {
        infoteksti.classList.add('text-danger-emphasis');
        infolaatikko.classList.replace('bg-body-secondary', 'bg-danger-subtle');
    };

    function ilmoitus() {
        infoteksti.classList.add('text-info-emphasis');
        infolaatikko.classList.replace('bg-body-secondary', 'bg-info-subtle');
    };

    // Poista ilmoitus/varoitustila mikäli päällä
    if (infoteksti.classList.contains('text-danger-emphasis')) {
        infoteksti.classList.remove('text-danger-emphasis');
        infolaatikko.classList.replace('bg-danger-subtle', 'bg-body-secondary');
    }
    else if (infoteksti.classList.contains('text-info-emphasis')) {
        infoteksti.classList.remove('text-info-emphasis');
        infolaatikko.classList.replace('bg-info-subtle', 'bg-body-secondary');
    }

    // Tekstit
    if (info == 'tyhjenna') {
        infoteksti.innerHTML = '';
    }
    else if (info == 'yksinoppa') {
        infoteksti.innerHTML = `Yhden nopan sika on simppeli peli.<br><br>
        <em>Suositeltu pituus: <strong>lyhyt</strong> tai <strong>perus</strong></em>`;
    }
    else if (info == 'kaksinoppaa') {
        infoteksti.innerHTML = `Kahden nopan sika on paljon jännempää.<br><br>
        <em>Suositeltu pituus: <strong>perus</strong> tai <strong>pitkä</strong></em>`;
    }
    else if (info == 'tyhjapelaaja') {
        varoitus();
        infoteksti.innerHTML = 'Anna pelaajalle nimi';
    }
    else if (info == 'maksimipelaajamaara') {
        varoitus();
        infoteksti.innerHTML = 'Maksimimäärä pelaajia saavutettu.';
    }
    else if (info == 'alkuinfo_yksinoppa') {
        ilmoitus();
        infoteksti.innerHTML = `Peli päättyy sillä kierroksella kun joku pelaajista 
        <strong>ylittää ${info2} pistettä.</strong><br>Heittää saa niin kauan kunnes passaa, mutta 
        varo - jos heität <strong>ykkösen</strong>, menetät kaikki pisteesi.`;
    }
    else if (info == 'alkuinfo_kaksinoppaa') {
        ilmoitus();
        infoteksti.innerHTML = `Peli päättyy sillä kierroksella kun joku pelaajista 
        <strong>ylittää ${info2} pistettä.</strong><br><br>
        ⚂⚂ <em><strong>Tuplat</strong> antavat molemmista nopista tuplapisteet</em><br>
        ⚀⚀ <em><strong>Tuplaykköset</strong> antavat massiiviset 25 pistettä</em><br>
        💀 ⚀ <em><strong>Yksinäisestä ykkösestä</strong> menettää vuoron ja pisteet</em><br>
        💀 <em><strong>Kolmesta peräkkäisestä tuplasta</strong> menettää vuoron ja pisteet</em><br><br>
        Heittää saa niin kauan kunnes passaa.<br>`;
    }
    else if (info == 'kahdensaannot') {
        ilmoitus();
        infoteksti.innerHTML = `
        ⚂⚂ <em><strong>Tuplat</strong> antavat molemmista nopista tuplapisteet</em><br>
        ⚀⚀ <em><strong>Tuplaykköset</strong> antavat massiiviset 25 pistettä</em><br>
        💀 ⚀ <em><strong>Yksinäisestä ykkösestä</strong> menettää vuoron ja pisteet</em><br>
        💀 <em><strong>Kolmesta peräkkäisestä tuplasta</strong> menettää vuoron ja pisteet</em><br><br>
        Heittää saa niin kauan kunnes passaa.<br>`;
    }
    else if (info == 'yksisilma') {
        varoitus();
        infoteksti.innerHTML = '<strong>Heitit ykkösen!</strong><br>Pisteet meni sivu suun.';
    }
    else if (info == 'triplat') {
        varoitus();
        infoteksti.innerHTML = '<strong>Kolmet tuplat!</strong><br>Pistepotti haihtui savuna ilmaan.';
    }
    else if (info == 'passaus') {
        infoteksti.innerHTML = `${info2} pankitti ${info3} pistettä.<br>Vuorossa on <strong>${info4}</strong>.`
    }
    else if (info == 'uusikierros') {
        infoteksti.innerHTML = `${info2} pankitti ${info3} pistettä.<br><strong>${info4}</strong> aloitaa uuden kierroksen.`
    }
    else if (info == 'voitto') {
        infoteksti.innerHTML = `Onneksi olkoon <strong>${info2}</strong>!`;
    }
    else if (info == 'tasapeli') {
        infoteksti.innerHTML = 'Onnea voittajille!';
    }
};

// DEBUG
function debugpeli1() {
    let p1 = new Pelaaja("Bugi-Bob", 0, false, true);
    let p2 = new Pelaaja("Lagi-Laila", 0, false, false);
    pelaajat = [p1, p2];
    valittupituus = lyhytpeli;
    poistuAlkuruudusta();
    yksinoppa(valittupituus);
    aktivoiAloitusnappi();
    aktivoiHeittonappi(true);
    tulostaPelaajat();
};

function debugpeli2() {
    let p1 = new Pelaaja("Bugi-Bob", 0, false, true);
    let p2 = new Pelaaja("Lagi-Laila", 0, false, false);
    let p3 = new Pelaaja("Glitchin' Gertrud", 0, false, false);
    pelaajat = [p1, p2, p3];
    valittupituus = peruspeli;
    poistuAlkuruudusta();
    kaksinoppaa(valittupituus);
    aktivoiAloitusnappi();    
    aktivoiHeittonappi(true);
    tulostaPelaajat();
};

function motherlode() {
    pelaajat.forEach(pelaaja => {
        pelaaja.pisteet += 10;
    });
    tulostaPelaajat();
};