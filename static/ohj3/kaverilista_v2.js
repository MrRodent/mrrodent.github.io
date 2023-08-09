const kaverit = [];
let i = 0;

// Tulostaa koko listan uusiksi (sen sijaan että lisäisi listan perälle)
function tulosta(lista) {
    document.querySelector("#tuloste").innerHTML = "";
    kaverit.forEach(kaveri => {
        document.querySelector("#tuloste").innerHTML += kaveri + "<br>";
    });
}

// Lisäys
document.querySelector("#lisaa").addEventListener("click", function() {
    kaverit[i] = document.querySelector("input[name='nimi']").value;
    // Tyhjennys
    document.querySelector("input[name='nimi']").value = "";
    document.querySelector("#poistovirhe").innerHTML = "";

    // Tulosta listan loppuun
    document.querySelector("#tuloste").innerHTML += kaverit[i] + "<br>";
    i += 1;
});

// Poisto
document.querySelector("#poista").addEventListener("click", function() {
    let poistettava = document.querySelector("input[name='nimi']").value;
    let indeksi = kaverit.indexOf(poistettava);

    if (indeksi > -1) {
        document.querySelector("input[name='nimi']").value = "";
        document.querySelector("#poistovirhe").innerHTML = "";
        kaverit.splice(indeksi, 1);
        i -= 1;
        tulosta(kaverit)
    }
    else
    {
        document.querySelector("#poistovirhe").innerHTML = "Tarkista että nimi on kirjoitettu oikein";
    }
    ;
});

// Järjestely
document.querySelector("#jarjesta").addEventListener("click", function() {
    document.querySelector("#poistovirhe").innerHTML = "";
    kaverit.sort();
    tulosta(kaverit);
});