from django.db import models
from inventory.models import Product
from django.db.models.signals import post_delete
from django.dispatch import receiver
# Create your models here.
    
# An order being made by a customer
class Order(models.Model):
    customer = models.CharField(max_length=255)
    payed = models.BooleanField(default=False)
    date = models.DateField()
    total_ammount = models.IntegerField(default=0)
    payment_method = models.CharField(max_length=255, default="", blank=True, null=True)

    def __str__(self):
        return f"{self.customer} - {self.date}"

# Relation between an order and the products from that order
class OrderProduct(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.order} - {self.product}"

@receiver(post_delete, sender=OrderProduct)
def adjust_total_amount(sender, instance, using, **kwargs):
    order = instance.order
    new_total_ammount = order.total_ammount - instance.product.price
    order.total_ammount = new_total_ammount
    order.save()