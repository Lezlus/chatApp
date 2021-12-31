from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from  .models import CustomUser


class CustomUserCreationForm(UserCreationForm):
    

    class Meta:
        model = CustomUser
        fields = UserCreationForm.Meta.fields + ('message_history', 'is_online')


class CustomUserChangeForm(UserChangeForm):


        class Meta:
            model = CustomUser
            fields = ("message_history", 'is_online')