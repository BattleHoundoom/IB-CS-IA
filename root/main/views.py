import json
import os
import random
from django.conf import settings
from django.shortcuts import render
from django.http import HttpResponse
from .models import WordleProgress
from .models import WordList
from .models import WordleStats
from .models import Essays

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import date

# Create your views here.
def index(request):
    articles = load_articles()
    random.shuffle(articles)
    selected_articles = articles[:3]
    return render(request, 'index.html', {'articles' : selected_articles})

def about(request):
    return render(request, 'about.html')

def activities(request):
    return render(request, 'activities.html')

def temp(request):
    return render(request, 'temp.html')

def essays(request):
    essays = Essays.objects.all()
    for essay in essays:
        if essay.category == True:
            essay.category = "Senior"
        else:
            essay.category = "Junior"
    return render(request, 'essay.html', {'essays': essays})
    #return render(request, 'essay.html')

def wordle(request):
    user_ip = get_client_ip(request)
    #word = WordList.get_daily_word()
    current_day = date.today()

    # Retrieve Wordle progress for the user based on the IP address
    try:
        wordle_progress = WordleProgress.objects.get(ip_address=user_ip)
        #ongoing = wordle_progress.ongoing
        if current_day != wordle_progress.day:
            wordle_progress.state = 0
            wordle_progress.data = ""

        state = wordle_progress.state
        data = wordle_progress.data

        try:
            wordle_stats = WordleStats.objects.get(pk=1)  # Assuming there's only one row in WordleStats
            total_attempted = wordle_stats.total_attempted
            total_solved = wordle_stats.total_solved
        except WordleStats.DoesNotExist:
            total_attempted = 0
            total_solved = 0

        #curr_row = wordle_progress.curr_row
        return render(request, 'wordle.html', {'state': state, 'data': data, 'total_attempted': total_attempted, 'total_solved': total_solved})

        #return HttpResponse(f"Wordle Progress - Ongoing: {ongoing}, Data: {data}")
    except WordleProgress.DoesNotExist:
        return render(request, 'wordle.html', {'state': 0, 'data': "", 'total_attempted': 0, 'total_solved': 0})

    #return render(request, 'wordle.html')




def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


@csrf_exempt
#@cors_allow_origin(["https://giisastroavi.club", "https://www.giisastroavi.club"])
def update_wordle_progress(request):
    try:
        if request.method == 'POST':
            current_date = date.today()
            ip_address = get_client_ip(request)

            # Check if a record for the user already exists
            wordle_progress, created = WordleProgress.objects.get_or_create(
                ip_address=ip_address,
                defaults={'state': 0, 'data': '', 'day': current_date}
            )

            # Assuming the client sends the guess in the POST data
            guess = request.POST.get('guess', '')
            #pending_str = request.POST.get('pending', '')
            state = int(request.POST.get('state', 0))

            if wordle_progress.state == 0:
                wordle_progress.state = 1  # Set state to ongoing if it was unattempted
                WordleStats.increment_attempted()  # Increment the total_attempted count

            if state == 2 and wordle_progress.state != 2:
                wordle_progress.state = state
                WordleStats.increment_solved()  # Increment the total_solved count
            elif state == 3:
                wordle_progress.state = state

            # Update the data field with the guess
            wordle_progress.data += guess
            #wordle_progress.ongoing = pending
            #wordle_progress.state = state

            wordle_progress.day = current_date

            wordle_progress.save()

            return JsonResponse({'message': 'Progress updated successfully'})
        else:
            return JsonResponse({'message': 'Invalid request method'}, status=400)
    except Exception as e:
        return JsonResponse({'message': f'Error: {str(e)}'}, status=500)
    
def load_articles():
    file_path = os.path.join(settings.BASE_DIR, "main/static/img/blog/metadata.json")
    with open(file_path, 'r') as file:
        return json.load(file)


def get_random_articles(request):
    articles = load_articles()
    random.shuffle(articles)
    selected_articles = articles[:3]
    return JsonResponse({'articles': selected_articles})

#@cors_allow_origin(["https://giisastroavi.club", "https://www.giisastroavi.club"])
def get_secret_word(request):
    today_word = WordList.get_daily_word()
    if today_word is not None:
        return JsonResponse({'secret_word': today_word})
    else:
        return JsonResponse({'error': 'No word found for today'}, status=404)