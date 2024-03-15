// utils
const getTime = () => {
    const now = new Date();
    let hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    return currentTime;
};
const getDate = () => {
    let currentDate = new Date().toLocaleString('es-PE', {
        timeZone: 'America/Lima',
        month: '2-digit',
        day: '2-digit',
        year: 'numeric',
    });
    currentDate = currentDate.split('/').reverse().join('-');
    return currentDate;
};
const showHideElementByListRadio = (listRadio, value, elementToShow) => {
    [...listRadio].map(radio => {
        radio.addEventListener('change', (e)=> {
            if(e.target.value === value) {
                elementToShow.classList.remove('hidden');
            } else {
                elementToShow.classList.add('hidden');
            }
        });
    });
};

// data backend
let ubigeoData = { }
const allUbigeosPe = () => {
    const payload = {
        allData: true
    };
    const urlBase = '/tools/search-all-ubigeos-pe/'
    fetch(urlBase, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    })
    .then(res => res.json().then(data => {
        ubigeoData = data
        const main = document.getElementById('main');
        main.classList.remove("hidden");
    }))
    .catch(console.log);
}
allUbigeosPe();


// init
fecha.value = getDate();
hora.value = getTime();
showHideElementByListRadio(listRadioSubdivion, 'si', containerNumeroLotes);
showHideElementByListRadio(listRadioCasos, 'si', containerCasos);