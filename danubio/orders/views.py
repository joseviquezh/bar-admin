from django.shortcuts import render
from orders.models import Order
from datetime import date

# Create your views here.

def home(request):
    orders = Order.objects.filter(date=date.today(),
                                  payed=False)
    context = {'orders': orders }
    return render(request, 'orders/index.html', context)

def create(request):
    context = {}
    return render(request, 'orders/create.html', context)

def add_product(request, id):
    context = {}
    return render(request, 'orders/add_product.html', context)

def close(request, id):
    context = {}
    return render(request, 'orders/close.html', context)