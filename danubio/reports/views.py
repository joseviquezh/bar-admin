from django.contrib.auth.decorators import  login_required
from django.shortcuts import render
from json import dumps
from orders.models import OrderProduct, Order
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
        
        if sale["product__category__name"].lower() == "bocas":
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

    day_data["total_total"] = day_data["total"].get("efectivo", 0) + day_data["total"].get("tarjeta", 0) + day_data["total"].get("sinpe", 0)

    context["closure"] = day_data

    # Historical daily average sales
    average_sales = [0, 0, 0, 0, 0, 0, 0]
    days = {"Monday": {"count": 0, "amount": 0, "index": 0},
            "Tuesday": {"count": 0, "amount": 0, "index": 1},
            "Wednesday": {"count": 0, "amount": 0, "index": 2},
            "Thursday": {"count": 0, "amount": 0, "index": 3},
            "Friday": {"count": 0, "amount": 0, "index": 4},
            "Saturday": {"count": 0, "amount": 0, "index": 5},
            "Sunday": {"count": 0, "amount": 0, "index": 6},}

    sales = (Order.objects
             .filter(date__gte=datetime.now() - timedelta(days=30), payed=True)
             .values('date', 'total_ammount')
             .order_by('date', 'total_ammount')
             )

    for sale in sales:
        day = sale["date"].strftime("%A")
        days[day]["amount"] += sale["total_ammount"]
        days[day]["count"] += 1

    for _, value in days.items():
        if value["count"] > 0:
            average_sales[value["index"]] = round(value["amount"] / value["count"])

    context["averageData"] = average_sales

    # Historical daily total sales
    data = {}
    dataset = {"ventas": []}
    labels = set()
    
    sales = (Order.objects
             .filter(date__gte=datetime.now() - timedelta(days=30), payed=True)
             .values('date', 'total_ammount')
             .order_by('date', 'total_ammount')
             )

    for sale in sales:
        date = sale["date"].strftime("%y-%m-%d")
        amount = sale["total_ammount"]
        labels.add(date)
        if date not in data:
            data[date] = 0
        data[date] += (amount)
    
    for _, value in data.items():
        dataset["ventas"].append(value)

    context["dailyLabels"] = list(labels)
    context["dailyData"] = dumps(dataset, cls=DjangoJSONEncoder)

    # Historical products sales data
    bocasLabels = set()
    bocasDataset = {}
    cervezaLabels = set()
    cervezaDataset = {}
    data = {}
    
    sales = (OrderProduct.objects
             .filter(order__date__gte=datetime.now() - timedelta(days=30), order__payed=True)
             .values('order__date', 'product__name', 'product__category__name')
             .annotate(quantity=Count('product__name'))
             .order_by('order__date', 'product__name')
             )
    if sales:
        for sale in sales:
            product = sale["product__name"]
            category = "otros"
            if sale["product__category__name"].lower() == "bocas":
                category = "boca"
            elif "cerveza" in sale["product__category__name"].lower():
                category = "cerveza"
            quantity = sale["quantity"]
            
            if category not in data:
                data[category] = {"labels": set(), "products": {}}
            
            data[category]["labels"].add(product)
            
            if product not in data[category]["products"]:
                data[category]["products"][product] = 0
            
            data[category]["products"][product] += quantity

        cervezaLabels = []
        if "cerveza" in data:
            cervezaLabels = sorted(list(data["cerveza"]["labels"]))

            for product in data["cerveza"]["products"]:
                cervezaDataset[product] = [0] * len(cervezaLabels)
                for idx, label in enumerate(cervezaLabels, 0):
                    if label == product:
                        cervezaDataset[product][idx] = data["cerveza"]["products"][product]
        
        bocasLabels = []
        if "bocas" in data:
            bocasLabels = sorted(list(data["boca"]["labels"]))

            for product in data["boca"]["products"]:
                bocasDataset[product] = [0] * len(bocasLabels)
                for idx, label in enumerate(bocasLabels, 0):
                    if label == product:
                        bocasDataset[product][idx] = data["boca"]["products"][product]

    context["cervezaLabels"] = list(cervezaLabels)
    context["cervezaDataset"] = dumps(cervezaDataset, cls=DjangoJSONEncoder)
    context["bocasLabels"] = list(bocasLabels)
    context["bocasDataset"] = dumps(bocasDataset, cls=DjangoJSONEncoder)

    return render(request, 'reports/index.html', context)