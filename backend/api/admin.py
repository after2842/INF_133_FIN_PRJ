from django.contrib import admin
from .models import Assignment,UserEvent,CustomUser
admin.site.register(CustomUser)
admin.site.register(Assignment)
# admin.site.register(UserEvent)


@admin.register(UserEvent)
class ShopifyInfoAdmin(admin.ModelAdmin):
    list_display = ("title", "user")
# Register your models here.
