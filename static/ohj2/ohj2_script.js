// Scripti hampurilaismenua varten

const toggleButton = document.getElementsByClassName('toggle-button')[0]
const navbarLinks = document.getElementsByClassName('navbar-links')[0]
const container = document.getElementsByClassName('container')[0]

toggleButton.addEventListener('click', () => {
    navbarLinks.classList.toggle('active')
    container.classList.toggle('active')
})