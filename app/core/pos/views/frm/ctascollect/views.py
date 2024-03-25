import json
from django.core.serializers.json import DjangoJSONEncoder
from django.db import transaction
from django.db.models import Q
from django.http import HttpResponse
from django.urls import reverse_lazy
from django.views.generic import DeleteView, CreateView, FormView
from core.pos.models import CtasCollect, PaymentsCtaCollect
from core.pos.forms import *
from core.reports.forms import ReportForm
from core.security.mixins import PermissionMixin


class CtasCollectListView(FormView):
# class CtasCollectListView(PermissionMixin, FormView):
    template_name = 'frm/ctascollect/list.html'
    permission_required = 'view_ctascollect'
    form_class = ReportForm

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST.get('action')
        try:
            if action == 'search':
                data = []
                search = CtasCollect.objects.filter()
                start_date = request.POST.get('start_date')
                end_date = request.POST.get('end_date')
                if start_date and end_date:
                    search = search.filter(date_joined__range=[start_date, end_date])
                for a in search:
                    data.append(a.toJSON())
            elif action == 'search_pays':
                data = []
                pos = 1
                for det in PaymentsCtaCollect.objects.filter(ctascollect_id=request.POST.get('id')).order_by('id'):
                    item = det.toJSON()
                    item['pos'] = pos
                    data.append(item)
                    pos += 1
            elif action == 'delete_pay':
                id = request.POST.get('id')
                det = PaymentsCtaCollect.objects.get(pk=id)
                ctascollect = det.ctascollect
                det.delete()
                ctascollect.validate_debt()
            else:
                data['error'] = 'No ha ingresado una opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data, cls=DjangoJSONEncoder), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Listado de Cuentas por Cobrar'
        context['create_url'] = reverse_lazy('ctascollect_create')
        return context


class CtasCollectCreateView(CreateView):
    # class CtasCollectCreateView(PermissionMixin, CreateView):
    model = CtasCollect
    template_name = 'frm/ctascollect/create.html'
    form_class = PaymentsCtaCollectForm
    success_url = reverse_lazy('ctascollect_list')
    permission_required = 'add_ctascollect'

    def post(self, request, *args, **kwargs):
        action = request.POST.get('action')  # Utiliza get para evitar errores si 'action' no está presente
        data = []
        try:
            if action == 'search_ctascollect':
                data = []
                term = request.POST.get('term', '')
                for i in CtasCollect.objects.filter(
                        Q(sale__client__user__first_name__icontains=term) |
                        Q(sale__client__user__last_name__icontains=term) |
                        Q(sale__client__user__dni__icontains=term)
                ).exclude(state=False)[:10]:
                    item = i.toJSON()
                    item['text'] = str(i)  # Utiliza str(i) en lugar de i.__str__()
                    data.append(item)
            elif action == 'add':
                with transaction.atomic():
                    payment = PaymentsCtaCollect()
                    payment.ctascollect_id = int(request.POST.get('ctascollect', 0))  # Utiliza get para evitar errores
                    payment.date_joined = request.POST.get('date_joined', '')
                    payment.valor = float(request.POST.get('valor', 0.0))  # Utiliza get para evitar errores
                    payment.desc = request.POST.get('desc', '')
                    if not payment.desc:
                        payment.desc = 'Sin detalles'
                    payment.save()
                    payment.ctascollect.validate_debt()
            else:
                data['error'] = 'No ha ingresado una opción'
        except Exception as e:
            data['error'] = str(e)
            
        return HttpResponse(json.dumps(data, cls=DjangoJSONEncoder), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)  # Asegúrate de pasar **kwargs
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de un Pago'
        context['action'] = 'add'
        return context

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)  # Asegúrate de pasar **kwargs
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de un Pago'
        context['action'] = 'add'
        return context



class CtasCollectDeleteView(PermissionMixin, DeleteView):
    model = CtasCollect
    template_name = 'frm/ctascollect/delete.html'
    success_url = reverse_lazy('ctascollect_list')
    permission_required = 'delete_ctascollect'

    def post(self, request, *args, **kwargs):
        data = {}
        try:
            self.get_object().delete()
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['title'] = 'Notificación de eliminación'
        context['list_url'] = self.success_url
        return context
