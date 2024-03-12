document.addEventListener('DOMContentLoaded', function() {
    let acta_id;
    let posecionarios = [];
    let posecionarioID = null;

    // boton para agregar un posecionario
    const btnAgregarPosesionario = document.querySelector('.btn-agregar-posesionario');
    const formularioPosesion = document.querySelector('#form-posesion')

    function editarPosecionario(id) {
        posecionarioID = id
        btnAgregarPosesionario.textContent = "Guardar Cambios"
        const posesionarioEditar = posecionarios.filter(e => e.id==id)[0]
        console.log(posesionarioEditar)
        llenarFormulario(posesionarioEditar);
    }

    function eliminarPosecionario(id) {
        // Confirmar si realmente se desea eliminar el posecionario
        posecionarioID = id
        if (confirm('¿Estás seguro de que deseas eliminar este posecionario?')) {
            // Realizar la solicitud al servidor para eliminar el posecionario con el ID proporcionado
            fetch(`/pos/crm/acta/posesion/delete/${id}/`, {
                method: 'POST', // Método HTTP DELETE para eliminar el recurso
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    obtenerPosecionariosDeActa(acta_id)
                    console.log('Posecionario eliminado exitosamente.');
                    posecionarioID = null
                } else {
                    console.error('Error al eliminar el posecionario:', response.statusText);
                }
            })
            .catch(error => {
                console.error('Error de red:', error);
            });
        }
    }

    function cargarActas() {
        fetch('/pos/api/actas/')
        .then(response => response.json())
        .then(actas => {
            console.log(actas)
            const inputCodigo = document.querySelector('#codigo_acta');
            const resultadosDiv = document.querySelector('.buscador-codigo ul');
            inputCodigo.addEventListener('input', function() {
                const valorInput = this.value.trim().toLowerCase();
                const actasFiltradas = filtrarActasPorCodigo(valorInput, actas);
                mostrarResultados(actasFiltradas, resultadosDiv, inputCodigo);
            });
        })
        .catch(error => {
            console.error('Error al obtener las actas:', error);
        });
    }

    function filtrarActasPorCodigo(codigo, actas) {
        return actas.filter(acta => acta.codigo_predio.toLowerCase().includes(codigo));
    }

    function mostrarResultados(actasFiltradas, resultadosDiv, inputCodigo) {
        resultadosDiv.innerHTML = '';
        if (actasFiltradas.length > 0) {
            resultadosDiv.classList.remove('d-none');
            actasFiltradas.forEach(acta => {
                const li = document.createElement('LI');
                li.addEventListener('click', () => {
                    inputCodigo.value = acta.codigo_predio;
                    resultadosDiv.classList.add('d-none');
                    acta_id = acta.id;
                    obtenerPosecionariosDeActa(acta_id);
                });
                li.textContent = `Código: ${acta.codigo_predio}`;
                li.classList.add('list-element');
                resultadosDiv.appendChild(li);
            });
        } else {
            resultadosDiv.classList.add('d-none');
        }
    }

    function llenarFormulario(posecionario) {
        document.querySelector('#apellidos').value = posecionario.apellidos;
        document.querySelector('#nombres').value = posecionario.nombres;
        document.querySelector('#estado_civil').value = posecionario.estadoCivil;
        document.querySelector('#num_doc').value = posecionario.numDoc;
        document.querySelector('#fecha_inicio').value = posecionario.fechaInicio;
        document.querySelector('#fecha_fin').value = posecionario.fechaFin;
    }

    function registrarPosecion(data) {
        let url = ''
        if(btnAgregarPosesionario.textContent.trim()=="Agregar"){
            url = '/pos/crm/acta/posesion/add'
        }else{
            url = `/pos/crm/acta/posesion/update/${posecionarioID}/`
        }

        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data.message); // Aquí puedes acceder al mensaje devuelto desde Django
            formularioPosesion.reset();
            posecionarioID = null
            btnAgregarPosesionario.textContent='Agregar'
            obtenerPosecionariosDeActa(acta_id);
        })
        .catch(error => {
            console.error('Error de red:', error);
        });
    }

    function actualizarTabla(posecionarios) {
        const tabla = document.querySelector('.table tbody');
        tabla.innerHTML = '';
        posecionarios.forEach((posecionario, index) => {
            const tr = document.createElement('tr');
            if (posecionario.id_acta) {
                tr.classList.add('table-primary');
            }
            tr.innerHTML = `
                <td>${posecionario.apellidos}</td>
                <td>${posecionario.nombres}</td>
                <td>${posecionario.estadoCivil}</td>
                <td>${posecionario.numDoc}</td>
                <td>${posecionario.aniosPosesion}</td>
                <td>
                    <button class="btn btn-success btn-sm btn-editar">Editar</button>
                    <button class="btn btn-danger btn-sm btn-eliminar">Eliminar</button>
                </td>
            `;
            tabla.appendChild(tr);

            tr.querySelector('.btn-editar').addEventListener('click', () => {
                editarPosecionario(posecionario.id);
            });

            tr.querySelector('.btn-eliminar').addEventListener('click', () => {
                eliminarPosecionario(posecionario.id);
            });
        });
    }

    function calcularDiferenciaAniosMeses(fechaInicio, fechaFin) {
        const fechaInicioObj = new Date(fechaInicio);
        const fechaFinObj = new Date(fechaFin);

        const diferenciaEnMilisegundos = fechaFinObj - fechaInicioObj;
        const milisegundosEnUnAnio = 1000 * 60 * 60 * 24 * 365.25;
        const anios = Math.floor(diferenciaEnMilisegundos / milisegundosEnUnAnio);
        const meses = Math.floor((diferenciaEnMilisegundos % milisegundosEnUnAnio) / (1000 * 60 * 60 * 24 * 30.4375));

        return [anios, meses, `${anios} años y ${meses} meses`];
    }

    function obtenerPosecionariosDeActa(actaId) {
        fetch(`/pos/crm/acta/${actaId}/posecionarios/`)
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudieron obtener los posecionarios.');
            }
            return response.json();
        })
        .then(data => {
            console.log(data)
            posecionarios = posecionarios.concat(data.posecionarios)
            actualizarTabla(data.posecionarios);
        })
        .catch(error => {
            console.error('Error al obtener los posecionarios:', error);
        });
    }

    cargarActas();

    
    btnAgregarPosesionario.addEventListener('click', function() {
        const apellidos = document.querySelector('#apellidos').value.trim();
        const nombres = document.querySelector('#nombres').value.trim();
        const estadoCivil = document.querySelector('#estado_civil').value.trim();
        const numDoc = document.querySelector('#num_doc').value.trim();
        const fechaInicio = document.querySelector('#fecha_inicio').value.trim();
        const fechaFin = document.querySelector('#fecha_fin').value.trim();
        const codigoActa = document.querySelector('#codigo_acta').value.trim()

        if (codigoActa=='') {
            alert('Ingresa un codigo de ficha de levantamiento')
            return;
        }

        if (apellidos && nombres && estadoCivil && numDoc && fechaInicio && fechaFin) {
            const nuevoPosecionario = {
                apellidos: apellidos,
                nombres: nombres,
                estadoCivil: estadoCivil,
                numDoc: numDoc,
                fechaInicio: fechaInicio,
                fechaFin: fechaFin,
            };

            const [anios, meses, diferenciaAniosMeses] = calcularDiferenciaAniosMeses(fechaInicio, fechaFin);
            nuevoPosecionario.aniosPosesion = anios;
            nuevoPosecionario.mesesPosesion = meses;
            nuevoPosecionario.diferenciaAniosMeses = diferenciaAniosMeses;

            const data = {
                posecionario: nuevoPosecionario,
                acta_id: acta_id
            };
            if(posecionarioID!=null){
                data.posecionario.id = posecionarioID
            }
            registrarPosecion(data);
        } else {
            alert('Por favor, complete todos los campos.');
        }
    });

});
