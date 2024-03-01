import json
# from django.shortcuts import render
# from django.views import View
# from django.contrib.auth.models import Group
# from django.db import transaction
from django.http import JsonResponse, HttpResponse
from django.urls import reverse_lazy
from django.views.generic import TemplateView, CreateView, UpdateView, DeleteView
# from config import settings
# from core.pos.forms import ClientForm, User, Client
# from core.security.mixins import ModuleMixin, PermissionMixin

from core.pos.models import Titular, Acta, Colindancia
# vistas creadas por Daniel
class TitularListView(TemplateView):
    template_name = 'crm/titular/list.html'

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search':
                data = [titular.toJSON() for titular in Titular.objects.all()]
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('titular_create')
        context['title'] = 'Listado de Titulares'
        return context

class TitularCreateView(TemplateView):
    model = Titular
    template_name = 'crm/titular/create.html'
    success_url = reverse_lazy('titular_list')
    fields = ['apellidos', 'nombres', 'estado_civil', 'tipo_doc', 'num_doc', 'copia_doc_identidad']

    def form_valid(self, form):

        return super().form_valid(form)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de un Titular'
        context['action'] = 'add'
        return context
    
class TitularUpdateView(TemplateView):
    template_name = 'crm/titular/create.html'
    success_url = reverse_lazy('titular_list')

    def get_context_data(self, **kwargs):
        titular_id = kwargs['pk']
        titular = Titular.objects.get(pk=titular_id)
        context = super().get_context_data(**kwargs)
        context['title'] = 'Edición de Titular'
        context['action'] = 'edit'
        context['list_url'] = self.success_url  
        context['titular'] = titular
        return context

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            titular_id = kwargs['pk']
            titular = Titular.objects.get(pk=titular_id)
            titular.apellidos = request.POST.get('apellidos')
            titular.nombres = request.POST.get('nombres')
            titular.estado_civil = request.POST.get('estado_civil')
            titular.tipo_doc = request.POST.get('tipo_doc')
            titular.num_doc = request.POST.get('num_doc')

            titular.save()

            data['success'] = True
            data['message'] = 'Titular actualizado correctamente.'
        except Exception as e:
            data['success'] = False
            data['message'] = str(e)
        return JsonResponse(data)

class TitularDeleteView(TemplateView):
    template_name = 'crm/titular/delete.html'
    success_url = reverse_lazy('titular_list') 

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Notificación de eliminación'
        context['list_url'] = self.success_url  
        context['titular'] = Titular.objects.get(pk=kwargs.get('pk'))
        return context

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            titular_id = kwargs['pk']
            titular = Titular.objects.get(pk=titular_id)
            titular.delete()

            data['success'] = True
            data['message'] = 'Titular eliminado correctamente.'
        except Exception as e:
            data['success'] = False
            data['message'] = str(e)
        return JsonResponse(data)