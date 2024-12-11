from django.shortcuts import render
from canvasapi import Canvas
from django.http import JsonResponse
from .models import Assignment,UserEvent
from rest_framework.decorators import api_view
from rest_framework.response import Response
from datetime import datetime
from .models import Assignment, UserEvent
from django.shortcuts import render
from .models import UserEvent
from django.utils.timezone import now
from django.utils.timezone import make_aware
from django.contrib.auth import authenticate, login, get_user_model, logout
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth.models import User
import requests
from django.views.decorators.csrf import csrf_exempt
import json
from datetime import timedelta
from datetime import date
api_key_weather = "3b10cb7619d94c87b83131826241112"

# IP Geolocation API 키
api_key_ip = "b3f7fb6b1a0e44429f036afcb0e25810"

temp = ""
weather = ""
location = ""

def landingpage(request):
    return render(request,'landing.html')

def mainpage(request):

    # sync_result = sync_and_save_canvas_data(request)
    # if "error" in sync_result:
    #     print(sync_result["error"])  # Log the error or handle it as needed

    # 현재 날짜 가져오기
    today = now().date()
    
    # 현재 유저의 오늘 이벤트 가져오기
    events = UserEvent.objects.filter(user=request.user, event_date__date=today).order_by('event_date') if request.user.is_authenticated else []

    # weather, location, tempF
    client_ip = get_client_ip(request)
    location_data = get_location_from_ip(client_ip)
    location = location_data.get("city", "San Francisco") if location_data else "San Francisco"
    weather = get_weather(location).get("current").get("temp_f")
    temp = get_weather(location).get("current").get("condition").get("text")

    #send user.api_token to html
    api_token = request.user.api_token if request.user.is_authenticated else None

    # 이벤트 데이터를 context로 추가
    context = {
        'events': events,
        'temp': temp,
        'weather': weather,
        'location': location,
        'api_token' : api_token,
        'today': date.today()
    }
    return render(request, 'home.html', context)




def mainpage_week(request):
    # 오늘 날짜
    today = now().date()
    # 일주일 범위 계산 (토요일 ~ 목요일)
    start_date = today - timedelta(days=today.weekday() + 2)  # 이번 주 토요일 계산
    end_date = start_date + timedelta(days=6)  # 토요일부터 6일 뒤 계산 (목요일)
    
    client_ip = get_client_ip(request)
    location_data = get_location_from_ip(client_ip)
    location = location_data.get("city", "San Francisco") if location_data else "San Francisco"
    weather = get_weather(location).get("current").get("temp_f")
    temp = get_weather(location).get("current").get("condition").get("text")
    # 날짜별 이벤트 저장할 딕셔너리
    weekly_events = []
    
    # start_date부터 end_date까지 루프
    for single_date in (start_date + timedelta(days=n) for n in range((end_date - start_date).days + 1)):
        # 해당 날짜의 이벤트 필터링
        day_events = UserEvent.objects.filter(
            user=request.user,
            event_date__date=single_date
        ).order_by('event_date') if request.user.is_authenticated else []
        
        # 날짜와 해당 날짜의 이벤트 추가
        weekly_events.append({
            'date': single_date,
            'events': day_events
        })
        print(temp,weather," <---> ",location)
        context = {
                'weekly_events': weekly_events,
                'temp': temp,
                'weather': weather,
                'location': location, 
                'today': date.today()
        }
        
    return render(request, 'home_week.html', context)









def loginpage(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")

        # 인증 시도
        user = authenticate(request, username=username, password=password)

        if user is not None:
            # 인증 성공
            login(request, user)

            return redirect('home')  # 'home'은 로그인 성공 후 리다이렉트할 URL의 name
        else:
            # 인증 실패
            return render(request, "login.html", {"error": "Invalid username or password"})

    return render(request, "login.html")

def logout_view(request):
    logout(request)  # 사용자 로그아웃
    return redirect('/')  # 로그아웃 후 리다이렉트할 URL


@csrf_exempt  # For demonstration; in production, use CSRF properly
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


def registerpage(request):
    if request.method == "POST":
        username = request.POST.get("username")
        password = request.POST.get("password")
        password_confirm = request.POST.get("password_confirm")

        # 비밀번호 확인
        if password != password_confirm:
            print("/////////////",password_confirm)
            return render(request, "register.html", {"error": "Passwords do not match."})

        # 사용자 생성
        try:
            User = get_user_model()
            user = User.objects.create_user(username=username, password=password)
            user.save()

            # 생성된 사용자 자동 로그인
            login(request, user)
            return redirect('home')  # 'home'은 로그인 후 리다이렉트할 URL의 name
        except Exception as e:
            return render(request, "register.html", {"error": f"Error creating user: {str(e)}"})

    return render(request, "register.html")

@api_view(['GET'])
def sync_and_save_canvas_data(request):
    """
    Fetches assignments from Canvas, saves them to the Assignment model, 
    and creates corresponding UserEvent objects.
    """
    user = request.user
    
    # Check if the user is authenticated and has an API token
    if not user.is_authenticated or not user.api_token:
        return Response({"error": "User not authenticated or Canvas API token missing."}, status=401)

    # Canvas URL 목록
    canvas_urls = [
        "https://canvas.ucsd.edu/",
        "https://canvas.eee.uci.edu/",
        "https://canvas.uci.edu/"
    ]

    canvas = None
    for url in canvas_urls:
        try:
            print("asdkljflsdkajflksjda;lfjskalfj;lsadf////")
            canvas = Canvas(url, user.api_token)
            # 테스트로 get_courses() 호출
            courses = canvas.get_courses()
            courses[0]
            print(f"Successfully connected to Canvas at {url}")
            break  # 성공 시 루프 종료
        except Exception as e:
            print(f"Failed to connect to Canvas at {url}: {e}")
            continue

    if not canvas:
        return Response({"error": "Failed to connect to any Canvas URL"}, status=500)
    

    # Process each course
    for course in courses:
        try:
            print("course dict:",json.dumps(course.__dict__, indent = 4))  # course 객체의 속성 출력
            assignments = course.get_assignments()
        except Exception as e:
            # Log or handle error, but continue processing other courses
            continue

        # Prepare assignments data
        assignments_data = []
        for assignment in assignments:
            if not assignment.due_at:
                continue  # Skip assignments without a due date
                
            course_name = getattr(course, 'name', 'No Course Name')     
            assignments_data.append({
                "course_name": course_name,
                "title": assignment.name,
                "due_date": assignment.due_at,
                "created_at": assignment.created_at if assignment.created_at else None
            })

        # Save assignments and create UserEvent objects
        save_assignments_from_canvas(user, assignments_data)

    return redirect('home')


def save_assignments_from_canvas(user, assignments_data):
    """
    Saves assignments from Canvas to the Assignment model and creates UserEvent objects.
    """
    for assignment in assignments_data:
        # Save or update the Assignment object
        assignment_obj, created = Assignment.objects.update_or_create(
            user=user,
            course_name=assignment['course_name'],
            title=assignment['title'],
            due_date=assignment['due_date'],
            defaults={"created_at": assignment['created_at']}
        )
        if created:
            # Create a corresponding UserEvent object
            UserEvent.objects.create(
                user=user,
                title=assignment['course_name'],
                content=assignment['title'],
                category='study',
                event_date=assignment['due_date']
            )


def event_list_view(request):
    # 현재 로그인된 유저 확인
    if not request.user.is_authenticated:
        return redirect('login')  # 로그인 페이지로 리다이렉트

    # 현재 날짜 (연/월/일까지만 비교하기 위해 today() 사용)
    print("///eventlistview called///")
    today = now().date()

    # 현재 유저의 이벤트 가져오기
    events = UserEvent.objects.filter(user=request.user, event_date__date=today).order_by('event_date')

    context = {
        'events': events,  # 'events'라는 이름으로 템플릿에 전달
    }
    return render(request, 'home.html', context)

def add_event_view(request):
    if request.method == "POST":
        title = request.POST.get("title")
        time = request.POST.get("time")  # HH:MM 형식의 시간 값
        content = request.POST.get("content", "")  # 설명은 선택 사항
        category = request.POST.get("category")

        # 현재 유저와 날짜 계산
        user = request.user
        today = datetime.now().date()  # 오늘 날짜 (YYYY-MM-DD)

        try:
            # 날짜와 시간을 결합하여 `event_date` 생성
            event_date = datetime.strptime(f"{today} {time}", "%Y-%m-%d %H:%M")

            # UserEvent 모델에 데이터 저장
            UserEvent.objects.create(
                user=user,
                title=title,
                content=content,
                category=category,
                event_date=event_date
            )
            return redirect('home')  # 이벤트 목록 페이지로 리다이렉트

        except ValueError as e:
            return render(request, "home.html", {"error": f"Invalid time format: {e}"})

    # # GET 요청 처리
    # events = UserEvent.objects.filter(user=request.user).order_by('event_date')
    # return render(request, "home.html", {"events": events})



def get_client_ip(request):
    x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
    if x_forwarded_for:
        ip = x_forwarded_for.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip


def get_weather(location):
    url = f"http://api.weatherapi.com/v1/current.json?key={api_key_weather}&q={location}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return data
    else:
        print(f"Failed to fetch weather data. Status code: {response.status_code}")
        return None


# IP 기반 위치 정보 가져오기
def get_location_from_ip(ip):
    url = f"https://api.ipgeolocation.io/ipgeo?apiKey={api_key_ip}&ip={ip}"
    response = requests.get(url)

    if response.status_code == 200:
        data = response.json()
        return {
            "country": data.get("country_name"),
            "city": data.get("city"),
            "latitude": data.get("latitude"),
            "longitude": data.get("longitude"),
        }
    else:
        print(f"Failed to fetch location data. Status code: {response.status_code}")
        return None