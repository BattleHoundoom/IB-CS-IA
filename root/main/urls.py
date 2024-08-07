from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("OurTeam/", views.about, name="about"),
    path("Activities/", views.activities, name="activities"),
    path("Wordle/", views.temp, name="wordle"),
    path("update_wordle_progress/", views.update_wordle_progress, name="update_wordle_progress"),
    path("get_random_articles/", views.get_random_articles, name="get_random_articles"),
    path('api/secret-word/', views.get_secret_word, name='get_secret_word'),
]