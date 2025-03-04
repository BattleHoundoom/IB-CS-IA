from django.db import models
from datetime import date


class WordleProgress(models.Model):
    ip_address = models.GenericIPAddressField(primary_key=True)
    state = models.IntegerField(default=0)
    data = models.CharField(max_length=50, default='', blank=True)
    day = models.DateField(null=True, blank=True)

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

class Essays(models.Model):
    student_name = models.CharField(max_length=50, unique=True)
    category = models.BooleanField(default=False)
    grade = models.CharField(max_length=10, default=0)
    section = models.CharField(max_length=10, default=0)
    essay_link = models.URLField(max_length=200, default='')
    winner = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.student_name} - {self.category} - {self.grade} - {self.section}"