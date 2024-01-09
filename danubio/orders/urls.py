from django.urls import path
from .views import *
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', home, name='orders'),
    path('create/', create, name='create_order'),
    path('add_products', add_products, name='add_products'),
    path('close_order', close, name='close_order'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)