from django.contrib import admin
from .models import WordleProgress
from .models import WordList
from .models import WordleStats
from .models import Essays
# Register your models here.


admin.site.register(WordleProgress)
admin.site.register(WordList)
admin.site.register(WordleStats)

@admin.register(Essays)
class EssaysAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'category', 'grade', 'section', 'essay_link', 'winner')
    search_fields = ('student_name', 'grade', 'section')
    list_filter = ('category', 'grade', 'section', 'winner')