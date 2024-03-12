document.addEventListener('DOMContentLoaded', function() {
    // Array para almacenar los posecionarios
    let posecionarios = [];

    fetch('/pos/api/actas/')
    .then(response => response.json())
    .then(actas => {
        // Almacena las actas sin filtrar
        let actasSinFiltrar = actas;
        
        // Función para filtrar las actas por el campo 'codigo_predio'
        function filtrarActasPorCodigo(codigo) {
            codigo = codigo.toLowerCase(); // Convertir el código de búsqueda a minúsculas
            return actasSinFiltrar.filter(acta => acta.codigo_predio.toLowerCase().includes(codigo));
        }
        // Event listener para el input de búsqueda
        const inputCodigo = document.querySelector('#codigo_acta');
        const resultadosDiv = document.querySelector('.form-group .position-absolute.d-none');
        inputCodigo.addEventListener('input', function() {
            const valorInput = this.value.trim().toLowerCase(); // Convertir el valor del input a minúsculas
            let actasFiltradas;
            if (valorInput === '') {
                resultadosDiv.classList.add('d-none');
            } else {
                actasFiltradas = filtrarActasPorCodigo(valorInput);
            }
            resultadosDiv.innerHTML = ''; // Limpiar el contenido actual del div de resultados
            if (actasFiltradas && actasFiltradas.length > 0) {
                resultadosDiv.classList.remove('d-none');
                actasFiltradas.forEach(acta => {
                    const li = document.createElement('LI');
                    li.addEventListener('click', () => {
                        inputCodigo.value = acta.codigo_predio;
                        resultadosDiv.classList.add('d-none');
                    });
                    li.textContent = `Código: ${acta.codigo_predio}`;
                    li.classList.add('list-element');
                    resultadosDiv.appendChild(li);
                });
            } else {
                resultadosDiv.classList.add('d-none');
            }
        });
               // Event listener para el botón "Agregar posesionario"
        const btnMostrarFormulario = document.querySelector('.btn-mostrar-formulario ');
        btnMostrarFormulario.addEventListener('click', function() {
            const formPosesion = document.querySelector('#form-posesion');
            formPosesion.classList.toggle('d-none');
        });

        // Event listener para el botón "Agregar posesionario"
        const btnAgregarPosesionario = document.querySelector('.btn-agregar-posesionario');
        btnAgregarPosesionario.addEventListener('click', function() {
            // Validar los datos del formulario
            const apellidos = document.querySelector('#apellidos').value.trim();
            const nombres = document.querySelector('#nombres').value.trim();
            const estadoCivil = document.querySelector('#estado_civil').value.trim();
            const numDoc = document.querySelector('#num_doc').value.trim();
            const fechaInicio = document.querySelector('#fecha_inicio').value.trim();
            const fechaFin = document.querySelector('#fecha_fin').value.trim();

            // Validación básica (aquí deberías implementar tu propia lógica de validación)
            if (apellidos && nombres && estadoCivil && numDoc && fechaInicio && fechaFin) {
                // Crear un nuevo posecionario y agregarlo al array
                const nuevoPosecionario = {
                    apellidos: apellidos,
                    nombres: nombres,
                    estadoCivil: estadoCivil,
                    numDoc: numDoc,
                    fechaInicio: fechaInicio,
                    fechaFin: fechaFin,
                    // Calcular la diferencia de años y meses
                    diferenciaAniosMeses: calcularDiferenciaAniosMeses(fechaInicio, fechaFin)
                };
                posecionarios.push(nuevoPosecionario);

                // Actualizar la tabla HTML
                actualizarTabla();
            } else {
                alert('Por favor, complete todos los campos.');
            }
        });

        // Función para actualizar la tabla HTML con los datos de los posecionarios
        function actualizarTabla() {
            const tabla = document.querySelector('.table tbody');
            const tablaFooter = document.querySelector('.table-footer');
            tabla.innerHTML = ''; // Limpiar la tabla
        
            let totalAnios = 0;
            let totalMeses = 0;
        
            // Iterar sobre el array de posecionarios y crear las filas de la tabla
            posecionarios.forEach((posecionario, index) => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${posecionario.apellidos}</td>
                    <td>${posecionario.nombres}</td>
                    <td>${posecionario.estadoCivil}</td>
                    <td>${posecionario.numDoc}</td>
                    <td>${posecionario.diferenciaAniosMeses}</td>
                `;
                tabla.appendChild(tr);
        
                // Calcular la diferencia en años y meses para este posecionario
                const diferencia = calcularDiferenciaAniosMeses(posecionario.fechaInicio, posecionario.fechaFin);
                const [anios, meses] = diferencia.split(' ');
                totalAnios += parseInt(anios);
                totalMeses += parseInt(meses);
            });
        
            // Convertir los meses adicionales a años si es mayor o igual a 12
            totalAnios += Math.floor(totalMeses / 12);
            totalMeses = totalMeses % 12;
        
            tablaFooter.innerHTML = `
                <tr>
                    <th colspan="4">Total acumulado</th>
                    <th>${totalAnios} años y ${totalMeses} meses</th>
                </tr>
            `;
        } 
        
    })
    .catch(error => {
        console.error('Error al obtener las actas:', error);
    });

    // Función para calcular la diferencia en años y meses entre dos fechas
    function calcularDiferenciaAniosMeses(fechaInicio, fechaFin) {
        const fechaInicioObj = new Date(fechaInicio);
        const fechaFinObj = new Date(fechaFin);

        const diferenciaEnMilisegundos = fechaFinObj - fechaInicioObj;
        const milisegundosEnUnAnio = 1000 * 60 * 60 * 24 * 365.25;
        const anios = Math.floor(diferenciaEnMilisegundos / milisegundosEnUnAnio);
        const meses = Math.floor((diferenciaEnMilisegundos % milisegundosEnUnAnio) / (1000 * 60 * 60 * 24 * 30.4375));

        return `${anios} años y ${meses} meses`;
    }
});
