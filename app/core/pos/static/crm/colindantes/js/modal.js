const btnAgregarColindantes = document.getElementById('btn-agregar-colindantes');
const colindatesContainer = document.getElementById('colindantes-container');

const selectorsModal = {
    btnSearchDni: null,
    dniTosearch: null,
    dni: null,
    apellidos: null,
    nombres: null,
    docPdf: null,
    docPdfValue: null,
};

//utils
function capitalize(str) {
    return str.replace(/\b\w/g, function(l) {
        return l.toUpperCase();
    }).replace(/\B\w+/g, function(l) {
        return l.toLowerCase();
    });
}


const deleteRow = (no) => {
    const row = colindatesContainer.querySelector(`#row${ no }`);
    const btnDeleteRow = colindatesContainer.querySelector(`#delete${ no }`);
    const btnEditRow = colindatesContainer.querySelector(`#edit${ no }`);
    btnDeleteRow.removeEventListener('click', () => deleteRow(no));
    btnEditRow.removeEventListener('click', () => editRow(no));
    row.outerHTML = '';
};

const editRow = (no) => {
    console.log({no})
    // get values td
    const row = colindatesContainer.querySelector(`#row${ no }`).querySelectorAll('td')

    let data = {
        frente: row[0],
        fondo: row[1],
        izquierda: row[2],
        derecha: row[3],
    };
    const newData = Object.keys(data).reduce((prev, next) => {
        prev[next] = data[next].innerText.trim();
        return prev;
    }, { });
    // make modal
    const html = getHtmlModal({
        isAdd: false,
        data: newData,
    });
    makeModal(html).then(({ isConfirmed, value = { } }) => {
        if(isConfirmed) {
            data.frente.innerText = value.frente;
            data.fondo.innerText = value.fondo;
            data.izquierda.innerText = value.izquierda;
            data.derecha.innerText = value.derecha;
        } else {
            console.log('cancell!');
        }
    });
};

const addRow = (data) => {
    const {
        frente = '',
        fondo = '',
        izquierda = '',
        derecha = '',
    } = data || { };
    const no = colindatesContainer.childElementCount;
    const row = 
    /*html*/
`
<tr class="odd:bg-white even:bg-gray-50 border-b" id="row${ no }">
    <td class="px-6 py-4 text-justify">
        ${ frente }
    </td>
    <td class="px-6 py-4 text-justify">
        ${ fondo }
    </td>
    <td class="px-6 py-4 text-justify">
        ${ izquierda }
    </td>
    <td class="px-6 py-4 text-justify">
        ${ derecha }
    </td>
    <td class="px-6 py-4">
        <div class="flex gap-2">
            <button id="edit${no}" class="mb-2 bg-[#003c8b] font-gotham-bold p-2 rounded text-white hover:bg-[#355887]">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button id="delete${no}"
                class="mb-2 bg-[#8b0031] font-gotham-bold p-2 rounded text-white hover:bg-[#6d3b4c]">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    </td>
</tr>
`;
    colindatesContainer.insertAdjacentHTML('beforeend', row);
    const btnDeleteRow = colindatesContainer.querySelector(`#delete${no}`);
    const btnEditRow = colindatesContainer.querySelector(`#edit${no}`);
    btnDeleteRow.addEventListener('click', () => deleteRow(no));
    btnEditRow.addEventListener('click', () => editRow(no));
};

// const getRowsTitulares = () => {
//     const rows = titularesContainer.querySelectorAll('tr');
//     const titulares = [...rows].map(row => {
//         const td = row.querySelectorAll('td');
//         const result = ({
//             apellidos: td[0].innerText.trim(),
//             nombres: td[1].innerText.trim(),
//             dni: td[2].innerText.trim(),
//             estadoCivil: td[3].innerText.trim(),
//             copiaDoc: td[4].innerText.trim(),
//             documentos: td[5].innerText.trim(),
//             observaciones: td[6].innerText.trim()
//         });
//         return result;
//     });
//     return titulares;
// };

const getRowsRepresentantes = () => {
    return true;
};

function getHtmlModal (options) {
    const {
        isAdd,
        data,
    } = options;
    let title = '';

    if(isAdd) {
        title = 'AÑADIR COLINDANTE';
    } else {
        title = 'EDITAR COLINDANTE';
    }

    const {
        frente = '',
        fondo = '',
        izquierda = '',
        derecha = '',
    } = data || { };

    const html =
    /*html*/
`
<div class="p-2">
    <h2 class="font-bold font-gotham-bold mb-2">${ title }</h2>
    <div class="flex flex-col items-start gap-1">
        <label for="frente"
            class="text-sm font-medium text-gray-700 asterisk-icon font-gotham-bold">Frente</label>
        <input value="${ frente }" type="text" id="frente" name="frente"
            class="text-sm w-full p-2 text-gray-700 border-2 border-black shadow-sm focus:outline-none focus:border-[#A7CF42] focus:ring focus:ring-[#D8E3C2] hover:border-[#A7CF42]"
            placeholder="Frente">

        <label for="fondo" class="text-sm font-medium text-gray-700 asterisk-icon font-gotham-bold">Fondo</label>
        <input value="${ fondo }" type="text" id="fondo" name="fondo"
            class="text-sm w-full p-2 text-gray-700 border-2 border-black shadow-sm focus:outline-none focus:border-[#A7CF42] focus:ring focus:ring-[#D8E3C2] hover:border-[#A7CF42]"
            placeholder="Fondo">

        <label for="izquierda" class="text-sm font-medium text-gray-700 asterisk-icon font-gotham-bold">Izquierda</label>
        <input value="${ izquierda }" type="text" id="izquierda" name="izquierda"
            class="text-sm w-full p-2 text-gray-700 border-2 border-black shadow-sm focus:outline-none focus:border-[#A7CF42] focus:ring focus:ring-[#D8E3C2] hover:border-[#A7CF42]"
            placeholder="Izquierda">

        <label for="derecha" class="text-sm font-medium text-gray-700 asterisk-icon font-gotham-bold">Derecha</label>
        <input value="${ derecha }" type="text" id="derecha" name="derecha"
            class="text-sm w-full p-2 text-gray-700 border-2 border-black shadow-sm focus:outline-none focus:border-[#A7CF42] focus:ring focus:ring-[#D8E3C2] hover:border-[#A7CF42]"
            placeholder="Derecha">
    </div>
</div>
`;
return html;
};

const handleModal = () => {
    const html = getHtmlModal({
        isAdd: true
    });
    makeModal(html).then(( { isConfirmed, value = { } } ) => {
        if(isConfirmed) {
            addRow(value);
        } else {
            console.log('cancell!');
        }
    });
    return;
};

function makeModal(html) {
    return Swal.fire({
        // title:
        // /*html*/`
        // <div><h2>HELLO</h2></div>
        // `,
        scrollbarPadding: false,
        padding: '0',
        margin: '0',
        html,
        background: '#EAEBEB',
        confirmButtonText: 'Guardar',
        focusConfirm: false,
        allowOutsideClick: false,
        cancelButtonText: 'Cancelar',
        showCancelButton: true,
        didOpen: () => {
            const popup = Swal.getPopup();

            // const frente = popup.querySelector('#frente');
            // const fondo = popup.querySelector('#fondo');
            // const izquierda = popup.querySelector('#izquierda');
            // const derecha = popup.querySelector('#derecha');

            // selectorsModal.btnSearchDni.addEventListener('click', handleSearchDni);
        },
        preConfirm: () => {
            const popup = Swal.getPopup();
            const result = {
                frente: popup.querySelector('#frente').value.trim(),
                fondo: popup.querySelector('#fondo').value.trim(),
                izquierda: popup.querySelector('#izquierda').value.trim(),
                derecha: popup.querySelector('#derecha').value.trim(),
            };
            return result;
        },
        willClose: () => {
            // selectorsModal.btnSearchDni.removeEventListener('click', handleSearchDni);
        },
    });
};

btnAgregarColindantes.addEventListener('click', () => {
    handleModal();
});