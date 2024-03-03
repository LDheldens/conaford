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
    // const fileName = file.name;
    if(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            event.target
            .nextElementSibling
            .getElementsByTagName('img')[0]
            .setAttribute('src', e.target.result);
        };
        reader.readAsDataURL(file);
    }
}
firmaOperadorTopografo.addEventListener('change', handlerImage);
firmaRepresentanteComision.addEventListener('change', handlerImage);
firmaSupervisorCampo.addEventListener('change', handlerImage);

const setTitularesRepresentantes = (titulares, representantes) => {
    for (const [ index, titular ] of Object.entries(titulares)) {
        const consonant = consonants[indexFormTitular ]
        containerTitular.insertAdjacentHTML('beforeend', createFormTitularRepresentante(indexFormTitular, consonant, 'titular'));
        handlersTitularRepresentante(indexFormTitular, consonant, 'titular')
        indexFormTitular++
    }
}

const pathSplited = window.location.pathname.replace('/update', '');
fetch(pathSplited, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    // body: JSON.stringify(payload),
})
.then(res => res.status == 200 && res.json().then(data => {
    // start
    fecha.value = data.fecha.split('-').join('-');
    celWssp.value = data.cel_wsp;
    // 1.- DATOS DE LA POSESIÓN INFORMAL
    departamento.value = data.departamento;
    provincia.value = data.provincia;
    distrito.value = data.distrito;
    posesionInformal.value = data.posesion_informal;
    sector.value = data.sector;
    // 2.- IDENTIFICACIÓN DEL PREDIO
    etapa.value = data.etapa
    direccionFiscalReferencia.value = data.direccion_fiscal
    setValueListRadio(listRadioDescripcionFisicaPredio, data.descripcion_fisica)
    setValueListRadio(listRadioUso, data.tipo_uso)
    setValuesListChecked(listCheckboxServBas, data.servicios_basicos)
    listRadioUso.value = data.tipo_uso;
    // 3.- DATOS DE(LOS) TITULAR(ES)/REPRESENTANTE(S)
    listCheckboxServBas.value = data.servicios_basicos;
    setValueListRadio(listRadioCartaPoder, data.carta_poder? 'si': 'no');
    // 4.- BOCETO DEL PREDIO
    // bocetoDelPredio.value = data.boceto;
    nombresApellidosColindanciaFrente.value = data.colindancia.frente_nombre;
    distanciaFrente.value = data.colindancia.frente_distancia;
    nombresApellidosColindanciaFondo.value = data.colindancia.fondo_nombre;
    distanciaFondo.value = data.colindancia.fondo_distancia;
    nombresApellidosColindanciaDerecha.value = data.colindancia.izquierda_nombre;
    distanciaDerecha.value = data.colindancia.izquierda_distancia;
    nombresApellidosColindanciaIzquierda.value = data.colindancia.izquierda_nombre;
    distanciaIzquierda.value = data.colindancia.izquierda_distancia;
    setValueListRadio(listRadioHitosConsolidado, data.hitos_consolidados? 'si': 'no');
    setValueListRadio(listRadioAccesoVia, data.acceso_a_via? 'si': 'no');
    numeroLotes.value = data.cantidad_lotes;
    setValueListRadio(listRadioSubdivion, data.requiere_subdivision? 'si': 'no');
    setValueListRadio(listRadioAlineamiento, data.requiere_alineamiento? 'si': 'no');
    setValueListRadio(listRadioAperturaVia, data.apertura_de_via? 'si': 'no') 
    setValueListRadio(listRadioLibreRiesgo, data.libre_de_riesgo? 'si': 'no')
    setValueListRadio(listRadioTransfTitular, data.req_transf_de_titular? 'si': 'no')
    setValueListRadio(listRadioLitigioDenunciaEtc, data.litigio_denuncia? 'si': 'no')
    areaSegunTitularRepresentante.value = data.area_segun_el_titular_representante
    comentarioAdic.value = data.comentario1
    // 5.- DEL LEVANTAMIENTO TOPOGRÁFICO:
    codigo.value = data.codigo_dlt
    hora.value = data.hora
    numeroPuntos.value = data.n_punto
    operador.value = data.operador
    equipoTp.value = data.equipo_tp
    setValueListRadio(listRadioTiempoAtmosferico, data.tiempo_atmosferico)
    comentarioObservaciones.value = data.comentario2
    // 6.- DE LOS TITULAR(ES) O REPRESENTATE(S)
    // solo texto
    // 8.- ADICIONALES:
    setValueListRadio(listRadioTomaFotograficaPredio, data.adjunta_toma_topografica? 'si': 'no')
    otros.value = data.adicionales_otros
    // 9.- FIRMA DEL OPERADOR TOPOGRÁFICO, REPRESENTANTE DE LA COMISIÓN Y SUPERVISOR DE CAMPO
    firmaOperadorTopografo.nextElementSibling
    .getElementsByTagName('img')[0]
    .setAttribute('src', 'data:image/jpeg;base64,' + data.imagen_acta.firma_topografo);
    firmaRepresentanteComision.nextElementSibling
    .getElementsByTagName('img')[0]
    .setAttribute('src', 'data:image/jpeg;base64,' + data.imagen_acta.firma_representante_comision);
    firmaSupervisorCampo.nextElementSibling
    .getElementsByTagName('img')[0]
    .setAttribute('src', 'data:image/jpeg;base64,' + data.imagen_acta.firma_supervisor_campo);
    // firmaActorInterviniente = data.imagen_acta.firma_representante_comision
    // firmaSupervisorCampo = data.imagen_acta.firma_supervisor_campo
    firmaActoresIntervinientesComentarioObservaciones.value = data.imagen_acta.comentario3
    // textoFinalFormalizacion.value = data.imagen_acta.comentario3
    setTitularesRepresentantes(data.titulares, data.representantes)
}))
.catch(console.log)
//set titulars and representants
