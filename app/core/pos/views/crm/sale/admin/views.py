import json
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth.models import Group
from django.db import transaction
from django.db.models import Q
from django.http import HttpResponse
from django.http import JsonResponse
from django.template.loader import get_template
from django.urls import reverse_lazy
from django.views.generic import CreateView, DeleteView, FormView
from weasyprint import HTML, CSS

from core.pos.forms import *
from core.reports.forms import ReportForm
from core.security.mixins import PermissionMixin

# class SaleAdminListView(PermissionMixin, FormView):
class SaleAdminListView(FormView):
    template_name = 'crm/sale/admin/list.html'
    permission_required = 'view_sale'
    form_class = ReportForm

    def post(self, request, *args, **kwargs):
        data = {}
        action = request.POST.get('action')
        try:
            if action == 'search':
                data = []
                start_date = request.POST.get('start_date')
                end_date = request.POST.get('end_date')
                search = Sale.objects.filter()
                if start_date and end_date:
                    search = search.filter(date_joined__range=[start_date, end_date])
                for i in search:
                    data.append(i.toJSON())
            elif action == 'search_detproducts':
                data = []
                for det in SaleDetail.objects.filter(sale_id=request.POST.get('id')):
                    data.append(det.toJSON())
            else:
                data['error'] = 'No ha ingresado una opción'
        except Exception as e:
            data['error'] = str(e)
        # Serialize data using DjangoJSONEncoder
        return HttpResponse(json.dumps(data, cls=DjangoJSONEncoder), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['create_url'] = reverse_lazy('sale_admin_create')
        context['title'] = 'Listado de Ventas'
        return context


class SaleAdminCreateView(CreateView):
    model = Sale
    template_name = 'crm/sale/admin/create.html'
    form_class = SaleForm
    success_url = reverse_lazy('sale_admin_list')
    permission_required = 'add_sale'

    def validate_client(self):
        data = {'valid': True}
        try:
            type = self.request.POST['type']
            obj = self.request.POST['obj'].strip()
            if type == 'dni':
                if User.objects.filter(dni=obj):
                    data['valid'] = False
            elif type == 'mobile':
                if Client.objects.filter(mobile=obj):
                    data['valid'] = False
            # elif type == 'email':
            #     if User.objects.filter(email=obj):
            #         data['valid'] = False
        except:
            pass
        return JsonResponse(data)

    def get_form(self, form_class=None):
        form = SaleForm()
        client = Client.objects.filter(user__dni='9999999999')
        if client.exists():
            client = client[0]
            form.fields['client'].queryset = Client.objects.filter(id=client.id)
            form.initial = {'client': client}
        return form

    def post(self, request, *args, **kwargs):
        
        action = request.POST['action']
        
        data = {}
        try:
            if action == 'add':
                print(request.POST)

                with transaction.atomic():
                    sale = Sale()
                    sale.employee_id = request.user.id
                    sale.client_id = int(request.POST['client'])
                    sale.payment_method = request.POST['payment_method']
                    sale.payment_condition = request.POST['payment_condition']
                    sale.type_voucher = request.POST['type_voucher']
                    sale.igv = float(Company.objects.first().igv) / 100
                    sale.dscto = float(request.POST['dscto']) / 100
                    sale.initial = float(request.POST['initial'])
                    
                    id_predio = request.POST.get('id_predio', None)
                    sale.predio_id = int(id_predio) if id_predio is not None else None
                    
                    sale.save()
                    
                    for i in json.loads(request.POST['products']):
                        prod = Product.objects.get(pk=i['id'])
                        saledetail = SaleDetail()
                        saledetail.sale_id = sale.id
                        saledetail.product_id = prod.id
                        saledetail.price = float(i['price'])
                        saledetail.cant = int(i['cant'])
                        saledetail.subtotal = saledetail.price * 1
                        saledetail.dscto = float(i['dscto']) / 100
                        saledetail.total_dscto = saledetail.dscto * saledetail.subtotal
                        saledetail.total = saledetail.subtotal - saledetail.total_dscto
                        saledetail.save()
                        saledetail.product.save()

                    sale.calculate_invoice()

                    if sale.payment_condition == 'credito':
                        sale.end_credit = request.POST['end_credit']
                        sale.cash = 0.00
                        sale.change = 0.00
                        sale.initial = request.POST['initial']
                        sale.save()
                        ctascollect = CtasCollect()
                        ctascollect.sale_id = sale.id
                        ctascollect.date_joined = sale.date_joined
                        ctascollect.end_date = sale.end_credit
                        ctascollect.debt = sale.total
                        ctascollect.saldo = sale.total
                        ctascollect.save()
                        
                        # Crear el pago inicial asociado a la instancia de CtasCollect y guardarlo
                        payment_initial = PaymentsCtaCollect()
                        payment_initial.ctascollect_id = ctascollect.id
                        payment_initial.date_joined = sale.date_joined
                        payment_initial.valor = sale.initial
                        payment_initial.desc = 'Pago inicial'
                        payment_initial.save()
                        
                        ctascollect.validate_debt()
                    elif sale.payment_condition == 'contado':
                        if sale.payment_method == 'efectivo':
                            sale.cash = float(request.POST['cash'])
                            sale.change = float(sale.cash) - sale.total
                            sale.save()
                        elif sale.payment_method == 'tarjeta_debito_credito':
                            sale.card_number = request.POST['card_number']
                            sale.titular = request.POST['titular']
                            sale.amount_debited = float(request.POST['amount_debited'])
                            sale.save()
                        elif sale.payment_method == 'efectivo_tarjeta':
                            sale.cash = float(request.POST['cash'])
                            sale.card_number = request.POST['card_number']
                            sale.titular = request.POST['titular']
                            sale.amount_debited = float(request.POST['amount_debited'])
                            sale.save()

                    data = {'id': sale.id}
            elif action == 'search_products':
                ids = json.loads(request.POST['ids'])
                data = []
                term = request.POST['term']
                search = Product.objects.filter(Q(category__inventoried=False)).exclude(
                    id__in=ids).order_by('name')
                if len(term):
                    search = search.filter(name__icontains=term)
                    search = search[:10]
                for p in search:
                    item = p.toJSON()
                    item['value'] = p.__str__()
                    item['dscto'] = '0.00'
                    item['total_dscto'] = '0.00'
                    data.append(item)
                    
            elif action == 'search_client':
                data = []
                term = request.POST['term']
                for p in Client.objects.filter(
                        Q(user__first_name__icontains=term) | Q(user__last_name__icontains=term) | Q(
                            user__dni__icontains=term)).order_by('user__first_name')[0:10]:
                    item = p.toJSON()
                    item['text'] = '{} / {}'.format(p.user.get_full_name(), p.user.dni)
                    data.append(item)
            elif action == 'validate_client':
                return self.validate_client()
            elif action == 'create_client':
                with transaction.atomic():
                    user = User()
                    user.first_name = request.POST['first_name']
                    user.last_name = request.POST['last_name']
                    user.dni = request.POST['dni']
                    user.username = user.dni
                    if 'image' in request.FILES:
                        user.image = request.FILES['image']
                    user.create_or_update_password(user.dni)
                    # user.email = request.POST['email']
                    user.save()

                    client = Client()
                    client.user_id = user.id
                    client.mobile = request.POST['mobile']
                    client.address = request.POST['address']
                    client.save()

                    group = Group.objects.get(pk=settings.GROUPS.get('client'))
                    user.groups.add(group)

                    data = Client.objects.get(pk=client.id).toJSON()
            elif action == 'create_proforma':
                ventsjson = json.loads(request.POST['vents'])
                template = get_template('crm/sale/print/proforma.html')
                html_template = template.render({'sale': ventsjson, 'company': Company.objects.first()}).encode(
                    encoding="UTF-8")
                url_css = os.path.join(settings.BASE_DIR, 'static/lib/bootstrap-4.6.0/css/bootstrap.min.css')
                pdf_file = HTML(string=html_template, base_url=request.build_absolute_uri()).write_pdf(
                    stylesheets=[CSS(url_css)], presentational_hints=True)
                response = HttpResponse(pdf_file, content_type='application/pdf')
                return response
            else:
                data['error'] = 'No ha ingresado una opción'
        except Exception as e:
            data['error'] = str(e)
        return HttpResponse(json.dumps(data), content_type='application/json')

    def get_context_data(self, **kwargs):
        context = super().get_context_data()
        context['frmClient'] = ClientForm()
        context['list_url'] = self.success_url
        context['title'] = 'Nuevo registro de asesoria'
        context['action'] = 'add'
        context['igv'] = Company.objects.first().get_igv()
        return context


class SaleAdminDeleteView(PermissionMixin, DeleteView):
    model = Sale
    template_name = 'crm/sale/admin/delete.html'
    success_url = reverse_lazy('sale_admin_list')
    permission_required = 'delete_sale'

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
