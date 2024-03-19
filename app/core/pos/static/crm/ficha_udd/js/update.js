// const utils
const getValueListRadio = (nameListRadio) => {
    const listRadio = document.getElementsByName(nameListRadio)
    const selected = Array.from(listRadio).find(element => element.checked);
    return selected.value;
};
const getValuesListCheckbox = (nameListCheckbox) => {
    const listCheckbox = document.getElementsByName(nameListCheckbox)
    const result = Array.from(listCheckbox).filter(checkbox => checkbox.checked)
                        .map(checkbox => checkbox.value);
    return result;
};

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        if (!file) {
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
        reader.readAsDataURL(file);
    });
}
const submitActa = document.getElementById('form_ficha_udd')
submitActa.addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const formDataObject = { };
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });

    formDataObject['wgs-x84-x'] = Number(formDataObject['wgs-x84-x'].replace(',', '.') || 0);
    formDataObject['wgs-x84-y'] = Number(formDataObject['wgs-x84-y'].replace(',', '.') || 0);
    formDataObject['distancia'] = Number(formDataObject['distancia'] || 0);
    formDataObject['numero-lotes'] = Number(formDataObject['numero-lotes'] || 0);
    formDataObject['numero-manzanas'] = Number(formDataObject['numero-manzanas'] || 0);
    formDataObject['porcentaje-vivencia'] = Number(formDataObject['porcentaje-vivencia'] || 0);

    if(!formDataObject['list-radio-tipo-posesion-informal']) {
        formDataObject['list-radio-tipo-posesion-informal'] = '';
    }
    if(!formDataObject['list-radio-tipo-configuracion-urbana']) {
        formDataObject['list-radio-tipo-configuracion-urbana'] = '';
    }

    if(!formDataObject['list-checkbox-equipamientos']) {
        formDataObject['list-checkbox-equipamientos'] = []
    } else {
        formDataObject['list-checkbox-equipamientos'] = getInfoCheckbox({
            nameListCheckbox: 'list-checkbox-equipamientos',
            nameListInputCantidad: 'list-input-equipamientos-cantidad',
        });
    }
    if(!formDataObject['list-checkbox-material-predominante']) {
        formDataObject['list-checkbox-material-predominante'] = []
    } else {
        formDataObject['list-checkbox-material-predominante'] = getInfoCheckbox({
            nameListCheckbox: 'list-checkbox-material-predominante',
            nameListInputCantidad: 'list-input-material-predominante-cantidad',
        });
    }
    if(!formDataObject['list-checkbox-servicios-basicos']) {
        formDataObject['list-checkbox-servicios-basicos'] = []
    } else {
        formDataObject['list-checkbox-servicios-basicos'] = getInfoCheckbox({
            nameListCheckbox: 'list-checkbox-servicios-basicos',
            nameListInputCantidad: 'list-input-servicios-basicos-cantidad',
        });
    }
    
    if(!formDataObject['list-radio-zonificacion-municipal']) {
        formDataObject['list-radio-zonificacion-municipal'] = false;
    } else {
        formDataObject['list-radio-zonificacion-municipal'] === getValueListRadio('list-radio-zonificacion-municipal') === 'si'? true: false;
    }
    if(!formDataObject['list-radio-zonas-arqueologica-o-reservas-naturales']) {
        formDataObject['list-radio-zonas-arqueologica-o-reservas-naturales'] = false;
    } else {
        formDataObject['list-radio-zonas-arqueologica-o-reservas-naturales'] = getValueListRadio('list-radio-zonas-arqueologica-o-reservas-naturales') === 'si'? true: false;
    }

    if(!formDataObject['list-radio-zonas-arqueologicas-o-reservas-naturales-ubicacion']) {
        formDataObject['list-radio-zonas-arqueologicas-o-reservas-naturales-ubicacion'] = '';
    } else {
        formDataObject['list-radio-zonas-arqueologicas-o-reservas-naturales-ubicacion'] = getValueListRadio('list-radio-zonas-arqueologicas-o-reservas-naturales-ubicacion')
    }
    formDataObject['zonas-arqueologicas-o-reservas-naturales-pdf'] = await fileToBase64(document.getElementById('zonas-arqueologicas-o-reservas-naturales-pdf').files[0]);
    //
    if(!formDataObject['list-radio-zonas-riesgo']) {
        formDataObject['list-radio-zonas-riesgo'] = false;
    } else {
        formDataObject['list-radio-zonas-riesgo'] = getValueListRadio('list-radio-zonas-riesgo') === 'si'? true: false;
    }
    if(!formDataObject['list-radio-zonas-riesgo-ubicacion']) {
        formDataObject['list-radio-zonas-riesgo-ubicacion'] = '';
    } else {
        formDataObject['list-radio-zonas-riesgo-ubicacion'] = getValueListRadio('list-radio-zonas-riesgo-ubicacion')
    }
    formDataObject['zonas-riesgo-pdf'] = await fileToBase64(document.getElementById('zonas-riesgo-pdf').files[0]);
    //
    if(!formDataObject['list-radio-conflictos-digerenciales']) {
        formDataObject['list-radio-conflictos-digerenciales'] = false;
    } else {
        formDataObject['list-radio-conflictos-digerenciales'] = getValueListRadio('list-radio-conflictos-digerenciales') === 'si'? true: false;
    }
    formDataObject['conflictos-dirigenciales-pdf'] = await fileToBase64(document.getElementById('conflictos-dirigenciales-pdf').files[0]);
    //
    if(!formDataObject['list-radio-conflictos-judiciales-o-administrativo']) {
        formDataObject['list-radio-conflictos-judiciales-o-administrativo'] = false;
    } else {
        formDataObject['list-radio-conflictos-judiciales-o-administrativo'] = getValueListRadio('list-radio-conflictos-judiciales-o-administrativo') === 'si'? true: false;
    }
    formDataObject['imagen-satelital-pdf'] = await fileToBase64(document.getElementById('imagen-satelital-pdf').files[0]);
    // console.log(formDataObject);
    // return;
    
    try {
        const response = await fetch(window.location.pathname, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formDataObject),
        });
        const data = await response.json();
        // window.location.href = "pos/crm/acta/";
        console.log('Respuesta del servidor:', data);
        await Swal.fire({
            title: "Ficha_udd actualizada exitosamente!",
            // text: "Ficha creada exitosamente!",
            icon: "success"
          })
          window.location.replace("/pos/crm/ficha_udd/")
    } catch (error) {
        console.error('Error al enviar los datos:', error);
    }
});