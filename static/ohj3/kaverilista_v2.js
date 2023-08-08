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

    // Tulosta listan loppuun
    document.querySelector("#tuloste").innerHTML += kaverit[i] + "<br>";
    i += 1;
});

// Poisto
document.querySelector("#poista").addEventListener("click", function() {
    let poistettava = document.querySelector("input[name='nimi']").value;
    let indeksi = kaverit.indexOf(poistettava);

    if (indeksi > -1) {
        kaverit.splice(indeksi, 1);
        i -= 1;
        tulosta(kaverit)
    };
});

// Järjestely
document.querySelector("#jarjesta").addEventListener("click", function() {
    kaverit.sort();
    tulosta(kaverit);
});