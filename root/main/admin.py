from django.contrib import admin
from .models import WordleProgress
from .models import WordList
# Register your models here.


admin.site.register(WordleProgress)
admin.site.register(WordList)