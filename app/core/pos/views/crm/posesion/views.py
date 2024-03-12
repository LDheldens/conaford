import json
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.urls import reverse_lazy
from django.views.generic import TemplateView, CreateView, UpdateView, DeleteView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# from django.core.exceptions import ObjectDoesNotExist
from core.pos.models import Acta,Posesion
from django.core.files.base import ContentFile
import base64
from django.shortcuts import get_object_or_404
from django.db import transaction
from datetime import date, datetime

class GetAllActaView(TemplateView):
    def get(self, request, *args, **kwargs):
        actas = Acta.objects.all().values()  # Obtener todas las actas como diccionarios
        return JsonResponse(list(actas), safe=False)
    
class PosesionariosPorActaListView(TemplateView):
     def get(self, request, *args, **kwargs):
        try:
            # Obtener el ID del acta de los argumentos de la URL
            acta_id = self.kwargs.get('acta_id')
            # Obtener todos los posecionarios asociados al acta especificada
            posecionarios = Posesion.objects.filter(acta_id=acta_id)
            # Serializar los posecionarios a formato JSON
            posecionarios_serializados = [{'id':p.id,'acta_id': p.acta_id,'apellidos': p.apellidos, 'nombres': p.nombres, 'estadoCivil': p.estado_civil, 'numDoc': p.num_doc, 'fechaInicio': p.fecha_inicio, 'fechaFin': p.fecha_fin,'aniosPosesion':p.anios_posesion} for p in posecionarios]
            # Devolver los posecionarios serializados como una respuesta JSON
            return JsonResponse({'posecionarios': posecionarios_serializados})
        except Exception as e:
            # Manejar cualquier error que pueda ocurrir durante el proceso
            return JsonResponse({'error': str(e)}, status=500)
        

@method_decorator(csrf_exempt, name='dispatch')
class PosesionCreateView(TemplateView):
    template_name = 'crm/posesion/create.html'
    
    def post(self, request, *args, **kwargs):
        # Obtener los datos del cuerpo de la solicitud
        data = json.loads(request.body)
        posecionario_data = data['posecionario']
        acta_id = data['acta_id']

        # Guardar el posecionario en la base de datos
        posecionario = Posesion(
            apellidos=posecionario_data['apellidos'],
            nombres=posecionario_data['nombres'],
            estado_civil=posecionario_data['estadoCivil'],
            num_doc=posecionario_data['numDoc'],
            fecha_inicio=posecionario_data['fechaInicio'],
            fecha_fin=posecionario_data['fechaFin'],
            acta_id=acta_id,
            anios_posesion=posecionario_data['aniosPosesion'],
            # meses_posesion=posecionario_data['mesesPosesion'],
            # diferencia_anios_meses=posecionario_data['diferenciaAniosMeses']
        )
        posecionario.save()

        # Devolver una respuesta de éxito
        return JsonResponse({'message': 'El posecionario ha sido registrado exitosamente.'})
            
    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        # context['list_url'] = self.success_url
        context['title'] = 'Registro de posesión'
        context['action'] = 'add'
        return context
    
@method_decorator(csrf_exempt, name='dispatch')
class PosesionUpdateView(TemplateView):
    
    def post(self, request, *args, **kwargs):
        # Obtener los datos del cuerpo de la solicitud
        data = json.loads(request.body)
        posecionario_data = data['posecionario']
        posecionario_id = posecionario_data['id']  # Obtener el ID del posecionario a editar

        # Obtener el posecionario a editar desde la base de datos
        posecionario = get_object_or_404(Posesion, pk=posecionario_id)

        # Actualizar los campos del posecionario con los nuevos datos
        posecionario.apellidos = posecionario_data['apellidos']
        posecionario.nombres = posecionario_data['nombres']
        posecionario.estado_civil = posecionario_data['estadoCivil']
        posecionario.num_doc = posecionario_data['numDoc']
        posecionario.fecha_inicio = posecionario_data['fechaInicio']
        posecionario.fecha_fin = posecionario_data['fechaFin']
        posecionario.anios_posesion =posecionario_data['aniosPosesion']
        # Actualizar otros campos si es necesario

        # Guardar los cambios en la base de datos
        posecionario.save()

        # Devolver una respuesta de éxito
        return JsonResponse({'message': 'El posecionario ha sido actualizado exitosamente.'})
@method_decorator(csrf_exempt, name='dispatch')
class PosesionDeleteView(TemplateView):
    
    def post(self, request, *args, **kwargs):
        # Obtener el ID del posecionario a eliminar desde los parámetros de la URL
        posecionario_id = self.kwargs.get('pk')

        # Obtener el posecionario a eliminar desde la base de datos
        posecionario = get_object_or_404(Posesion, pk=posecionario_id)

        # Eliminar el posecionario de la base de datos
        posecionario.delete()

        # Devolver una respuesta de éxito
        return JsonResponse({'message': 'El posecionario ha sido eliminado exitosamente.'})