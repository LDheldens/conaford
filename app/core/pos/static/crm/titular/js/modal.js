// muestra imagen previa del titular
function previewImage(input, previewId) {
    const preview = document.getElementById(previewId);
    const file = input.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        preview.src = e.target.result;
        preview.classList.remove('img-none'); // Mostrar la imagen previa
    };

    if (file) {
        reader.readAsDataURL(file);
    }
}

let contenedorModal;
let modal;
let btnCloseModal;
let form_titular
let actaId;
let tableTitulares;

document.addEventListener('DOMContentLoaded',()=>{
    contenedorModal = document.querySelector('#contenedor-modal')
    modal = document.querySelector('#modal')
    btnCloseModal = document.querySelector('.btn-close-modal')

    btnCloseModal.addEventListener('click',cerrarModal)
    tableTitulares = document.querySelector('#table-titulares')
    form_titular = document.querySelector('#form-titular')

    form_titular.addEventListener('submit',(e)=>{
        e.preventDefault()
  

        let apellidos = document.getElementById('apellidos').value.trim();
        let nombres = document.getElementById('nombres').value.trim();
        let dni = document.getElementById('dni').value.trim();
        let numDoc = document.getElementById('numero-doc').value.trim();
        let firma = document.getElementById('firma').value.trim();
        let huella = document.getElementById('huella').value.trim();
        
        // Realiza la validación
        var isValid = true;
        
        // Validación de los campos obligatorios
        if (apellidos === '') {
            markAsInvalid('apellidos');
            isValid = false;
        } else {
            markAsValid('apellidos');
            isValid=true
        }
        
        if (nombres === '') {
            markAsInvalid('nombres');
            isValid = false;
        } else {
            markAsValid('nombres');
            isValid=true
        }
        
        if (dni === '') {
            markAsInvalid('dni');
            isValid = false;
        } else {
            markAsValid('dni');
            isValid=true
        }
        
        if (numDoc === '') {
            markAsInvalid('numero-doc');
            isValid = false;
        } else {
            markAsValid('numero-doc');
            isValid=true
        }
        
        if (document.querySelector('input[name="copia_doc_identidad"]:checked') === null) {
            isValid = false;
            // Puedes añadir tu lógica para marcar visualmente el campo de radio aquí
        }
        
        if (document.querySelector('input[name="estado_civil"]:checked') === null) {
            isValid = false;
        }
        
        if (document.querySelector('input[name="tipo_doc"]:checked') === null) {
            isValid = false;
        }
        
        if (firma === '') {
            markAsInvalid('firma');
            isValid = false;
        } else {
            markAsValid('firma');
            isValid=true
        }
        
        if (huella === '') {
            markAsInvalid('huella');
            isValid = false;
        } else {
            markAsValid('huella');
            isValid=true
        }
        
        // Si la validación fue exitosa, envía el formulario
        if(isValid){
            const formData = new FormData(form_titular);
            const firmaInput = document.getElementById('firma');
            const huellaInput = document.getElementById('huella');

            formData.append('img_firma', firmaInput.files[0]);
            formData.append('img_huella', huellaInput.files[0]);
            formData.append('acta_id', actaId); 
            // Configurar opciones para la solicitud Fetch
            const options = {
                method: 'POST',
                body: formData,
            };

            // Realizar la solicitud Fetch
            fetch('/pos/crm/titular/add/', options)
                .then(response => {
                    if (response.ok) {
                        // Si la respuesta es exitosa, mostrar mensaje de éxito
                        console.log('Titular creado correctamente');
                        form_titular.reset()
                        document.querySelector('.btn.btn-success.btn-flat').click();
                        // Aquí puedes agregar lógica adicional, como cerrar el modal, actualizar la página, etc.
                    } else {
                        // Si la respuesta no es exitosa, mostrar mensaje de error
                        console.error('Error al crear titular');
                        // Aquí puedes manejar errores de forma adecuada
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    // Manejar errores de red u otros errores
                });
        }
    })
})
function markAsInvalid(inputId) {
    document.getElementById(inputId).classList.add('invalid');
}

// Marcar un campo como válido
function markAsValid(inputId) {
    document.getElementById(inputId).classList.remove('invalid');
}
function mostrarModal(){
    contenedorModal.style.display="flex"    
}

function cerrarModal(){
    contenedorModal.style.display="none"
    form_titular.reset()

}
function agregarTitular(id){
    form_titular.style.display = 'block'
    tableTitulares.style.display = 'none'
    actaId = id
    console.log(actaId)
    mostrarModal()
}

function mostrarTitulares(id){
    console.log(id,'mostrar titulares xd')
    form_titular.style.display = 'none'
    tableTitulares.style.display = 'block'
    mostrarModal()
    obtenerTitularesActa(id)
}

function obtenerTitularesActa(actaId){
    fetch(`/pos/crm/acta/${actaId}/titulares`)
        .then(response => response.json())
        .then(data => {
            insertarHtmlTitulares(data.titulares)
    })
    .catch(error => console.error('Error al obtener los titulares:', error));
}

function insertarHtmlTitulares(titulares) {
    console.log(titulares)
    const tbody = tableTitulares.querySelector('tbody')

    tbody.innerHTML = '';

    if(titulares.length > 0){
        
        titulares.forEach(titular => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${titular.nombres}</td>
                <td>${titular.apellidos}</td>
                <td>${titular.estado_civil}</td>
                <td>${titular.num_doc}</td>
            `;
            tbody.appendChild(tr);
        });
    }else{
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td colspan="4" style="text-align:center">Este acta no cuenta con titulares</td>
        `;
        tbody.appendChild(tr);
    }
}