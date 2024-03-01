import json
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.urls import reverse_lazy
from django.views.generic import TemplateView, CreateView, UpdateView, DeleteView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

from core.pos.models import Acta, Colindancia
from django.shortcuts import get_object_or_404


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
class ActaUpdateView(TemplateView):
    model = Acta
    template_name = 'crm/acta/update.html'
    success_url = reverse_lazy('acta_list')
    # fields = ['fecha', 'cel_wsp', 'departamento', 'provincia', 'distrito', 'posesion_informal', 'sector', 'etapa', 'direccion_fiscal', 'descripcion_fisica', 'tipo_uso', 'servicios_basicos', 'carta_poder', 'hitos_consolidados', 'acceso_a_via', 'cantidad_lotes', 'requiere_subdivision', 'requiere_alineamiento', 'apertura_de_via', 'libre_de_riesgo', 'req_transf_de_titular', 'litigio_denuncia', 'area_segun_el_titular_representante', 'comentario1', 'codigo_dlt', 'hora', 'n_punto', 'operador', 'equipo_tp', 'adjunta_toma_topografica', 'tiempo_atmosferico', 'comentario2']
    # def get(self, request, *args, **kwargs):
    #     pass

    def post(self, request, *args, **kwargs):
        pk = self.kwargs.get('pk')
        acta = get_object_or_404(Acta, pk=pk)
        data = model_to_dict(acta)

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