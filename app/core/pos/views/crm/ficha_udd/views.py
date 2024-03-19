import json
from django.urls import reverse
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.urls import reverse_lazy
from django.views.generic import TemplateView, CreateView, UpdateView, DeleteView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# from django.core.exceptions import ObjectDoesNotExist
from core.pos.models import Acta, Colindancia, Titular, ImagenActa, PosesionInformal
from django.core.files.base import ContentFile
import base64
from django.shortcuts import get_object_or_404
from django.db import transaction
from datetime import date, datetime

@method_decorator(csrf_exempt, name='dispatch')
class FichaUddCreateView(TemplateView):
    template_name = 'crm/ficha_udd/create.html'
    success_url = reverse_lazy('ficha_udd_list')
    
    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        # print(data)
        # return JsonResponse({'message': 'Ficha Udd creada correctamente'}, status=201)
        posesionInformal = PosesionInformal()
        #datos posecion informal
        posesionInformal.fecha = data.get('fecha')
        posesionInformal.codigo = data.get('codigo')
        posesionInformal.departamento = data.get('departamento')
        posesionInformal.provincia = data.get('provincia')
        posesionInformal.distrito = data.get('distrito')
        posesionInformal.coordenada_x = data.get('wgs-x84-x')
        posesionInformal.coordenada_y = data.get('wgs-x84-y')
        posesionInformal.tipo_posecion_informal = data.get('list-radio-tipo-posesion-informal')
        posesionInformal.denominacion_segun_inei = data.get('denominacion-inei')
        #forma de asentamiento
        posesionInformal.tipo_matriz = data.get('tipo-matriz')
        posesionInformal.contexto_legal = data.get('contexto-legal')
        posesionInformal.aciones_de_formalizacion = data.get('acciones-formalizacion')
        #accesibilidad
        posesionInformal.tipo_calzada = data.get('tipo-calzada')
        posesionInformal.tipo_calzada_distancia = data.get('distancia')
        posesionInformal.referencia_local = data.get('referencia-local')
        posesionInformal.referencia_local_tiempo = data.get('tiempo')
        posesionInformal.ruta = data.get('rutas')
        posesionInformal.ruta_especifica = data.get('especificar')
         #configuracion urbana
        posesionInformal.tipo_configuracion_urbana = data.get('list-radio-tipo-configuracion-urbana')
        posesionInformal.numero_lotes = data.get('numero-lotes')
        posesionInformal.numero_manzanas = data.get('numero-manzanas')
        posesionInformal.porcentaje_vivencia = data.get('porcentaje-vivencia')
        posesionInformal.equipamientos = data.get('list-checkbox-equipamientos')
        posesionInformal.material_predominante = data.get('list-checkbox-material-predominante')
        posesionInformal.servicios_basicos = data.get('list-checkbox-servicios-basicos')
        #zonificacion_municipal
        posesionInformal.zonificacion_municipal = data.get('list-radio-zonificacion-municipal')
        #areas restringidas y/o formas de dominio
        posesionInformal.zonas_reservadas = data.get('zonas-reservadas')
        posesionInformal.zonas_arquelogicas_o_reservas = data.get('list-radio-zonas-arqueologica-o-reservas-naturales')
        posesionInformal.zonas_a_o_r_nombre = data.get('zonas-arqueologica-o-reservas-naturales')
        posesionInformal.zonas_a_o_r_ubicacion = data.get('list-radio-zonas-arqueologicas-o-reservas-naturales-ubicacion')
        zonas_arqueologicas_o_reservas_naturales_pdf_base64 = data.get('zonas-arqueologicas-o-reservas-naturales-pdf')
        if zonas_arqueologicas_o_reservas_naturales_pdf_base64:
            zonas_arquelogicas_o_reservas_pdf_content = ContentFile(base64.b64decode(zonas_arqueologicas_o_reservas_naturales_pdf_base64), name='zonas_arqueologicas_o_reservas_naturales.pdf')
            posesionInformal.zonas_arquelogicas_o_reservas_pdf.save('zonas_arqueologicas_o_reservas_naturales.pdf', zonas_arquelogicas_o_reservas_pdf_content)
            
        posesionInformal.zonas_riesgo = data.get('list-radio-zonas-riesgo')
        posesionInformal.zonas_riesgo_nombre = data.get('zonas-riesgo')
        posesionInformal.zonas_riesgo_ubicacion = data.get('list-radio-zonas-riesgo-ubicacion')
        zonas_riesgo_pdf_base64 = data.get('zonas-riesgo-pdf')
        if zonas_riesgo_pdf_base64:
            zonas_riesgo_pdf_base64_content = ContentFile(base64.b64decode(zonas_riesgo_pdf_base64), name='zonas_riesgo.pdf')
            posesionInformal.zonas_riesgo_pdf.save('zonas_riesgo.pdf', zonas_riesgo_pdf_base64_content)

        posesionInformal.conceciones_mineras = data.get('concesiones-mineras')
        posesionInformal.canales_postes_cables = data.get('canales-de-regadio-postes-cables')
        posesionInformal.posibles_propietarios = data.get('propietarios-de-fundos-haciendas-parcelas-etc')
        posesionInformal.otros = data.get('otros')
        #conflictos dirigenciales
        posesionInformal.conflictos_dirigenciales = data.get('list-radio-conflictos-digerenciales')
        posesionInformal.conflictos_dirigenciales_nombre = data.get('conflictos-dirigenciales')
        conflictos_dirigenciales_pdf_base64 = data.get('conflictos-dirigenciales-pdf')
        if conflictos_dirigenciales_pdf_base64:
            conflictos_dirigenciales_pdf_base64_content = ContentFile(base64.b64decode(conflictos_dirigenciales_pdf_base64), name='conflictos_dirigenciales.pdf')
            posesionInformal.zonas_riesgo_pdf.save('conflictos_dirigenciales.pdf', conflictos_dirigenciales_pdf_base64_content)
        posesionInformal.conflictos_dirigenciales_comentarios = data.get('conflictos-dirigenciales-comentarios')
        posesionInformal.conflictos_judiciales = data.get('list-radio-conflictos-judiciales-o-administrativo')
        posesionInformal.conflictos_judiciales_descripcion = data.get('conflictos-judiciales-o-administrativo-especificar')
        imagen_satelital_pdf_base64 = data.get('imagen-satelital-pdf')
        if imagen_satelital_pdf_base64:
            imagen_satelital_pdf_base64_content = ContentFile(base64.b64decode(imagen_satelital_pdf_base64), name='imagen_satelital.pdf')
            posesionInformal.imagen_satelital_pdf.save('imagen_satelital.pdf', imagen_satelital_pdf_base64_content)
        posesionInformal.comentarios_observaciones = data.get('imagen-areas-restringidas-comentarios')
        posesionInformal.save()
        return JsonResponse({'message': 'Ficha Udd creada correctamente'}, status=201)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de una ficha de identificacion preliminar'
        context['action'] = 'add'
        return context

@method_decorator(csrf_exempt, name='dispatch')
class FichaUddUpdateView(TemplateView):
    model = PosesionInformal
    template_name = 'crm/ficha_udd/update.html'
    success_url = reverse_lazy('ficha_udd_list')
    # http_method_names = ["get", "post"]
    def post(self, request, *args, **kwargs):
        # Obtener los datos del cuerpo de la solicitud
        pk = self.kwargs.get('pk')
        data = json.loads(request.body)

        # print(f'pk {pk}')
        # print(data)
        # return JsonResponse({'message': 'Ficha_udd actualizada exitosamente'}, status=201)
        
        # Crear una instancia de Acta
        posesionInformal = get_object_or_404(PosesionInformal, pk=pk)
        print(posesionInformal)
        #datos posesion informal
        posesionInformal.fecha = data.get('fecha')
        posesionInformal.codigo = data.get('codigo')
        posesionInformal.departamento = data.get('departamento')
        posesionInformal.provincia = data.get('provincia')
        posesionInformal.distrito = data.get('distrito')
        posesionInformal.coordenada_x = data.get('wgs-x84-x')
        posesionInformal.coordenada_y = data.get('wgs-x84-y')
        posesionInformal.tipo_posecion_informal = data.get('list-radio-tipo-posesion-informal')
        posesionInformal.denominacion_segun_inei = data.get('denominacion-inei')
        #forma de asentamiento
        posesionInformal.tipo_matriz = data.get('tipo-matriz')
        posesionInformal.contexto_legal = data.get('contexto-legal')
        posesionInformal.aciones_de_formalizacion = data.get('acciones-formalizacion')
        #accesibilidad
        posesionInformal.tipo_calzada = data.get('tipo-calzada')
        posesionInformal.tipo_calzada_distancia = data.get('distancia')
        posesionInformal.referencia_local = data.get('referencia-local')
        posesionInformal.referencia_local_tiempo = data.get('tiempo')
        posesionInformal.ruta = data.get('rutas')
        posesionInformal.ruta_especifica = data.get('especificar')
        posesionInformal.save()

        return JsonResponse({'message': 'Ficha_udd creada exitosamente'}, status=201)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        pk = self.kwargs.get('pk')
        ficha_udd = get_object_or_404(PosesionInformal, pk=pk)
        context['list_url'] = self.success_url
        context['ficha_udd'] = ficha_udd
        # context['archivos_acta'] = acta.imagenes.get()
        return context

class FichaUddDeleteView(DeleteView):
    model = PosesionInformal
    template_name = 'crm/ficha_udd/delete.html'
    success_url = reverse_lazy('ficha_udd_list') 

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

# vistas creadas por Daniel
class LoginFichaView(TemplateView):
    template_name = 'crm/ficha_udd/login.html'
    
    def post(self, request, *args, **kwargs):
        # Obtener los datos del formulario
        # return print('desde el request xd ewfffff')
        username = request.POST.get('username')
        password = request.POST.get('password')
        print(username,password,'probando')
        # Autenticar al usuario
        user = authenticate(request, username=username, password=password)
        print(user,'dweweww',self.kwargs.get('pk'))
        if user is not None:
            # Si el usuario es autenticado correctamente, iniciar sesión
            login(request, user)
            # Cambiar el campo 'auth_login_dashboard' del usuario
            user.auth_login_dashboard = True
            user.save()  # Guardar los cambios en la base de datos
            
            pk = self.kwargs.get('pk')
            posesion_informal = get_object_or_404(PosesionInformal, pk=pk)
            
            # Cambiar el campo 'is_matriz' y guardar el objeto
            posesion_informal.is_matriz = True
            posesion_informal.save()
            # Redirigir a una página de inicio o a donde desees
            
            return redirect('dashboard')  # Cambia 'pagina_de_inicio' por el nombre de tu URL
        else:
            # Si la autenticación falla, mostrar un mensaje de error o manejarlo de otra manera
            return redirect(reverse('ficha_udd_login', kwargs={'pk': self.kwargs.get('pk')}))

class FichaUddListView(TemplateView):
    template_name = 'crm/ficha_udd/list.html'
        
    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search':
                queryset = PosesionInformal.objects.all()
                data = [posesion.toJSON() for posesion in queryset]  # Corregir aquí
                print(data)
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return JsonResponse(data, safe=False, encoder=DjangoJSONEncoder)  # Corregir aquí

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('ficha_udd_create')
        context['title'] = 'Listado de Posesiones Informales'
        return context