import json
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.urls import reverse_lazy
from django.views.generic import TemplateView, CreateView, UpdateView, DeleteView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# from django.core.exceptions import ObjectDoesNotExist
from core.pos.models import Acta, Colindancia, Titular, ImagenActa
from django.core.files.base import ContentFile
import base64
from django.shortcuts import get_object_or_404
from django.db import transaction
from datetime import date, datetime

# vistas creadas por Daniel
class ActaListView(TemplateView):
    template_name = 'crm/acta/list.html'
        
    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search':
                data = [acta.toJSON() for acta in Acta.objects.all()]
                print(data)
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('acta_create')
        context['title'] = 'Listado de Actas'
        return context
@method_decorator(csrf_exempt, name='dispatch')
class ActaCreateView(TemplateView):
    template_name = 'crm/acta/create.html'
    success_url = reverse_lazy('acta_list')
    acta = None

    def post(self, request, *args, **kwargs):
        # Obtener los datos del cuerpo de la solicitud
        data = json.loads(request.body)
   
        # Crear una instancia de Acta
        acta = Acta()

        # Llenar los campos de Acta
        acta.fecha = data.get('fecha', None)
        acta.cel_wsp = data.get('cel-wssp', None)
        # 1.- DATOS DE LA POSESIÓN INFORMAL
        acta.departamento = data.get('departamento', None)
        acta.provincia = data.get('provincia', None)
        acta.distrito = data.get('distrito', None)
        acta.posesion_informal = data.get('posesion-informal', None)
        acta.sector = data.get('sector', None)
        acta.etapa = data.get('etapa', None)
        # 2.- IDENTIFICACIÓN DEL PREDIO
        acta.descripcion_fisica = data.get('list-radio-descripcion-fisica-predio', None)
        acta.direccion_fiscal = data.get('direccion-fiscal-referencia', None)
        acta.tipo_uso = data.get('list-radio-uso', None)
        acta.servicios_basicos = data.get('list-checkbox-serv-bas', None)
        # 3.- DATOS DE(LOS) TITULAR(ES)/REPRESENTANTE(S)
        # acta.carta_poder = data.get('carta_poder', None)
        # 5.- DEL LEVANTAMIENTO TOPOGRÁFICO:
        acta.codigo_dlt = data.get('codigo', None)
        acta.hora = data.get('hora', None)
        acta.n_punto = data.get('numero-puntos', None)
        acta.operador = data.get('operador', None)
        acta.equipo_tp = data.get('equipo-tp', None)
        acta.tiempo_atmosferico = data.get('list-radio-tiempo-atmosferico', None)
        # comentario con respecto al predio
        acta.comentario1 = data.get('comentario1', None)
        # 6.- DE LOS TITULAR(ES) O REPRESENTATE(S)
        # Aquí solo hay texto
        # 7.- DE LAS AUTORIDADES Y/O MIEMBROS DE COMISIÓN DESIGNADOS:
        # Aquí solo hay texto
        # 8.- ADICIONALES:
        acta.adjunta_toma_topografica = data.get('list-radio-toma-fotografica-predio', None)
        acta.adicionales_otros = data.get('otros', None)
        # 9.- FIRMA DEL OPERADOR TOPOGRÁFICO, REPRESENTANTE DE LA COMISIÓN Y SUPERVISOR DE CAMPO
        acta.hitos_consolidados = data.get('list-radio-hitos-consolidado', None)
        acta.acceso_a_via = data.get('list-radio-acceso-via', None)
        acta.cantidad_lotes = data.get('numero-lotes', None)
        acta.requiere_subdivision = data.get('list-radio-subdivion', None)
        acta.requiere_alineamiento = data.get('list-radio-alineamiento', None)
        acta.apertura_de_via = data.get('list-radio-apertura-via', None)
        acta.libre_de_riesgo = data.get('list-radio-libre-riesgo', None)
        acta.req_transf_de_titular = data.get('list-radio-transf-titular', None)
        acta.litigio_denuncia = data.get('list-radio-litigio-denuncia-etc', None)
        acta.area_segun_el_titular_representante = data.get('area-segun-titular-representante', None)
        acta.comentario2 = data.get('comentario2', None)


        # Guardar la instancia de Acta en la base de datos
        acta.save()

        # Procesar las imágenes
        if 'imagenes' in data:
            imagenes_data = data['imagenes']
            imagen_acta = ImagenActa()
            # Asignar la instancia de acta a la imagen
            imagen_acta.acta = acta
            
            if 'boceto' in imagenes_data:
                boceto_base64 = imagenes_data['boceto']
                boceto_content = ContentFile(base64.b64decode(boceto_base64), name='boceto.pdf')
                imagen_acta.boceto.save('boceto.pdf', boceto_content)
            # Guardar la instancia de ImagenActa en la base de datos
            imagen_acta.save()

        # Procesar los titulares
        if 'titulares' in data:
            titulares_data = data['titulares']
            for titular_data in titulares_data:
                titular = Titular()
                titular.copia_doc_identidad = titular_data.get('copiaDocIdentidad', None)
                titular.apellidos = titular_data.get('apellidos', None)
                titular.nombres = titular_data.get('nombres', None)
                titular.estado_civil = titular_data.get('estadoCivil', None)
                titular.num_doc = titular_data.get('numDoc', None)
                
                #  Verificar si hay un documento PDF enviado en base64
                if 'pdfDocumento' in titular_data:
                    pdf_documento_base64 = titular_data['pdfDocumento']
                    pdf_documento_content = ContentFile(base64.b64decode(pdf_documento_base64), name='documento.pdf')
                    titular.pdf_documento.save('documento.pdf', pdf_documento_content)
                # Continuar llenando los demás campos...

                # Guardar la instancia de Titular en la base de datos
                titular.acta = acta  # Asociación aquí
                # Guardar la instancia de Titular en la base de datos
                titular.save()

        return JsonResponse({'message': 'Acta creada exitosamente'}, status=201)
        
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Agregar los datos al contexto que deseas pasar al template
        context['list_url'] = self.success_url
        return context

@method_decorator(csrf_exempt, name='dispatch')
class ActaView(TemplateView):
    http_method_names = ["post"]
    acta = None
    def post(self, request, *args, **kwargs):
        id = self.kwargs.get('pk')
        try:
            self.acta = Acta.objects.get(pk=id)
            data = self.acta.toJSON()
            return JsonResponse({**data, 'message': 'ok'}, status=200)
        except Acta.DoesNotExist:
            return JsonResponse({'message': 'Acta no existente'}, status=404)
    
@method_decorator(csrf_exempt, name='dispatch')
class ActaUpdateView(TemplateView):
    template_name = 'crm/acta/update.html'
    success_url = reverse_lazy('acta_list')
    http_method_names = ["get", "post"]
    acta = None

    def dispatch(self, request, *args, **kwargs):
        id = self.kwargs.get('pk')
        data = { }
        try:
            self.acta = Acta.objects.get(pk=id)
            if request.method == 'POST':
                content_type = request.content_type
                if content_type == 'application/json':
                    data = json.loads(request.body)
                elif content_type == 'application/x-www-form-urlencoded':
                    data = request.POST.dict()
                else:
                    data = { }
                # titular to add
                titularsToadd = data['handl_titulares']['to_add']
                for titular in titularsToadd:
                    newTitular = Titular.objects.create(
                        copia_doc_identidad=titular['copia_doc_identidad'],
                        apellidos=titular['apellidos'],
                        nombres=titular['nombres'],
                        estado_civil=titular['estado_civil'],
                        tipo_doc=titular['tipo_doc'],
                        num_doc=titular['num_doc'],
                        img_firma=None,
                        img_huella=None,
                    )
                    newTitular.img_firma.save(
                        titular['img_firma_name'],
                        ContentFile(base64.b64decode(titular['img_firma']))
                    )
                    newTitular.img_huella.save(
                        titular['img_huella_name'],
                        ContentFile(base64.b64decode(titular['img_huella']))
                    )
                    self.acta.titulares.add(newTitular)
                    self.acta.save()
                    
                # titular remove
                titularsToRemove = data['handl_titulares']['to_delete']
                for id in titularsToRemove:
                    titular = Titular.objects.get(id=id)
                    titular.delete()
                    
                # titular update
                titularsToUpdate = data['handl_titulares']['to_update']
                for titular in titularsToUpdate:
                    titularToupdate = Titular.objects.get(id=titular['id'])
                    titularToupdate.copia_doc_identidad = titular['copia_doc_identidad']
                    titularToupdate.apellidos = titular['apellidos']
                    titularToupdate.nombres = titular['nombres']
                    titularToupdate.estado_civil = titular['estado_civil']
                    titularToupdate.tipo_doc = titular['tipo_doc']
                    titularToupdate.num_doc = titular['num_doc']
                    titularToupdate.img_firma.save(
                        titular['img_firma_name'],
                        ContentFile(base64.b64decode(titular['img_firma']))
                    )
                    titularToupdate.img_huella.save(
                        titular['img_huella_name'],
                        ContentFile(base64.b64decode(titular['img_huella']))
                    )
                    titularToupdate.save()

                # others update
                # INICIAL
                self.acta.fecha = date.fromisoformat(data['fecha'])
                self.acta.cel_wsp = data['fecha']
                # 1.- DATOS DE LA POSESIÓN INFORMAL
                self.acta.departamento = data['departamento']
                self.acta.provincia = data['provincia']
                self.acta.distrito = data['distrito']
                self.acta.posesion_informal = data['posesion_informal']
                self.acta.sector = data['sector']
                self.acta.etapa = data['etapa']
                # 2.- IDENTIFICACIÓN DEL PREDIO
                self.acta.descripcion_fisica = data['descripcion_fisica']
                self.acta.direccion_fiscal = data['etapa']
                self.acta.tipo_uso = data['tipo_uso']
                
                self.acta.servicios_basicos = data['servicios_basicos']
                # 3.- DATOS DE(LOS) TITULAR(ES)/REPRESENTANTE(S)
                self.acta.carta_poder = data['carta_poder']
                # titulares = models.ManyToManyField(Titular, related_name='actas', blank=True)
                # self.acta.titulares = models.ManyToManyField(Titular, related_name='actas', blank=True)
                # 5.- DEL LEVANTAMIENTO TOPOGRÁFICO:
                self.acta.codigo_dlt = data['codigo_dlt']
                self.acta.hora = datetime.strptime(data['hora'], '%H:%M').time()
                self.acta.n_punto = data['n_punto']
                self.acta.operador = data['operador']
                self.acta.equipo_tp = data['equipo_tp']
                self.acta.tiempo_atmosferico = data['tiempo_atmosferico']
                # comentario con respecto al predio
                self.acta.comentario1 = data['comentario1']
                # 6.- DE LOS TITULAR(ES) O REPRESENTATE(S)
                # Aquí solo hay texto
                # 7.- DE LAS AUTORIDADES Y/O MIEMBROS DE COMISIÓN DESIGNADOS:
                # Aquí solo hay texto
                # 8.- ADICIONALES:
                self.acta.adjunta_toma_topografica = data['adjunta_toma_topografica']
                self.acta.adicionales_otros = data['adicionales_otros']
                # 9.- FIRMA DEL OPERADOR TOPOGRÁFICO, REPRESENTANTE DE LA COMISIÓN Y SUPERVISOR DE CAMPO
                colindancia = self.acta.colindancia
                colindancia.frente_nombre = data['colindancia']['frente_nombre']
                colindancia.frente_distancia = data['colindancia']['frente_distancia']
                colindancia.fondo_nombre = data['colindancia']['fondo_nombre']
                colindancia.fondo_distancia = data['colindancia']['fondo_distancia']
                colindancia.derecha_nombre = data['colindancia']['derecha_nombre']
                colindancia.derecha_distancia = data['colindancia']['derecha_distancia']
                colindancia.izquierda_nombre = data['colindancia']['izquierda_nombre']
                colindancia.izquierda_distancia = data['colindancia']['izquierda_distancia']
                colindancia.save();
                self.acta.hitos_consolidados = data['hitos_consolidados']
                self.acta.acceso_a_via = data['acceso_a_via']
                self.acta.cantidad_lotes = data['cantidad_lotes']
                self.acta.requiere_subdivision = data['requiere_subdivision']
                self.acta.requiere_alineamiento = data['requiere_alineamiento']
                self.acta.apertura_de_via = data['apertura_de_via']
                self.acta.libre_de_riesgo = data['libre_de_riesgo']
                self.acta.req_transf_de_titular = data['req_transf_de_titular']
                self.acta.litigio_denuncia = data['litigio_denuncia']
                self.acta.area_segun_el_titular_representante = data['area_segun_el_titular_representante']
                self.acta.comentario2 = data['comentario2']
                # self.acta.imagen_acta = models.ForeignKey(ImagenActa, on_delete=models.CASCADE)
                imagen_acta = self.acta.imagen_acta
                # print(data['imagen_acta']['boceto_name'])
                # imagen_acta.boceto.save(
                #     data['imagen_acta']['boceto_name'],
                #     ContentFile(base64.b64decode(data['imagen_acta']['boceto']))
                # )
                imagen_acta.firma_topografo.save(
                    data['imagen_acta']['firma_topografo_name'],
                    ContentFile(base64.b64decode(data['imagen_acta']['firma_topografo']))
                )
                imagen_acta.firma_representante_comision.save(
                    data['imagen_acta']['firma_representante_comision_name'],
                    ContentFile(base64.b64decode(data['imagen_acta']['firma_representante_comision']))
                )
                imagen_acta.firma_supervisor_campo.save(
                    data['imagen_acta']['firma_supervisor_campo_name'],
                    ContentFile(base64.b64decode(data['imagen_acta']['firma_supervisor_campo']))
                )
                imagen_acta.comentario3 = data['imagen_acta']['comentario3']
                imagen_acta.save()
                self.acta.save()
                # data = self.acta.toJSON()
                return JsonResponse({**data, 'message': 'updated'}, status=200)
        except Acta.DoesNotExist:
            if request.method == 'GET':
                return render(request, '404.html', status=404)
            elif request.method == 'POST':
                return JsonResponse({'message': 'Acta no existente'}, status=404)
        return super().dispatch(request, *args, **kwargs)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Obtener el objeto Acta y agregarlo al contexto
        pk = self.kwargs.get('pk')
        acta = get_object_or_404(Acta, pk=pk)
        context['list_url'] = self.success_url
        context['acta'] = acta
        return context


class ActaDeleteView(DeleteView):
    model = Acta
    template_name = 'crm/acta/delete.html'
    success_url = reverse_lazy('acta_list') 

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            with transaction.atomic():
                instance = self.get_object()
                # Realiza la eliminación del objeto Acta
                instance.delete()
        except Exception as e:
            # En caso de error, se devuelve el mensaje de error
            data['error'] = str(e)
        # Devuelve la respuesta en formato JSON
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Agrega el título de la página
        context['title'] = 'Notificación de eliminación'
        # Agrega la URL de redirección después de eliminar el Acta
        context['list_url'] = self.success_url  
        context['registro'] = self.kwargs.get('pk')
        return context
