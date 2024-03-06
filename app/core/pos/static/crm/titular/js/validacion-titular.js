document.addEventListener('DOMContentLoaded', () => {
    const formTitular = document.getElementById('form-titular');

    formTitular.addEventListener('submit', (e) => {
        e.preventDefault();

        let apellidos = document.getElementById('apellidos').value.trim();
        let nombres = document.getElementById('nombres').value.trim();
        let dni = document.getElementById('dni').value.trim();
        let numDoc = document.getElementById('numero-doc').value.trim();
        const pdfInput = document.getElementById('pdf_documento');
        
        let isValid = true;

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
        
        // validacion para los inputs tipo radio 
        if (document.querySelector('input[name="copia_doc_identidad"]:checked') === null) {
            isValid = false;
            const copiaDocGroup = document.querySelector('.group_1');
            copiaDocGroup.querySelector('.error-radio').style.display = 'block';
        } else {
            isValid = true
            const copiaDocGroup = document.querySelector('.group_1');
            copiaDocGroup.querySelector('.error-radio').style.display = 'none';
        }
        
        if (document.querySelector('input[name="estado_civil"]:checked') === null) {
            isValid = false;
            const estadoCivilGroup = document.querySelector('.group_4');
            estadoCivilGroup.querySelector('.error-radio').style.display = 'block';
        } else {
            isValid = true
            const estadoCivilGroup = document.querySelector('.group_4');
            estadoCivilGroup.querySelector('.error-radio').style.display = 'none';
        }
        
        // if (document.querySelector('input[name="tipo_doc"]:checked') === null) {
        //     isValid = false;
        //     const tipoDocGroup = document.querySelector('.group_6');
        //     tipoDocGroup.querySelector('.error-radio').style.display = 'block';
        // } else {
        //     isValid = true
        //     const tipoDocGroup = document.querySelector('.group_6');
        //     tipoDocGroup.querySelector('.error-radio').style.display = 'none';
        // }

        // Si la validación fue exitosa, envía el formulario
        // Validación para el campo de PDF
        
        const pdfFile = pdfInput.files[0];
        if (!pdfFile || pdfFile.type !== 'application/pdf') {
            markAsInvalid('pdf_documento');
            isValid = false;
        } else {
            markAsValid('pdf_documento');
            isValid = true;
        }
        if(isValid){
            const formData = new FormData(formTitular);

            formData.append('pdf_documento', pdfInput.files[0]);
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
                        formTitular.reset();
                        document.querySelector('.btn.btn-success.btn-flat').click();
                        mostrarModal()
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
    });

    function markAsInvalid(inputId) {
        document.getElementById(inputId).classList.add('invalid');
    }

    function markAsValid(inputId) {
        document.getElementById(inputId).classList.remove('invalid');
    }
});
