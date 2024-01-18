from django.db import models

# Create your models here.
class WordleProgress(models.Model):
    ip_address = models.GenericIPAddressField(primary_key=True)
    ongoing = models.BooleanField(default=True)
    data = models.CharField(max_length=50, default='', blank=True)
    #curr_row = models.IntegerField(default=0)