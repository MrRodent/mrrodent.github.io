document.querySelector("#tulostus").addEventListener("click", function() {
    // Luodaan ja populoidaan kaverit-array
    const kaverit = [];
    for (i = 0; i < 10; i++) {
        kaverit[i] = document.querySelector("input[name='nimi"+ i +"']").value;
    }

    // Tulostetaan näytölle
    document.querySelector("#tuloste").innerHTML = "";
    for (i = 0; i < kaverit.length; i++) {
        document.querySelector("#tuloste").innerHTML += i+1 + ". " + kaverit[i] + "<br>";
    }
});