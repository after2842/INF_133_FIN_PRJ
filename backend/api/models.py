from django.db import models
from django.contrib.auth.models import AbstractUser


class CustomUser(AbstractUser):
    # 새로운 필드 추가
    api_token = models.CharField(max_length=200, blank=True, null=True,default='n/a')


    def __str__(self):
        return self.username
    

class Assignment(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    course_name = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    due_date = models.DateTimeField(null=True, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    
class UserEvent(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField(null=True, blank=True)
    category = models.CharField(max_length=50, choices=[
        ('work', 'Work'),
        ('personal', 'Personal'),
        ('study', 'Study'),
        ('health', 'Health'),
        ('social', 'Social'),
    ])
    event_date = models.DateTimeField(null=True, blank=True, default=None)
    created_at = models.DateTimeField(auto_now_add=True)
