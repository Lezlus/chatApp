from django.db import models
from django.contrib.auth.models import AbstractUser, PermissionsMixin
from django.utils import timezone
import uuid
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
# Create your models here.

class MessageHistory(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)


class CustomUser(AbstractUser):
    message_history = models.OneToOneField(MessageHistory, on_delete=models.SET_NULL, blank=True, null=True)
    is_online = models.BooleanField(default=False)

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


@receiver(post_save, sender=get_user_model())
def create_user_requirements(sender, instance, created, **kwargs):
    if created:
        message_history = MessageHistory.objects.create()
        instance.message_history = message_history

        # Go through all users but try to filter out youself
        # For every user create a MessageList for you and the other user
        users = get_user_model().objects.exclude(id=instance.id)
        
        for user in users:
            MessageList.objects.create(to_user=user,
            owner=instance,message_history=message_history)

        # For every user create a messagelist from that user to current instance user
        for user in users:
            MessageList.objects.create(to_user=instance,
            owner=user, message_history=user.message_history)

        instance.save()