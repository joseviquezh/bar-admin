from django.urls import path
from .views import *
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', home, name='orders'),
    path('create/', create, name='create'),
    path('add_product/<int:id>/', add_product, name='add_product'),
    path('close/<int:id>/', close, name='close'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root = settings.MEDIA_ROOT)