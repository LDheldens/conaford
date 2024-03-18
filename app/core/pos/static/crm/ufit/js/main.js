let acta_id = null;
document.addEventListener('DOMContentLoaded', function() {


    function cargarActas() {
        fetch('/pos/api/actas/')
        .then(response => response.json())
        .then(actas => {
            console.log(actas)
            const inputCodigo = document.querySelector('#codigo_acta');
            const resultadosDiv = document.querySelector('.buscador-codigo');
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
            resultadosDiv.classList.remove('hidden');
            actasFiltradas.forEach(acta => {
                const li = document.createElement('LI');
                li.addEventListener('click', () => {
                    inputCodigo.value = acta.codigo_predio;
                    resultadosDiv.classList.add('hidden');
                    acta_id = acta.id;
                });
                li.textContent = `Código: ${acta.codigo_predio}`;
                li.classList.add('cursor-pointer','hover:bg-slate-500','hover:text-white','p-1','rounded');
                resultadosDiv.appendChild(li);
            });
        } else {
            resultadosDiv.classList.add('hidden');
        }
    }

    cargarActas();
});


const btnAgregarColindante = document.getElementById("btn-agregar-colindantes");
const modalUfit = document.querySelector('.modal-ufit')
const btnModal = document.querySelector('.btn-cerrar-modal')
const contenedorTramos = document.querySelector('#contenedor-inputs');
const btnAgregarColindancia = document.querySelector('#btn-agregar-colindancia')

// Agregar un event listener para el clic en el botón
btnAgregarColindante.addEventListener("click", function() {
    
    modalUfit.classList.toggle('flex')
    modalUfit.classList.toggle('hidden')
});
btnModal.addEventListener('click',(e)=>{
    modalUfit.classList.toggle('flex')
    modalUfit.classList.toggle('hidden')
})

// Agregar un event listener al contenedor principal
contenedorTramos.addEventListener('click', (e) => {
    // Verificar si el clic ocurrió en un botón "Aceptar"
    if (e.target.classList.contains('btn-aceptar')) {
        const contenedor = e.target.closest('.contenedor-lado'); // Obtener el contenedor de tramos
        const labelPrincipal = contenedor.querySelector('label').getAttribute('for');
        const cantidadTramos = contenedor.querySelector('.input-cantidad').value;
        const divContenedor = document.createElement('DIV');
        divContenedor.classList.add('flex', 'gap-1', 'flex-wrap');

        // Eliminar los hijos generados dinámicamente (campos de tramos)
        const tramosGenerados = contenedor.querySelectorAll('.tramo-generado');
        tramosGenerados.forEach(tramo => tramo.remove());

        // Crear y agregar los nuevos elementos
        for (let index = 1; index <= cantidadTramos; index++) {
            const divHijo = document.createElement('DIV');
            divHijo.classList.add('tramo-generado','max-w-[100px]'); // Agregar clase para identificar los tramos generados
            if (cantidadTramos>=5) {
                divHijo.style.margin = '0 auto'
            }
            divHijo.innerHTML = `
                <label 
                    class="text-sm font-medium text-gray-700 asterisk-icon font-gotham-bold" for="tramo-${index}"
                >
                    Tramo ${index}:
                </label>
                <input 
                    type="number"
                    class="text-sm ${labelPrincipal} w-full p-2 text-gray-700 border-2 border-black shadow-sm focus:outline-none focus:border-[#A7CF42] focus:ring focus:ring-[#D8E3C2] hover:border-[#A7CF42]" type="text" id="tramo-${index}" name="tramo-${index}"
                >
            `;
            divContenedor.appendChild(divHijo); // Agregar el div hijo al contenedor principal
        }
        // Agregar el contenedor de tramos al DOM, por ejemplo, antes de los botones
        contenedor.appendChild(divContenedor);
    }
});



let data;
btnAgregarColindancia.addEventListener('click',(e)=>{
    if (acta_id==null) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ingrese un código de predio',
        });
        return;
    }
    e.preventDefault()
    const inputFrente = document.getElementById('frente');
    const inputCantidadTramos1 = document.getElementById('cantidad-tramos1');
    const inputDerecha = document.getElementById('derecha');
    const inputCantidadTramos2 = document.getElementById('cantidad-tramos2');
    const inputIzquierda = document.getElementById('izquierda');
    const inputCantidadTramos3 = document.getElementById('cantidad-tramos3');
    const inputFondo = document.getElementById('fondo');
    const inputCantidadTramos4 = document.getElementById('cantidad-tramos4');
    data = {
        frente:{
            descripcion: inputFrente.value,
            cantidad_tramos:inputCantidadTramos1.value,
            tramos:{}
        },
        derecha:{
            descripcion: inputDerecha.value,
            cantidad_tramos:inputCantidadTramos2.value,
            tramos:{}
        },
        izquierda:{
            descripcion: inputIzquierda.value,
            cantidad_tramos:inputCantidadTramos3.value,
            tramos:{}
        },
        fondo:{
            descripcion: inputFondo.value,
            cantidad_tramos:inputCantidadTramos4.value,
            tramos:{}
        }
    }
    const tramosFrente = document.querySelectorAll('.frente')
    data.frente.tramos = {}; // Inicializar el objeto de tramos
    tramosFrente.forEach((tramo, i) => {
        data.frente.tramos[`tramo${i + 1}`] = parseInt(tramo.value);
    });
    const tramosDerecha = document.querySelectorAll('.derecha')
    data.derecha.tramos = {}; // Inicializar el objeto de tramos
    tramosDerecha.forEach((tramo, i) => {
        data.derecha.tramos[`tramo${i + 1}`] = parseInt(tramo.value);
    });
    const tramosIzquierda = document.querySelectorAll('.izquierda')
    data.izquierda.tramos = {}; // Inicializar el objeto de tramos
    tramosIzquierda.forEach((tramo, i) => {
        data.izquierda.tramos[`tramo${i + 1}`] = parseInt(tramo.value);
    });
    const tramosFondo = document.querySelectorAll('.fondo')
    data.fondo.tramos = {}; // Inicializar el objeto de tramos
    tramosFondo.forEach((tramo, i) => {
        data.fondo.tramos[`tramo${i + 1}`] = parseInt(tramo.value);
    });

    let acum1 = 0;
    for (let key in data.frente.tramos) {
      acum1 += parseInt(data.frente.tramos[key]) ;
    }
    data.frente.distancia = acum1

    let acum2 = 0;
    for (let key in data.derecha.tramos) {
      acum2 += parseInt(data.derecha.tramos[key]) ;
    }
    data.derecha.distancia = acum2

    let acum3 = 0;
    for (let key in data.izquierda.tramos) {
      acum3 += parseInt(data.izquierda.tramos[key]) ;
    }
    data.izquierda.distancia = acum3

    let acum4 = 0;
    for (let key in data.fondo.tramos) {
      acum4 += parseInt(data.fondo.tramos[key]) ;
    }
    data.fondo.distancia = acum4

    document.querySelector('#perimetro-levantamiento').value = acum1+acum2+acum3+acum4

    const tableBody = document.getElementById('colindantes-container');
    tableBody.innerHTML = ''
    const newRow = document.createElement('tr');

    newRow.innerHTML = `
        <td>${data.frente.descripcion}</td>
        <td>${acum1} Ml</td>
        <td>${data.fondo.descripcion}</td>
        <td>${acum2} Ml</td>
        <td>${data.izquierda.descripcion}</td>
        <td>${acum3} Ml</td>
        <td>${data.derecha.descripcion}</td>
        <td>${acum4} Ml</td>
    `;
    tableBody.appendChild(newRow);
});

const registrarUfit = document.querySelector('.registrar-uffit')
const inputNumeroLote = document.getElementById('numero-lote');
const inputNumeroManzana = document.getElementById('numero-manzana');
const areaSegunL= document.querySelector('#area-levantamiento')
const perimetroSegunL = document.querySelector('#perimetro-levantamiento')

registrarUfit.addEventListener('click',()=>{
    if (acta_id==null) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ingrese un código de predio',
        });
        return;
    }
    const formData = new FormData(document.querySelector('#form-ufit')) 

    let campoVacio = false;

    for (const value of formData.values()) {
        if (!value.trim()) { // Comprueba si el valor está vacío o solo contiene espacios en blanco
            campoVacio = true;
            break;
        }
    }
    if (campoVacio || inputNumeroLote.value =='' || inputNumeroManzana.value =='' || areaSegunL.value=='' || perimetroSegunL.value=='') {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Por favor, complete todos los campos del formulario',
        });
        return;
    }
    data.area = parseInt(areaSegunL.value)
    data.perimetro = parseInt(perimetroSegunL.value) 
    data.numeroManzana = inputNumeroManzana.value
    data.numeroLote = inputNumeroLote.value

    const dataCompleta = {
        data,
        acta_id,
    }
    console.log(dataCompleta)
    fetch('/pos/crm/ufit/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataCompleta)
    })
    .then(response => {
        if (response.ok) {
            // Manejar la respuesta exitosa del servidor
            // Por ejemplo, mostrar un mensaje de éxito al usuario
            Swal.fire({
                icon: 'success',
                title: 'Éxito',
                text: 'Los datos se han enviado correctamente',
            });
        } else {
            // Manejar errores de respuesta del servidor
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un problema al enviar los datos',
            });
        }
    })
    .catch(error => {
        // Manejar errores de red u otros errores
        console.error('Error al enviar los datos:', error);
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al enviar los datos',
        });
    });
})


inputNumeroManzana.addEventListener('input', function() {
    const regex = /^[A-Z]\d{0,2}$/;
    const valor = this.value.trim();
    const contenedor = inputNumeroManzana.parentElement;
    const P = contenedor.querySelector('p');

    if (regex.test(valor)) {
        P.textContent =  "";
        P.classList.remove('text-red-500'); // Elimina el color rojo del texto si estaba Presente
        P.classList.add('text-green-500'); // Agrega el color verde al texto
        P.textContent = 'Formato válido.';
    } else {
        P.classList.remove('text-green-500'); // Elimina el color verde del texto si estaba presente
        P.classList.add('text-red-500'); // Agrega el color rojo al texto
        P.textContent = 'El número de manzana no cumple con el formato especificado.';
    }

});


inputNumeroLote.addEventListener('input', function() {
    const regex = /^\d{1,3}[A-Z]?$/;
    const valor = this.value.trim();
    const contenedor = inputNumeroLote.parentElement;
    const parrafo = contenedor.querySelector('p');

    if (regex.test(valor)) {
        parrafo.textContent =  "";
        parrafo.classList.remove('text-red-500'); // Elimina el color rojo del texto si estaba presente
        parrafo.classList.add('text-green-500'); // Agrega el color verde al texto
        parrafo.textContent = 'Formato válido.';
    } else {
        parrafo.classList.remove('text-green-500'); // Elimina el color verde del texto si estaba presente
        parrafo.classList.add('text-red-500'); // Agrega el color rojo al texto
        parrafo.textContent = 'El número de lote no cumple con el formato especificado.';
    }
});

