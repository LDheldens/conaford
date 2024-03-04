import json
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.urls import reverse_lazy
from django.views.generic import TemplateView, CreateView, UpdateView, DeleteView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from django.core.exceptions import ObjectDoesNotExist
from core.pos.models import Acta, Colindancia
from django.forms.models import model_to_dict
# from django.shortcuts import get_object_or_404

# vistas creadas por Daniel
class ActaListView(TemplateView):
    template_name = 'crm/acta/list.html'

    # def get(self, request, *args, **kwargs):
    #     print("GET")
    #     for acta in Acta.objects.all():
    #         print(f"[*] {type(acta)}")
        # data = [acta.to_dict() for acta in Acta.objects.all()]
        # print("DATA", data)
        
    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search':
                data = [acta.toJSON() for acta in Acta.objects.all()]
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

class ActaCreateView(TemplateView):
    template_name = 'crm/acta/create.html'
    success_url = reverse_lazy('acta_list')
    def post(self, request, *args, **kwargs):
        # Obtener los datos del formulario enviado
        fecha = request.POST.get('fecha')
        cel_wsp = request.POST.get('cel_wsp')
        departamento = request.POST.get('departamento')
        provincia = request.POST.get('provincia')
        distrito = request.POST.get('distrito')
        posesion_informal = request.POST.get('posesion_informal')
        sector = request.POST.get('sector')
        etapa = request.POST.get('etapa')
        direccion_fiscal = request.POST.get('direccion_fiscal_referencia')
        descripcion_fisica = request.POST.get('list_radio_descripcion_fisica_predio')
        tipo_uso = request.POST.get('list_radio_uso')
        servicios_basicos = request.POST.get('list-radio-serv-bas')
        carta_poder = request.POST.get('list_radio_carta_poder')
        hitos_consolidados = request.POST.get('list_radio_hitos_consolidado')
        acceso_a_via = request.POST.get('list_radio_acceso_via')
        cantidad_lotes = request.POST.get('numero_lotes')
        requiere_subdivision = request.POST.get('list_radio_subdivion')
        requiere_alineamiento = request.POST.get('list_radio_alineamiento')
        apertura_de_via = request.POST.get('list_radio_apertura_via')
        libre_de_riesgo = request.POST.get('list_radio_libre_riesgo')
        req_transf_de_titular = request.POST.get('list_radio_transf_titular')
        litigio_denuncia = request.POST.get('list_radio_litigio_denuncia_etc')
        area_segun_titular_representante = request.POST.get('area_segun_titular_representante')
        comentario1 = request.POST.get('comentario1')
        codigo_dlt = request.POST.get('codigo')
        hora = request.POST.get('hora')
        n_punto = request.POST.get('numero_puntos')
        operador = request.POST.get('operador')
        equipo_tp = request.POST.get('equipo_tp')
        tiempo_atmosferico = request.POST.get('list_radio_tiempo_atmosferico')
        comentario2 = request.POST.get('comentario2')
        # Obtener el resto de los campos de la misma manera

        # Crear una instancia de Acta con los datos recibidos
        acta = Acta.objects.create(
            fecha=fecha,
            cel_wsp=cel_wsp,
            departamento=departamento,
            provincia=provincia,
            distrito=distrito,
            posesion_informal=posesion_informal,
            sector=sector,
            etapa=etapa,
            direccion_fiscal=direccion_fiscal,
            descripcion_fisica=descripcion_fisica,
            tipo_uso=tipo_uso,
            servicios_basicos=servicios_basicos,
            carta_poder=carta_poder,
            hitos_consolidados=hitos_consolidados,
            acceso_a_via=acceso_a_via,
            cantidad_lotes=cantidad_lotes,
            requiere_subdivision=requiere_subdivision,
            requiere_alineamiento=requiere_alineamiento,
            apertura_de_via=apertura_de_via,
            libre_de_riesgo=libre_de_riesgo,
            req_transf_de_titular=req_transf_de_titular,
            litigio_denuncia=litigio_denuncia,
            area_segun_el_titular_representante=area_segun_titular_representante,
            comentario1=comentario1,
            codigo_dlt=codigo_dlt,
            hora=hora,
            n_punto=n_punto,
            operador=operador,
            equipo_tp=equipo_tp,
            tiempo_atmosferico=tiempo_atmosferico,
            comentario2=comentario2,
        )

        # Crear una instancia de Colindancia y guardarla en la base de datos
        colindancia = Colindancia.objects.create(
            acta=acta,
            frente_nombre=request.POST.get('nombres_apellidos_colindancia_frente'),
            frente_distancia=request.POST.get('distancia_frente'),
            fondo_nombre=request.POST.get('nombres_apellidos_colindancia_fondo'),
            fondo_distancia=request.POST.get('distancia_fondo'),
            derecha_nombre=request.POST.get('nombres_apellidos_colindancia_derecha'),
            derecha_distancia=request.POST.get('distancia_derecha'),
            izquierda_nombre=request.POST.get('nombres_apellidos_colindancia_izquierda'),
            izquierda_distancia=request.POST.get('distancia_izquierda')
        )

        # Redirigir a la página de éxito
        return redirect(self.success_url)
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # Agregar los datos al contexto que deseas pasar al template
        context['list_url'] = self.success_url

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
                print(data)
                print(f"ID {id}")
                # INICIAL
                # self.acta.fecha = data['fecha']
                # self.acta.cel_wsp = data['fecha']
                # # 1.- DATOS DE LA POSESIÓN INFORMAL
                # self.acta.departamento = data['departamento']
                # self.acta.provincia = data['provincia']
                # self.acta.distrito = data['distrito']
                # self.acta.posesion_informal = data['posesion_informal']
                # self.acta.sector = data['sector']
                # self.acta.etapa = data['etapa']
                # # 2.- IDENTIFICACIÓN DEL PREDIO
                # self.acta.descripcion_fisica = data['etapa']
                # self.acta.direccion_fiscal = data['etapa']
                # self.acta.tipo_uso = data['etapa']
                # self.acta.servicios_basicos = data['servicios_basicos']
                # # 3.- DATOS DE(LOS) TITULAR(ES)/REPRESENTANTE(S)
                # self.acta.carta_poder = data['carta_poder']
                # # titulares = models.ManyToManyField(Titular, related_name='actas', blank=True)
                # # self.acta.titulares = models.ManyToManyField(Titular, related_name='actas', blank=True)
                # # 5.- DEL LEVANTAMIENTO TOPOGRÁFICO:
                # self.acta.codigo_dlt = data['codigo_dlt']
                # self.acta.hora = data['hora']
                # self.acta.n_punto = data['n_punto']
                # self.acta.operador = data['operador']
                # self.acta.equipo_tp = data['equipo_tp']
                # self.acta.tiempo_atmosferico = data['tiempo_atmosferico']
                # # comentario con respecto al predio
                # self.acta.comentario1 = data['comentario1']
                # # 6.- DE LOS TITULAR(ES) O REPRESENTATE(S)
                # # Aquí solo hay texto
                # # 7.- DE LAS AUTORIDADES Y/O MIEMBROS DE COMISIÓN DESIGNADOS:
                # # Aquí solo hay texto
                # # 8.- ADICIONALES:
                # self.acta.adjunta_toma_topografica = data['adjunta_toma_topografica']
                # self.acta.adicionales_otros = data['adicionales_otros']
                # # 9.- FIRMA DEL OPERADOR TOPOGRÁFICO, REPRESENTANTE DE LA COMISIÓN Y SUPERVISOR DE CAMPO
                colindancia = self.acta.colindancia
                colindancia.frente_nombre = data['colindancia']['frente_nombre']
                # colindancia.frente_distancia = data['colindancia']['frente_distancia']
                colindancia.fondo_nombre = data['colindancia']['fondo_nombre']
                # colindancia.fondo_distancia = data['colindancia']['fondo_distancia']
                colindancia.derecha_nombre = data['colindancia']['derecha_nombre']
                # colindancia.derecha_distancia = data['colindancia']['derecha_distancia']
                colindancia.izquierda_nombre = data['colindancia']['izquierda_nombre']
                # colindancia.izquierda_distancia = data['colindancia']['izquierda_distancia']
                colindancia.save();

                # self.acta.hitos_consolidados = data['hitos_consolidados']
                # self.acta.acceso_a_via = data['acceso_a_via']
                # self.acta.cantidad_lotes = data['cantidad_lotes']
                # self.acta.requiere_subdivision = data['requiere_subdivision']
                # self.acta.requiere_alineamiento = data['requiere_alineamiento']
                # self.acta.apertura_de_via = data['apertura_de_via']
                # self.acta.libre_de_riesgo = data['libre_de_riesgo']
                # self.acta.req_transf_de_titular = data['req_transf_de_titular']
                # self.acta.litigio_denuncia = data['litigio_denuncia']
                # self.acta.area_segun_el_titular_representante = data['area_segun_el_titular_representante']
                # self.acta.comentario2 = data['comentario2']
                # self.acta.imagen_acta = models.ForeignKey(ImagenActa, on_delete=models.CASCADE)
                imagen_acta = self.acta.imagen_acta
                # imagen_acta.boceto = data['imagen_acta']['boceto']
                # imagen_acta.firma_topografo = data['imagen_acta']['firma_topografo']
                # imagen_acta.firma_representante_comision = data['imagen_acta']['firma_representante_comision']
                # imagen_acta.firma_supervisor_campo = data['imagen_acta']['firma_supervisor_campo']
                imagen_acta.comentario3 = data['imagen_acta']['comentario3']
                imagen_acta.save()

                self.acta.save()
                print("OK")
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
        context['acta_id'] = self.kwargs['pk']
        # context['title'] = 'Edición de Acta'
        context['action'] = 'edit'
        context['list_url'] = self.success_url  
        return context


class ActaDeleteView(DeleteView):
    model = Acta
    template_name = 'crm/acta/delete.html'
    success_url = reverse_lazy('acta_list') 

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Notificación de eliminación'
        context['list_url'] = self.success_url  
        return context