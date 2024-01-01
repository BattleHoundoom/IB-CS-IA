from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("OurTeam/", views.about, name="about"),
    path("Activities/", views.activities, name="activities"),
    path("Wordle/", views.wordle, name="wordle")
]