from django.shortcuts import render
from json import dumps
from orders.models import OrderProduct
from django.db.models import Count
from django.core.serializers.json import DjangoJSONEncoder
from datetime import datetime, timedelta

# Create your views here.

def home(request):
    dataset = {}
    data = {}
    labels = set()
    
    sales = (OrderProduct.objects
             .filter(order__date__gte=datetime.now() - timedelta(days=30), order__payed=True)
             .values('order__date', 'product__name')
             .annotate(quantity=Count('product__name'))
             .order_by('order__date', 'product__name')
             )

    for sale in sales:
        date = sale["order__date"].strftime("%d-%m")
        product = sale["product__name"]
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

    context = {"labels": list(labels), "dataset": dumps(dataset, cls=DjangoJSONEncoder)}
    return render(request, 'reports/index.html', context)