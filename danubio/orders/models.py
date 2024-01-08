from django.db import models
from inventory.models import Product

# Create your models here.

# An order being made by a customer
class Order(models.Model):
    customer = models.CharField(max_length=255)
    payed = models.BooleanField(default=False)
    date = models.DateField()
    total_ammount = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return f"{self.customer} - {self.date}"

# Relation between an order and the products from that order
class OrderProduct(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)