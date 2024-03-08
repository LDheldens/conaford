import json

# from django.http import HttpResponse
from django.urls import reverse_lazy
from django.http import JsonResponse, HttpResponse, HttpResponseRedirect
from django.views.generic import TemplateView, CreateView, UpdateView, DeleteView

# from core.pos.forms import CompanyForm, Company
# from core.security.mixins import ModuleMixin


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
        return context