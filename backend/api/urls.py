from django.urls import path
from .views import landingpage, mainpage,loginpage, registerpage, add_event_view, sync_and_save_canvas_data,logout_view,save_api_token, mainpage_week

urlpatterns = [
    #path('assignments/', sync_canvas_data, name = "get all tasks from Canvas"),
    path('',landingpage),
    path('home/', mainpage, name = "home"),
    path('login/',loginpage),
    path('register/', registerpage),
    path('add-event/',add_event_view),
    path('home/sync/',sync_and_save_canvas_data),
    path('save-api-token/', save_api_token, name='save_api_token'),
    path('logout/', logout_view, name='logout'),  
    path('home_week/',mainpage_week),

]
