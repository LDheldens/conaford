import json
from django.shortcuts import render
from django.views import View
from django.contrib.auth.models import Group
from django.db import transaction
from django.http import JsonResponse, HttpResponse
from django.urls import reverse_lazy
from django.views.generic import CreateView, UpdateView, DeleteView, TemplateView
from config import settings
from core.pos.forms import ClientForm, User, Client
from core.security.mixins import ModuleMixin, PermissionMixin

from core.pos.models import Titular, Colindancia
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

@method_decorator(csrf_exempt, name='dispatch')
class ColindantesCreateView(TemplateView):
    template_name = 'crm/colindantes/create.html'
    success_url = reverse_lazy('client_list')

    def post(self, request, *args, **kwargs):
        data = json.loads(request.body)
        colindancia_data = data['colindancia_data'];
        acta_id = data['acta_id']
        print(colindancia_data)
        print(acta_id)
        colindancia = Colindancia(
            frente_distancia = colindancia_data['frente'],
            fondo_distancia = colindancia_data['fondo'],
            derecha_distancia = colindancia_data['derecha'],
            izquierda_distancia = colindancia_data['izquierda'],
            area_documento = colindancia_data['areaDocumento'],
            area_levantamiento = colindancia_data['areaLevantamiento'],
            diferencias = colindancia_data['diferencias'],
            contingencia = colindancia_data['diferencias'],
            indicacion = colindancia_data['indicacion'],
            acta_id=acta_id,
        )
        colindancia.save()
        return JsonResponse({'message': 'colindancia registrado'})

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de un Cliente'
        context['action'] = 'add'
        context['instance'] = None
        return context


class ClientUpdateView(PermissionMixin, UpdateView):
    model = Client
    template_name = 'crm/client/create.html'
    form_class = ClientForm
    success_url = reverse_lazy('client_list')
    permission_required = 'change_client'

    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def get_form(self, form_class=None):
        instance = self.object
        form = ClientForm(instance=instance, initial={
            'first_name': instance.user.first_name,
            'last_name': instance.user.last_name,
            'dni': instance.user.dni,
            'email': instance.user.email,
            'image': instance.user.image,
        })
        return form

    def validate_data(self):
        data = {'valid': True}
        try:
            instance = self.object
            type = self.request.POST['type']
            obj = self.request.POST['obj'].strip()
            if type == 'dni':
                if User.objects.filter(dni=obj).exclude(id=instance.user.id):
                    data['valid'] = False
            elif type == 'mobile':
                if Client.objects.filter(mobile=obj).exclude(id=instance.id):
                    data['valid'] = False
            elif type == 'email':
                if User.objects.filter(email=obj).exclude(id=instance.user.id):
                    data['valid'] = False
        except:
            pass
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'edit':
                with transaction.atomic():
                    instance = self.object
                    user = instance.user
                    user.first_name = request.POST['first_name']
                    user.last_name = request.POST['last_name']
                    user.dni = request.POST['dni']
                    user.username = user.dni
                    if 'image-clear' in request.POST:
                        user.remove_image()
                    if 'image' in request.FILES:
                        user.image = request.FILES['image']
                    user.email = request.POST['email']
                    user.save()

                    client = instance
                    client.user_id = user.id
                    client.mobile = request.POST['mobile']
                    client.address = request.POST['address']
                    client.birthdate = request.POST['birthdate']
                    client.save()
            elif action == 'validate_data':
                return self.validate_data()
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Edición de un Cliente'
        context['action'] = 'edit'
        context['instance'] = self.object
        return context


class ClientDeleteView(PermissionMixin, DeleteView):
    model = Client
    template_name = 'crm/client/delete.html'
    success_url = reverse_lazy('client_list')
    permission_required = 'delete_client'

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            with transaction.atomic():
                instance = self.get_object()
                user = instance.user
                instance.delete()
                user.delete()
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Notificación de eliminación'
        context['list_url'] = self.success_url
        return context


class ClientUpdateProfileView(ModuleMixin, UpdateView):
    model = Client
    template_name = 'crm/titular/profile.html'
    form_class = ClientForm
    success_url = reverse_lazy('dashboard')

    def dispatch(self, request, *args, **kwargs):
        self.object = self.get_object()
        return super().dispatch(request, *args, **kwargs)

    def get_object(self, queryset=None):
        return self.request.user.client

    def get_form(self, form_class=None):
        instance = self.object
        form = ClientForm(instance=instance, initial={
            'first_name': instance.user.first_name,
            'last_name': instance.user.last_name,
            'dni': instance.user.dni,
            'email': instance.user.email,
            'image': instance.user.image,
        })
        return form

    def validate_data(self):
        data = {'valid': True}
        try:
            instance = self.object
            type = self.request.POST['type']
            obj = self.request.POST['obj'].strip()
            if type == 'dni':
                if User.objects.filter(dni=obj).exclude(id=instance.user.id):
                    data['valid'] = False
            elif type == 'mobile':
                if Client.objects.filter(mobile=obj).exclude(id=instance.id):
                    data['valid'] = False
            elif type == 'email':
                if User.objects.filter(email=obj).exclude(id=instance.user.id):
                    data['valid'] = False
        except:
            pass
        return JsonResponse(data)

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST['action']
        try:
            if action == 'edit':
                with transaction.atomic():
                    instance = self.object
                    user = instance.user
                    user.first_name = request.POST['first_name']
                    user.last_name = request.POST['last_name']
                    user.dni = request.POST['dni']
                    user.username = user.dni
                    if 'image-clear' in request.POST:
                        user.remove_image()
                    if 'image' in request.FILES:
                        user.image = request.FILES['image']
                    user.email = request.POST['email']
                    user.save()

                    client = instance
                    client.user_id = user.id
                    client.mobile = request.POST['mobile']
                    client.address = request.POST['address']
                    client.birthdate = request.POST['birthdate']
                    client.save()
            elif action == 'validate_data':
                return self.validate_data()
            else:
                data['error'] = 'No ha seleccionado ninguna opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['list_url'] = self.success_url
        context['title'] = 'Edición de Perfil'
        context['action'] = 'edit'
        context['instance'] = self.object
        return context