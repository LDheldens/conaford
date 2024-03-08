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

class FichaUddCreateView(TemplateView):
    template_name = 'crm/ficha_udd/create.html'
    success_url = reverse_lazy('titular_list')
    
    def post(self, request, *args, **kwargs):
        # Devolver una respuesta JSON para indicar que el titular se ha creado correctamente
        return JsonResponse({'message': 'Titular creado correctamente'}, status=201)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de una ficha de identificacion preliminar'
        context['action'] = 'add'

# vistas creadas por Daniel
class LoginFichaView(TemplateView):
    template_name = 'crm/ficha_udd/login.html'

class FichaListView(TemplateView):
    template_name = 'crm/ficha_udd/list.html'
        
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
        context['title'] = 'Listado de Posesiones Informales'
        return context