from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from .models import *
# Register your models here.


class CustomUserAdmin(UserAdmin):
    add_form = CustomUserCreationForm
    form = CustomUserChangeForm
    model = CustomUser
    
    list_display = ('username','is_staff', 'is_active', 'date_joined', 'message_history')
    fieldsets = UserAdmin.fieldsets + ((None, {'fields': ('message_history', 'is_online')}),)
    add_fieldsets = UserAdmin.add_fieldsets + ((None, {'fields': ('message_history', 'is_online')}),)


class MessageAdmin(admin.ModelAdmin):
    list_display = ['body', 'owner', 'time_stamp']


admin.site.register(CustomUser, CustomUserAdmin)
admin.site.register(Message, MessageAdmin)
admin.site.register(MessageHistory)
admin.site.register(MessageList)