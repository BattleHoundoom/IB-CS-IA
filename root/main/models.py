from django.db import models
from datetime import date

# Create your models here.
class WordleProgress(models.Model):
    ip_address = models.GenericIPAddressField(primary_key=True)
    #ongoing = models.BooleanField(default=True)
    state = models.IntegerField(default=0)
    data = models.CharField(max_length=50, default='', blank=True)
    day = models.DateField(null=True, blank=True)
    #curr_row = models.IntegerField(default=0)

class WordList(models.Model):
    date = models.DateField(unique=True)
    word = models.CharField(max_length=6)

    @classmethod
    def get_daily_word(db):
        today = date.today()
        wordlist = db.objects.filter(date=today).first()

        if wordlist:
            return wordlist.word
        return None
    
class WordleStats(models.Model):
    total_attempted = models.IntegerField(default=0)
    total_solved = models.IntegerField(default=0)

    @classmethod
    def increment_attempted(cls):
        stats, created = cls.objects.get_or_create(pk=1)
        stats.total_attempted += 1
        stats.save()

    @classmethod
    def increment_solved(cls):
        stats, created = cls.objects.get_or_create(pk=1)
        stats.total_solved += 1
        stats.save()