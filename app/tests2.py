from config.wsgi import *
from core.security.models import *
from django.contrib.auth.models import Permission
from core.pos.models import *

################
type = ModuleType()
type.name = 'UDD'
type.icon = 'fas fa-shopping-cart'
type.save()
print('insertado {}'.format(type.name))

module = Module()
module.moduletype_id = 2
module.name = 'Ingresar nuevo analisis'
module.url = '/pos/crm/ficha_udd/add'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-file'
module.description = 'Permite registrar una ficha de identificacion preeliminar'
module.save()
print('insertado {}'.format(module.name))

module = Module()
module.moduletype_id = 2
module.name = 'listado de fichas'
module.url = '/pos/crm/ficha/'
module.is_active = True
module.is_vertical = True
module.is_visible = True
module.icon = 'fas fa-list-ul'
module.description = 'Permite listar las fichas de identificacion preeliminar'
module.save()
print('insertado {}'.format(module.name))
################

type = ModuleType()