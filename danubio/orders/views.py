from django.shortcuts import render
from orders.models import Order, OrderProduct
from inventory.models import Product
from datetime import date
from django.http import HttpResponse
from django.shortcuts import redirect
from django.urls import reverse_lazy
import json

from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def add_products_util(request, order):
    for key, value in request.POST.items():
        if "-quantity" in key:
            productId = int(key.strip("-quantity"))
            for _ in range(int(value)):
                OrderProduct.objects.create(order=order, product=Product.objects.get(id=productId))
    orderProducts = OrderProduct.objects.filter(order=order)
    total_ammount = 0
    for orderProduct in orderProducts:
        total_ammount += orderProduct.product.price
    order.total_ammount = total_ammount
    order.save()

@csrf_exempt
def home(request):
    orders = Order.objects.filter(date=date.today(), payed=False)
    products = Product.objects.all()
    context = {'orders': orders, 'products': products}
    return render(request, 'orders/index.html', context)

@csrf_exempt
def create(request):
    if request.method == 'POST':
        customer = request.POST.get('customer')
        
        # Create a new patient entry in the database using the Patient model
        order = Order(customer=customer, date=date.today())
        order.save()
        add_products_util(request, order)

        return redirect(reverse_lazy('orders'))
    else:
        return HttpResponse("Invalid request method.")

@csrf_exempt
def add_products(request):
    if request.method == 'POST':
        orderId = int(request.POST.get("orderId"))
        order = Order.objects.get(id=orderId)
        add_products_util(request, order)
        return redirect(reverse_lazy('orders'))
    else:
        return HttpResponse("Invalid request method.")

@csrf_exempt
def close(request):
    if request.method == 'POST':
        orderId = int(request.POST.get("orderId"))
        order = Order.objects.get(id=orderId)
        order.payed = True
        order.save()
        return redirect(reverse_lazy('orders'))
    else:
        return HttpResponse("Invalid request method.")