from django.contrib.auth.decorators import  login_required
from django.shortcuts import render
from json import dumps
from orders.models import OrderProduct
from django.db.models import Count
from django.core.serializers.json import DjangoJSONEncoder
from datetime import datetime, timedelta

# Create your views here.

@login_required
def home(request):
    context = {}
    # Day closure data
    day_data = {"total": {}}

    day_sales = (OrderProduct.objects
                 .filter(order__date=datetime.now(), order__payed=True)
                 .values('order__payment_method', 'product__price', 'product__category__name')
                )

    for sale in day_sales:
        payment_method = sale["order__payment_method"].lower()
        
        if sale["product__category__name"] == "Boca":
            category = "bocas"
        else:
            category = "licor"

        if category not in day_data:
            day_data[category] = {}
        if payment_method not in day_data[category]:
            day_data[category][payment_method] = 0
        day_data[category][payment_method] += sale["product__price"]

        if "total" not in day_data:
            day_data["total"] = {}
        if payment_method not in day_data["total"]:
            day_data["total"][payment_method] = 0
        day_data["total"][payment_method] += sale["product__price"]

    context["closure"] = day_data

    # Historical products sales data
    dataset = {}
    data = {}
    labels = set()
    
    sales = (OrderProduct.objects
             .filter(order__date__gte=datetime.now() - timedelta(days=30), order__payed=True)
             .values('order__date', 'product__name', 'product__category__name')
             .annotate(quantity=Count('product__name'))
             .order_by('order__date', 'product__name')
             )

    for sale in sales:
        date = sale["order__date"].strftime("%d-%m")
        product = f'{sale["product__name"]} - {sale["product__category__name"]}'
        quantity = sale["quantity"]
        labels.add(date)
        if product not in data:
            data[product] = {}
        data[product][date] = quantity
    
    labels = sorted(list(labels))

    for product in data:
        dataset[product] = [0] * len(labels)
        for idx, label in enumerate(labels, 0):
            if label in data[product]:
                dataset[product][idx] = data[product][label]
    
    context["productLabels"] = list(labels)
    context["productData"] = dumps(dataset, cls=DjangoJSONEncoder)

    # Historical daily total sales
    dataset = {"ventas": []}
    labels = set()
    
    sales = (OrderProduct.objects
             .filter(order__date__gte=datetime.now() - timedelta(days=30), order__payed=True)
             .values('order__date', 'order__total_ammount')
             .order_by('order__date', 'order__total_ammount')
             )

    for sale in sales:
        date = sale["order__date"].strftime("%d-%m")
        amount = sale["order__total_ammount"]
        labels.add(date)
        if product not in data:
            data[product] = {}
        dataset["ventas"].append(amount)
    
    labels = sorted(list(labels))
    
    context["dailyLabels"] = list(labels)
    context["dailyData"] = dumps(dataset, cls=DjangoJSONEncoder)

    return render(request, 'reports/index.html', context)