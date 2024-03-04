// start
const fecha = document.getElementById('fecha');
const celWssp = document.getElementById('cel-wssp');
// 1.- DATOS DE LA POSESIÓN INFORMAL
const departamento = document.getElementById('departamento');
const provincia = document.getElementById('provincia');
const distrito = document.getElementById('distrito');
const posesionInformal = document.getElementById('posesion-informal');
const sector = document.getElementById('sector');
// 2.- IDENTIFICACIÓN DEL PREDIO
const etapa = document.getElementById('etapa');
const direccionFiscalReferencia = document.getElementById('direccion-fiscal-referencia');
const listRadioDescripcionFisicaPredio = document.getElementsByName('list-radio-descripcion-fisica-predio');
const listRadioUso = document.getElementsByName('list-radio-uso');
const listCheckboxServBas = document.getElementsByName('list-checkbox-serv-bas');
// 3.- DATOS DE(LOS) TITULAR(ES)/REPRESENTANTE(S)
const listRadioCartaPoder = document.getElementsByName('list-radio-carta-poder');
// 4.- BOCETO DEL PREDIO
const bocetoDelPredio = document.getElementById('boceto-predio');
const nombresApellidosColindanciaFrente = document.getElementById('nombres-apellidos-colindancia-frente');
const distanciaFrente = document.getElementById('distancia-frente');
const nombresApellidosColindanciaFondo = document.getElementById('nombres-apellidos-colindancia-fondo');
const distanciaFondo = document.getElementById('distancia-fondo');
const nombresApellidosColindanciaDerecha = document.getElementById('nombres-apellidos-colindancia-derecha');
const distanciaDerecha = document.getElementById('distancia-derecha');
const nombresApellidosColindanciaIzquierda = document.getElementById('nombres-apellidos-colindancia-izquierda');
const distanciaIzquierda = document.getElementById('distancia-izquierda');
const listRadioHitosConsolidado = document.getElementsByName('list-radio-hitos-consolidado');
const listRadioAccesoVia = document.getElementsByName('list-radio-acceso-via');
const numeroLotes = document.getElementById('numero-lotes');
const listRadioSubdivion = document.getElementsByName('list-radio-subdivion');
const listRadioAlineamiento = document.getElementsByName('list-radio-alineamiento');
const listRadioAperturaVia = document.getElementsByName('list-radio-apertura-via');
const listRadioLibreRiesgo = document.getElementsByName('list-radio-libre-riesgo');
const listRadioTransfTitular = document.getElementsByName('list-radio-transf-titular');
const listRadioLitigioDenunciaEtc = document.getElementsByName('list-radio-litigio-denuncia-etc');
const areaSegunTitularRepresentante = document.getElementById('area-segun-titular-representante');
const comentarioAdic = document.getElementById('comentario-adic');
// 5.- DEL LEVANTAMIENTO TOPOGRÁFICO:
const codigo = document.getElementById('codigo');
const hora = document.getElementById('hora');
const numeroPuntos = document.getElementById('numero-puntos');
const operador = document.getElementById('operador');
const equipoTp = document.getElementById('equipo-tp');
const listRadioTiempoAtmosferico = document.getElementsByName('list-radio-tiempo-atmosferico')
const comentarioObservaciones = document.getElementById('comentario-observaciones')
// 6.- DE LOS TITULAR(ES) O REPRESENTATE(S)
const deTitularesRepresentantes = document.getElementById('de-titulares-representantes')
const deAutoridadesMiembrosComision = document.getElementById('de-autoridades-miembros-comision')
// 8.- ADICIONALES:
const listRadioTomaFotograficaPredio = document.getElementsByName('list-radio-toma-fotografica-predio')
const otros = document.getElementById('otros')
// 9.- FIRMA DEL OPERADOR TOPOGRÁFICO, REPRESENTANTE DE LA COMISIÓN Y SUPERVISOR DE CAMPO
const firmaOperadorTopografo = document.getElementById('firma-operador-topografo')
const firmaRepresentanteComision = document.getElementById('firma-representante-comision')
const firmaSupervisorCampo = document.getElementById('firma-supervisor-campo')
const firmaActoresIntervinientesComentarioObservaciones = document.getElementById('firma-actores-intervinientes-comentario-observaciones')
const textoFinalFormalizacion = document.getElementById('texto-final-formalizacion')
// 10 FINALLY
const btnActualizar = document.getElementById('btn-actualizar-titular');

const getValueListRadio = (listRadio) => {
    const selected = [...listRadio].find(element => element.checked);
    if(!selected) return '';
    if(['si', 'no'].includes(selected.value)) return value === 'si'
    return value
}

const setHours = () => {
    const ahora = new Date();
    let horas = ahora.getHours().toString().padStart(2, '0');
    const minutos = ahora.getMinutes().toString().padStart(2, '0');
    const result = `${horas}:${minutos}`
    console.log({result})
    hora.value = result;
}
setHours();


const getTitularesRepresentantes = (type) => {
    const result = []
    const elements = document.querySelectorAll(`#container-${type} > div`);
    if(elements === 0) return;

    [...elements].forEach((element, index) => {
        const apellidos = element.querySelector(`[name="apellidos"]`)
        const nombres = element.querySelector(`[name="nombres"]`)
        const estadoCivil = element.querySelector(`[name="apellidos"]`)
        const tipoDoc = element.querySelector(`[name="apellidos"]`)
    })

    const result = {
        copia_doc_identidad,
        apellidos,
        nombres,
        estado_civil,
        tipo_doc,
        num_doc,
        img_firma_name,
        img_firma,
        img_huella_name,
        img_huella,
    }
}

btnActualizar.addEventListener('click', () => {
    const data = {
        // start
        fecha: fecha.value,
        cel_wsp: celWssp.value,
        // 1.- DATOS DE LA POSESIÓN INFORMAL
        departamento: departamento.value,
        provincia: provincia.value,
        distrito: distrito.value,
        posesion_informal: posesionInformal.value,
        sector: sector.value,
        // 2.- IDENTIFICACIÓN DEL PREDIO
        etapa: etapa.value,
        descripcion_fisica: getValueListRadio(listRadioDescripcionFisicaPredio),
        direccion_fiscal: direccionFiscalReferencia.value,
        tipo_uso: getValueListRadio(listRadioUso),
        servicios_basicos: Array.from(listCheckboxServBas).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value),
        // 3.- DATOS DE(LOS) TITULAR(ES)/REPRESENTANTE(S)
        carta_poder: getValueListRadio(listRadioCartaPoder),
        // 4.- BOCETO DEL PREDIO
        // bocetoDelPredio.value = data.boceto;
        // colindancia table
        colindancia: {
            frente_nombre: nombresApellidosColindanciaFrente.value,
            frente_distancia: distanciaFrente.value,
            fondo_nombre: nombresApellidosColindanciaFondo.value,
            fondo_distancia: distanciaFondo.value,
            derecha_nombre: nombresApellidosColindanciaDerecha.value,
            derecha_distancia: distanciaDerecha.value,
            izquierda_nombre: nombresApellidosColindanciaIzquierda.value,
            izquierda_distancia: distanciaIzquierda.value,
        },
        hitos_consolidados: getValueListRadio(listRadioHitosConsolidado),
        acceso_a_via: getValueListRadio(listRadioAccesoVia),
        cantidad_lotes: numeroLotes.value,
        requiere_subdivision: getValueListRadio(listRadioSubdivion),
        requiere_alineamiento: getValueListRadio(listRadioAlineamiento),
        apertura_de_via: getValueListRadio(listRadioAperturaVia),
        libre_de_riesgo: getValueListRadio(listRadioLibreRiesgo),
        req_transf_de_titular: getValueListRadio(listRadioTransfTitular),
        litigio_denuncia: getValueListRadio(listRadioLitigioDenunciaEtc),
        area_segun_el_titular_representante: areaSegunTitularRepresentante.value,
        comentario1: comentarioAdic.value,
        // 5.- DEL LEVANTAMIENTO TOPOGRÁFICO:
        codigo_dlt: codigo.value,
        hora: hora.value,
        n_punto: numeroPuntos.value,
        operador: operador.value,
        equipo_tp: equipoTp.value,
        tiempo_atmosferico: getValueListRadio(listRadioTiempoAtmosferico),
        comentario2: comentarioObservaciones.value,
        // 6.- DE LOS TITULAR(ES) O REPRESENTATE(S)
        // solo texto
        // 8.- ADICIONALES:
        adjunta_toma_topografica: getValueListRadio(listRadioTomaFotograficaPredio),
        adicionales_otros: otros.value,
        // 9.- FIRMA DEL OPERADOR TOPOGRÁFICO, REPRESENTANTE DE LA COMISIÓN Y SUPERVISOR DE CAMPO
        imagen_acta: {
            firma_topografo_name: firmaOperadorTopografo.nextElementSibling.getElementsByTagName('img')[0].getAttribute('file_name') ?? '',
            firma_topografo: firmaOperadorTopografo.nextElementSibling.getElementsByTagName('img')[0].getAttribute('src')?.replace('data:image/jpeg;base64,', '')  ?? '',
            firma_representante_comision_name: firmaRepresentanteComision.nextElementSibling.getElementsByTagName('img')[0].getAttribute('file_name') ?? '',
            firma_representante_comision: firmaRepresentanteComision.nextElementSibling.getElementsByTagName('img')[0].getAttribute('src')?.replace('data:image/jpeg;base64,', '') ?? '',
            firma_supervisor_campo_name: firmaSupervisorCampo.nextElementSibling.getElementsByTagName('img')[0].getAttribute('file_name') ?? '',
            firma_supervisor_campo: firmaSupervisorCampo.nextElementSibling.getElementsByTagName('img')[0].getAttribute('src')?.replace('data:image/jpeg;base64,', '') ?? '',
            comentario3: firmaActoresIntervinientesComentarioObservaciones.value
        },
        // pro
        handl_titulares: {
            to_add:[],
            to_delete:[],
            to_update:[]
        },
        handl_representantes: {
            to_add:[],
            to_delete:[],
            to_update:[]
        }
    };
    return console.log(data)
    fetch(window.location.pathname, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data),
    })
    .then(res => {
        if(res.status === 200) {
            location.reload();
        }
    })
    .catch(console.log);
})


//set dinamics
const init = () => {
    [...listRadioAccesoVia].map(element => element.addEventListener('change', e => {
        if(e.target.value == 'si') {
            document.getElementById('container-numero-lotes').classList.remove('hidden')
        } else {
            document.getElementById('container-numero-lotes').classList.add('hidden')
        }
    }))
}
init()

const setValueListRadio = (elementsRadio, value) => {
    [...elementsRadio]
    .find(element => element.value == value).checked = true;
    return true;
};
const setValuesListChecked = (elements, values) => {
    [...elements]
    .filter(element => values.includes(element.value))
    .map(element => element.checked = true);
};

const handlerImage = (event) => {
    const file = event.target.files[0];
    const fileName = file.name;
    console.log({fileName})
    if(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const element = event.target.nextElementSibling.getElementsByTagName('img')[0];
            element.setAttribute('src', e.target.result);
            element.setAttribute('file_name', fileName);
        };
        reader.readAsDataURL(file);
    }
}
firmaOperadorTopografo.addEventListener('change', handlerImage);
firmaRepresentanteComision.addEventListener('change', handlerImage);
firmaSupervisorCampo.addEventListener('change', handlerImage);