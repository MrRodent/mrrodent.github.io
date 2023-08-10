function syotteenTarkistus(syote) {
    if (syote == '') {
        document.querySelector('#syottovirhe').innerHTML = 'Syötä ensin lämpötila';
        return false;
    }
    else if (isNaN(syote)) {
        document.querySelector('#syottovirhe').innerHTML = 'Syötä vain numeroita';
        return false;
    }
    else {
        document.querySelector('#syottovirhe').innerHTML = '';
        return true;
    };
};

function absoluuttinenNolla() {
    document.querySelector('#tuloste').innerHTML = "\uD83E\uDD76";
    document.querySelector('#syottovirhe').innerHTML = 'Kylmempi kuin absoluuttinen nollapiste <br>(-273.15 °C)';
};

// Muuntonapin toiminta
document.querySelector('#muuntonappi').addEventListener('click', () => {
    const suunta = document.querySelector('#muuntosuunta').value;
    const syote = document.querySelector('#syote').value.replace(',', '.');
    const desimaali = parseInt(document.querySelector('input[name="desimaalit"]:checked').id);
    const tarkistus = syotteenTarkistus(syote);
    
    if (tarkistus) {
        if (suunta == 'celfah') {
            const muunnos = (syote * 9/5 + 32);
            if (syote < -273.15) {
                absoluuttinenNolla();
            }
            else {
                document.querySelector('#tuloste').innerHTML = `${muunnos.toFixed(desimaali)} °F`;
            };
        }
        else if (suunta == 'fahcel') {
            const muunnos = ((syote - 32) * 5/9);
            if (syote < -459.67) {
                absoluuttinenNolla();
            }
            else {
                document.querySelector('#tuloste').innerHTML = `${muunnos.toFixed(desimaali)} °C`;
            };
        };
    };
});