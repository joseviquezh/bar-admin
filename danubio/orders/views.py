from datetime import date, timedelta
from django.contrib.auth.decorators import  login_required
from django.db.models import F
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from inventory.models import Product
from json import dumps
from orders.models import Order, OrderProduct



# Create your views here.

@login_required
def add_products_util(request, order):
    for key, value in request.POST.items():
        if "-quantity" in key:
            productId = int(key.strip("-quantity"))
            for _ in range(int(value)):
                product = Product.objects.get(pk=productId)
                if product.quantity:
                    product.quantity -= 1
                product.save()
                OrderProduct.objects.create(order=order, product=product)
    orderProducts = OrderProduct.objects.filter(order=order)
    total_ammount = 0
    for orderProduct in orderProducts:
        total_ammount += orderProduct.product.price
    order.total_ammount = total_ammount
    order.save()

@login_required
def home(request):
    open_orders = Order.objects.filter(date=date.today(), payed=False)
    closed_orders = Order.objects.filter(date=date.today(), payed=True)
    products = Product.objects.all()
    context = {'open_orders': open_orders, 'closed_orders': closed_orders, 'products': products}
    return render(request, 'orders/index.html', context)

@login_required
def create_order(request):
    if request.method == 'POST' and request.POST.get('customer'):
        customer = request.POST.get('customer')
        order = Order(customer=customer, date=date.today())
        order.save()
        add_products_util(request, order)

        return redirect(reverse_lazy('orders'))
    else:
        return HttpResponse("Invalid request method.")

@login_required
def add_products(request):
    if request.method == 'POST':
        orderId = int(request.POST.get("addProductOrderId"))
        order = Order.objects.get(pk=orderId)
        add_products_util(request, order)
        return redirect(reverse_lazy('orders'))
    else:
        return HttpResponse("Invalid request method.")

@login_required
def order_details(request, order_id):
    if request.method == 'GET':
        """
        Build a dictionary which looks something like this:

        {22:
            {'Imperial':
                {'quantity': 2,
                'total_due': 2400
                }
            }
        }
        """
        orders_details = {}
        orderProducts = OrderProduct.objects.filter(order=order_id)
        for orderProduct in orderProducts:
            if orderProduct.product.name not in orders_details:
                orders_details[orderProduct.product.name] = {"quantity": 0, "total_due": 0}
            orders_details[orderProduct.product.name]["quantity"] += 1
            orders_details[orderProduct.product.name]["total_due"] = orders_details[orderProduct.product.name]["quantity"] * orderProduct.product.price
        return HttpResponse(dumps(orders_details), content_type="application/json")
    else:
        return HttpResponse("Invalid request method.")

@login_required
def close_order(request):
    if request.method == 'POST':
        orderId = int(request.POST.get("closeOrderOrderId"))
        order = Order.objects.get(pk=orderId)
        order.payed = True
        order.payment_method = request.POST.get("paymentMethod")
        order.save()
        return redirect(reverse_lazy('orders'))
    else:
        return HttpResponse("Invalid request method.")