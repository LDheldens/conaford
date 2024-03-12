// navbar
const btnDropdownNavbarLink = document.getElementById('dropdownNavbarLink');
const dropdownNavbar = document.getElementById('dropdownNavbar');
btnDropdownNavbarLink.addEventListener('click', () => {
    dropdownNavbar.classList.toggle('hidden');
});
document.addEventListener('click', event => {
    if (!dropdownNavbar.contains(event.target) && event.target !== btnDropdownNavbarLink) {
        dropdownNavbar.classList.add('hidden');
    }
});