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