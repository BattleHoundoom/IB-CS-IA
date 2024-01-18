from django.shortcuts import render
from django.http import HttpResponse
from .models import WordleProgress
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def index(request):
    return render(request, 'index.html')

def about(request):
    return render(request, 'about.html')

def activities(request):
    return render(request, 'activities.html')

def wordle(request):
    user_ip = get_client_ip(request)

    # Retrieve Wordle progress for the user based on the IP address
    try:
        wordle_progress = WordleProgress.objects.get(ip_address=user_ip)
        ongoing = wordle_progress.ongoing
        data = wordle_progress.data
        print(ongoing)
        #curr_row = wordle_progress.curr_row
        return render(request, 'wordle.html', {'ongoing': ongoing, 'data': data})

        #return HttpResponse(f"Wordle Progress - Ongoing: {ongoing}, Data: {data}")
    except WordleProgress.DoesNotExist:
        return render(request, 'wordle.html', {'ongoing': True, 'data': ""})

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
            ip_address = get_client_ip(request)

            # Check if a record for the user already exists
            wordle_progress, created = WordleProgress.objects.get_or_create(
                ip_address=ip_address,
                defaults={'ongoing': True, 'data': ''}
            )

            # Assuming the client sends the guess in the POST data
            guess = request.POST.get('guess', '')
            pending_str = request.POST.get('pending', '')

            pending = pending_str.lower() == 'true'

            # Update the data field with the guess
            wordle_progress.data += guess
            wordle_progress.ongoing = pending
            wordle_progress.save()

            return JsonResponse({'message': 'Progress updated successfully'})
        else:
            return JsonResponse({'message': 'Invalid request method'}, status=400)
    except Exception as e:
        return JsonResponse({'message': f'Error: {str(e)}'}, status=500)