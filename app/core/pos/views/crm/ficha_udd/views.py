import json
from django.contrib.auth import authenticate, login
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
    list_url = 'ficha_list'
    success_url = reverse_lazy('ficha_list')
    
    def post(self, request, *args, **kwargs):
        # Devolver una respuesta JSON para indicar que el titular se ha creado correctamente
        return JsonResponse({'message': 'Titular creado correctamente'}, status=201)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de una ficha de identificacion preliminar'
        context['action'] = 'add'
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
        print(user,'dweweww')
        if user is not None:
            # Si el usuario es autenticado correctamente, iniciar sesión
            login(request, user)
            # Cambiar el campo 'auth_login_dashboard' del usuario
            user.auth_login_dashboard = True
            user.save()  # Guardar los cambios en la base de datos
            # Redirigir a una página de inicio o a donde desees
            print(user.auth_login_dashboard,'wnherfewijhnriuewhnwk PROBADO')
            return redirect('dashboard')  # Cambia 'pagina_de_inicio' por el nombre de tu URL
        else:
            # Si la autenticación falla, mostrar un mensaje de error o manejarlo de otra manera
            return redirect('ficha_login')  # Redirigir nuevamente a la página de inicio de sesión con un mensaje de error

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
        context['create_url'] = reverse_lazy('ficha_udd_create')
        context['title'] = 'Listado de Posesiones Informales'
        return context