from django.shortcuts import render, redirect
from canvasapi import Canvas
from django.http import JsonResponse
from .models import Assignment, UserEvent
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime, timedelta, date
from django.utils.timezone import now, make_aware
from django.contrib.auth import authenticate, login, get_user_model, logout
from django.views.decorators.csrf import csrf_exempt
import requests
import json

# API keys for weather and IP geolocation
api_key_weather = "3b10cb7619d94c87b83131826241112"
api_key_ip = "b3f7fb6b1a0e44429f036afcb0e25810"

# Placeholder variables for global use
temp = ""
weather = ""
location = ""

# Landing page
def landingpage(request):
    return render(request, 'landing.html')

# Main page (daily view)
def mainpage(request):
    # Get today's date
    today = now().date()
    
    # Retrieve today's events for the authenticated user
    events = UserEvent.objects.filter(
        user=request.user,
        event_date__date=today
    ).order_by('event_date') if request.user.is_authenticated else []

    # Fetch weather, location, and temperature based on user's IP
    client_ip = get_client_ip(request)
    location_data = get_location_from_ip(client_ip)
    location = location_data.get("city", "San Francisco") if location_data else "San Francisco"
    weather = get_weather(location).get("current").get("temp_f")
    temp = get_weather(location).get("current").get("condition").get("text")

    # Pass user-specific API token to the template
    api_token = request.user.api_token if request.user.is_authenticated else None

    # Context data for the template
    context = {
        'events': events,
        'temp': temp,
        'weather': weather,
        'location': location,
        'api_token': api_token,
        'today': date.today()
    }
    return render(request, 'home.html', context)

# Weekly view
def mainpage_week(request):
    # Calculate the date range for the week (Saturday to Thursday)
    today = now().date()
    start_date = today - timedelta(days=today.weekday() + 2)  # Saturday
    end_date = start_date + timedelta(days=6)  # Thursday
    
    # Fetch weather, location, and temperature based on user's IP
    client_ip = get_client_ip(request)
    location_data = get_location_from_ip(client_ip)
    location = location_data.get("city", "San Francisco") if location_data else "San Francisco"
    weather = get_weather(location).get("current").get("temp_f")
    temp = get_weather(location).get("current").get("condition").get("text")
    
    # Collect events for each day in the range
    weekly_events = []
    for single_date in (start_date + timedelta(days=n) for n in range((end_date - start_date).days + 1)):
        day_events = UserEvent.objects.filter(
            user=request.user,
            event_date__date=single_date
        ).order_by('event_date') if request.user.is_authenticated else []
        
        weekly_events.append({
            'date': single_date,
            'events': day_events
        })

    # Context data for the template
    context = {
        'weekly_events': weekly_events,
        'temp': temp,
        'weather': weather,
        'location': location, 
        'today': date.today()
    }
    return render(request, 'home_week.html', context)

# Login page
def loginpage(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        # Attempt user authentication
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return redirect('home')
        else:
            return render(request, "login.html", {"error": "Invalid username or password"})
    return render(request, "login.html")

# Logout view
def logout_view(request):
    logout(request)
    return redirect('/')  # Redirect to the landing page after logout

# Save API token (via POST request)
@csrf_exempt
def save_api_token(request):
    if request.method == "POST" and request.user.is_authenticated:
        try:
            data = json.loads(request.body)
            request.user.api_token = data.get('api_token', 'n/a')
            request.user.save()
            return JsonResponse({"success": True})
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=400)
    return JsonResponse({"success": False}, status=400)

# Register page
def registerpage(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        password_confirm = request.POST.get("password_confirm")

        # Check for password match
        if password != password_confirm:
            return render(request, "register.html", {"error": "Passwords do not match."})

        # Create a new user
        try:
            User = get_user_model()
            user = User.objects.create_user(username=username, password=password)
            user.save()
            login(request, user)
            return redirect('home')
        except Exception as e:
            return render(request, "register.html", {"error": f"Error creating user: {str(e)}"})
    return render(request, "register.html")

# Sync and save Canvas data
@api_view(['GET'])
def sync_and_save_canvas_data(request):
    user = request.user
    if not user.is_authenticated or not user.api_token:
        return Response({"error": "User not authenticated or Canvas API token missing."}, status=401)

    canvas_urls = ["https://canvas.ucsd.edu/", "https://canvas.eee.uci.edu/", "https://canvas.uci.edu/"]
    canvas = None
    for url in canvas_urls:
        try:
            canvas = Canvas(url, user.api_token)
            courses = canvas.get_courses()
            courses[0]
            break
        except Exception:
            continue

    if not canvas:
        return Response({"error": "Failed to connect to any Canvas URL"}, status=500)

    for course in courses:
        try:
            assignments = course.get_assignments()
        except Exception:
            continue

        assignments_data = []
        for assignment in assignments:
            if not assignment.due_at:
                continue
            course_name = getattr(course, 'name', 'No Course Name')     
            assignments_data.append({
                "course_name": course_name,
                "title": assignment.name,
                "due_date": assignment.due_at,
                "created_at": assignment.created_at if assignment.created_at else None
            })
        save_assignments_from_canvas(user, assignments_data)
    return redirect('home')

# Save assignments and create UserEvent objects
def save_assignments_from_canvas(user, assignments_data):
    for assignment in assignments_data:
        assignment_obj, created = Assignment.objects.update_or_create(
            user=user,
            course_name=assignment['course_name'],
            title=assignment['title'],
            due_date=assignment['due_date'],
            defaults={"created_at": assignment['created_at']}
        )
        if created:
            UserEvent.objects.create(
                user=user,
                title=assignment['course_name'],
                content=assignment['title'],
                category='study',
                event_date=assignment['due_date']
            )

# Get client IP address
def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    return x_forwarded_for.split(',')[0] if x_forwarded_for else request.META.get('REMOTE_ADDR')

# Fetch weather data
def get_weather(location):
    url = f"http://api.weatherapi.com/v1/current.json?key={api_key_weather}&q={location}"
    response = requests.get(url)
    return response.json() if response.status_code == 200 else None

# Fetch location data based on IP
def get_location_from_ip(ip):
    url = f"https://api.ipgeolocation.io/ipgeo?apiKey={api_key_ip}&ip={ip}"
    response = requests.get(url)
    return response.json() if response.status_code == 200 else None
