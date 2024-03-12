from django.contrib import admin
from core.pos.models import Titular, Acta, Colindancia, ImagenActa, Posesion, PosesionInformal
# Register your models here.

admin.site.register(Titular)
admin.site.register(Acta)
admin.site.register(Colindancia)
admin.site.register(ImagenActa)
admin.site.register(Posesion)
admin.site.register(PosesionInformal)
