from django.shortcuts import render
from django.http import HttpResponse
from .models import WordleProgress
from .models import WordList
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from datetime import date

# Create your views here.
def index(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def activities(request):
    return render(request, 'activities.html')

def wordle(request):
    user_ip = get_client_ip(request)
    word = WordList.get_daily_word()
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

        #curr_row = wordle_progress.curr_row
        return render(request, 'wordle.html', {'state': state, 'data': data, 'secret': word})

        #return HttpResponse(f"Wordle Progress - Ongoing: {ongoing}, Data: {data}")
    except WordleProgress.DoesNotExist:
        return render(request, 'wordle.html', {'state': 0, 'data': "", 'secret': word})

    #return render(request, 'wordle.html')




def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip



@csrf_exempt
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
            state = request.POST.get('state', 0)

            #pending = pending_str.lower() == 'true'

            # Update the data field with the guess
            wordle_progress.data += guess
            #wordle_progress.ongoing = pending
            wordle_progress.state = state

            wordle_progress.day = current_date

            wordle_progress.save()

            return JsonResponse({'message': 'Progress updated successfully'})
        else:
            return JsonResponse({'message': 'Invalid request method'}, status=400)
    except Exception as e:
        return JsonResponse({'message': f'Error: {str(e)}'}, status=500)