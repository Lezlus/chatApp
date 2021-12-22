from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.utils import timezone
import uuid
# Create your models here.

class MessageHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)



class CustomUser(AbstractUser):
    message_history = models.OneToOneField(MessageHistory, on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self):
        return self.username


class MessageList(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    to_user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, blank=True, null=True, related_name="to_user_message_list")
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, blank=True, null=True, related_name="owner_message_list")
    message_history = models.ForeignKey(MessageHistory, on_delete=models.CASCADE, blank=True, null=True)


class Message(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    body = models.TextField()
    time_stamp = models.DateTimeField(default=timezone.now)
    message_list = models.ManyToManyField(MessageList, blank=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, blank=True, null=True)
    owner_str = models.CharField(blank=True, max_length=50)

    def __str__(self):
        return self.body
