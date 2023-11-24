# Use Case -kaavion piirtäminen ja toteutus

![Äänestys-sovelluksen UML kaavio](UML.png)

## Rekisteröidy
- **Käyttäjä:** *käyttäjä (rekisteröitymätön)*
- **Tavoite:** *rekisteröityä sivuille käyttäjäksi*
- **Laukaisija:** *käyttäjän halu osallistua äänestyksiin*
- **Esiehto:** *käyttäjä ei ole kirjautunut sivuille*
- **Jälkiehto:** *käyttäjälle on luotu sivuille tunnus*
- **Käyttötapauksen kulku:** 
    1. *Käyttäjä aloittaa rekisteröitymistoiminnon*
    2. *Järjestelmä näyttää rekisteröitymislomakkeen*
    3. *Käyttäjä syöttää haluamansa käyttäjätunnuksen ja salasanan*
    4. *Järjestelmä validoi käyttäjätunnuksen ja salasanan*
    5. *Järjestelmä ilmoittaa käyttäjälle rekisteröitymisen onnistumisesta*
- **Poikkeuksellinen toiminta:**
    - 4a. *Käyttäjä ei voi valita jo järjestelmässä olemassa olevaa käyttäjätunnusta*
    - 4b. *Salasanalla on minimipituus*


## Kirjaudu
- **Käyttäjät:** *käyttäjä, ylläpitäjä*
- **Tavoite:** *kirjautua sisään sivuille*
- **Laukaisija:** *käyttäjän halu osallistua äänestyksiin, ylläpitäjän tarve luoda ja poistaa äänestyksiä*
- **Esiehto:** *käyttäjä ei ole kirjautunut sivuille*
- **Jälkiehto:** *käyttäjä on kirjautunut sivuille*
- **Käyttötapauksen kulku:** 
    1. *Käyttäjä aloittaa kirjautumistoiminnon*
    2. *Järjestelmä näyttää kirjautumislomakkeen*
    3. *Käyttäjä syöttää tunnuksen ja salasanan*
    4. *Järjestelmä tarkistaa tunnuksen ja salasanan*
    5. *Järjestelmä ilmoittaa käyttäjälle kirjautumisen onnistumisesta*
- **Poikkeuksellinen toiminta:**
    - 4a. *Tunnusta ei löydy tai salasana on väärin*


## Luo äänestys
- **Käyttäjät:** *ylläpitäjä*
- **Tavoite:** *luoda uusi äänestys*
- **Laukaisija:** *ylläpitäjän tarve*
- **Esiehto:** *ylläpitäjä on kirjautunut sivuille*
- **Jälkiehto:** *uusi äänestys on luotu*
- **Käyttötapauksen kulku:** 
    1. *Ylläpitäjä aloittaa äänetyksen luomistoiminnon*
    2. *Järjestelmä näyttää äänestyslomakkeen*
    3. *Ylläpitäjä täyttää lomakkeen*
    4. *Järjestelmä validoi lomakkeen*
    5. *Järjestelmä luo äänestyksen*
- **Poikkeuksellinen toiminta:**
    - 4a. *Samanniminen äänestys on jo olemassa*

## Äänestä
- **Käyttäjät:** *käyttäjä, ylläpitäjä*
- **Tavoite:** *äänestää äänestyksessä*
- **Laukaisija:** *käyttäjän halu*
- **Esiehto:** *käyttäjä on kirjautunut sivuille*
- **Jälkiehto:** *äänestykseen on lisätty ääni*
- **Käyttötapauksen kulku:** 
    1. *Käyttäjä valitsee äänestyksen*
    2. *Järjestelmä näyttää äänestyksen äänestysvaihtoehdot*
    3. *Käyttäjä äänestää haluamaansa vaihtoehtoa*
    4. *Järjestelmä päivittää ja näyttää äänestystulokset*
- **Poikkeuksellinen toiminta:**
    - 3a. *Jos käyttäjä ei ole kirjautunut, äänestysnapit eivät ole käytettävissä*

## Poista äänestys
- **Käyttäjät:** *ylläpitäjä*
- **Tavoite:** *poistaa äänestys*
- **Laukaisija:** *ylläpitäjän tarve*
- **Esiehto:** *käyttäjä on kirjautunut sivuille*
- **Jälkiehto:** *äänestys on poistettu*
- **Käyttötapauksen kulku:** 
    1. *Käyttäjä valitsee äänestyksen ja painaa poistonappia*
    2. *Järjestelmä varmistaa käyttäjältä halutaanko äänestys varmasti poistaa*
    3. *Järjestelmä poistaa äänestyksen*
- **Poikkeuksellinen toiminta:**
    - 1a. *Jos käyttäjällä ei ole ylläpitäjän oikeuksia, poistonappi ei ole näkyvissä.*
    - 2a. *Käyttäjä ei vahvista poistoa ja suoritus päättyy*


## Katso tilanne
- **Käyttäjät:** *käyttäjä, ylläpitäjä*
- **Tavoite:** *näyttää äänestyksen tilanteen*
- **Laukaisija:** *käyttäjän halu*
- **Esiehto:** *käyttäjä on kirjautunut sivuille*
- **Jälkiehto:** *käyttäjä näkee äänestyksen tilanteen, muttei voi enää itse äänestää*
- **Käyttötapauksen kulku:** 
    1. *Käyttäjä valitsee äänestyksen ja painaa tilanteen näyttönappia*
    2. *Järjestelmä varmistaa käyttäjältä haluaako tämä nähdä tilanteen äänestämättä*
    3. *Järjestelmä näyttää äänestystulokset*
- **Poikkeuksellinen toiminta:**
    - 1a. *Jos käyttäjällä ei ole ylläpitäjän oikeuksia, tilannenappi ei ole näkyvissä.*
    - 2a. *Käyttäjä ei vahvista poistoa ja suoritus päättyy*


