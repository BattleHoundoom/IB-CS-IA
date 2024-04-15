window.addEventListener('DOMContentLoaded', (event) => {
    const togglebtn = document.querySelector('.toggle-btn')
    const navbarLinks = document.getElementsByClassName('navbar-links')[0]
    togglebtn.addEventListener('click', () => {
        navbarLinks.classList.toggle('active')
    })
})