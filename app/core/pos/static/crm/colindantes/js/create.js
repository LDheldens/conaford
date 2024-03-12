// const utils
const getValueListRadio = (listRadio) => {
    console.log(listRadio)
    const selected = [...listRadio].find(element => element.checked);
    return selected.value;
};
const getValuesListCheckbox = (listCheckbox) => {
    const result = Array.from(listCheckbox).filter(checkbox => checkbox.checked)
                        .map(checkbox => checkbox.value);
    return result;
};

function fileToBase64(archivo) {
    return new Promise((resolve, reject) => {
        if (!archivo) {
            resolve('');
        }
        const reader = new FileReader();
        reader.onload = function (event) {
            const base64Content = event.target.result.split(',')[1];
            resolve(base64Content);
        };
        reader.onerror = function (error) {
            reject(error);
        };
        reader.readAsDataURL(archivo);
    });
}

form_ficha_levantamiento.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formDataObject = { };
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
    if(!formDataObject['list-radio-descripcion-fisica-predio']) {
        formDataObject['list-radio-descripcion-fisica-predio'] = '';
    }
    if(!formDataObject['list-radio-uso']) {
        formDataObject['list-radio-uso'] = '';
    }
    if(formDataObject['list-checkbox-serv-bas']) {
        formDataObject['list-checkbox-serv-bas'] = getValuesListCheckbox(listCheckboxServBas);
    } else {
        formDataObject['list-checkbox-serv-bas'] = [ ];
    }
    titulares = getRowsTitulares();
    console.log(formDataObject);
    console.log(titulares);
});