import json
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth import authenticate, login
from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.urls import reverse_lazy
from django.views.generic import TemplateView, CreateView, UpdateView, DeleteView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt

# from django.core.exceptions import ObjectDoesNotExist
from core.pos.models import Acta, Colindancia, Titular, ImagenActa, ColindanciaUfin
from django.core.files.base import ContentFile
import base64
from django.shortcuts import get_object_or_404
from django.db import transaction
from datetime import date, datetime




class UfitListView(TemplateView):
    template_name = 'crm/ufit/list.html'

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            action = request.POST['action']
            if action == 'search':
                colindancias = ColindanciaUfin.objects.all()
                data = [colindancia.toJSON() for colindancia in colindancias]
                print(data)
            else:
                data['error'] = 'Ha ocurrido un error'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data, cls=DjangoJSONEncoder), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('ufit_create')
        context['title'] = 'Listado Ufit'
        return context
    
@method_decorator(csrf_exempt, name='dispatch')
class UfitCreateView(TemplateView):
    template_name = 'crm/ufit/create.html'
    list_url = 'ufit_list'
    success_url = reverse_lazy('ufit_list')
    
    def post(self, request, *args, **kwargs):
        dataGeneral = json.loads(request.body)
        acta_id = dataGeneral['acta_id']
        data = dataGeneral['data']
        numero_lote = data['numeroLote']
        numero_manzana= data['numeroManzana']
        area = data['area']
        perimetro = data['perimetro']
        frente = data['frente']
        derecha = data['derecha']
        izquierda = data['izquierda']
        fondo = data['fondo']

        # Crear instancia de ColindanciaUfin y guardar en la base de datos
        colindancia_ufin = ColindanciaUfin.objects.create(
            acta_id=acta_id,
            frente_descripcion=frente['descripcion'],
            frente_distancia=frente['distancia'],
            frente_n_tramos=frente['cantidad_tramos'],
            frente_tramos=frente['tramos'],
            derecha_descripcion=derecha['descripcion'],
            derecha_distancia=derecha['distancia'],
            derecha_n_tramos=derecha['cantidad_tramos'],
            derecha_tramos=derecha['tramos'],
            izquierda_descripcion=izquierda['descripcion'],
            izquierda_distancia=izquierda['distancia'],
            izquierda_n_tramos=izquierda['cantidad_tramos'],
            izquierda_tramos=izquierda['tramos'],
            fondo_descripcion=fondo['descripcion'],
            fondo_distancia=fondo['distancia'],
            fondo_n_tramos=fondo['cantidad_tramos'],
            fondo_tramos=fondo['tramos'],
            numero_lote=numero_lote,
            numero_manzana=numero_manzana,
            area=area,
            perimetro=perimetro,
        )
        return JsonResponse({'message': 'Titular creado correctamente'}, status=201)

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de una ficha de identificacion preliminar'
        context['action'] = 'add'
        return context