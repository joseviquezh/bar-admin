from django.shortcuts import render
from inventory.models import Product

# Create your views here.

def home(request):
    products = Product.objects.all()
    context = {'products': products }
    return render(request, 'inventory/index.html', context)

def detail(request, id):
    context = {}
    return render(request, 'inventory/detail.html', context)

def update(request, id):
    context = {}
    return render(request, 'inventory/update.html', context)