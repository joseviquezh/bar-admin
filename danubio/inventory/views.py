from django.db.models import F
from django.http import HttpResponse
from django.shortcuts import redirect, render
from django.urls import reverse_lazy
from inventory.models import Product

# Create your views here.

def home(request):
    products = Product.objects.all().exclude(category__name="Boca")
    context = {'products': products }
    return render(request, 'inventory/index.html', context)

def update_inventory(request):
    if request.method == 'POST':
        for key, value in request.POST.items():
            if "-quantity" in key:
                productId = int(key.strip("-quantity"))
                Product.objects.filter(pk=productId).update(quantity=F('quantity')+value)
        return redirect(reverse_lazy('inventory'))
    else:
        return HttpResponse("Invalid request method.")