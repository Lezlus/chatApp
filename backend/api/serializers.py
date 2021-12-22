from rest_framework import serializers
from django.contrib.auth import get_user_model
from chats.models import *


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('username', 'is_staff', 'is_active', 'date_joined', 'message_history', 'id')


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'body', 'time_stamp', 'owner_str', 'message_list']


class MessageListFullSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(source="message_set", many=True)
    class Meta:
        model = MessageList
        depth = 1
        fields = ['id', 'to_user', 'owner', 'messages']


class MessageListSerializer(serializers.ModelSerializer):
    class Meta:
        model = MessageList
        fields = ['id', 'to_user', 'owner']


class MessageHistorySerializer(serializers.ModelSerializer):
    message_lists = MessageListSerializer(source='messagelist_set', many=True)
    class Meta:
        model = MessageHistory
        fields = ['id', 'message_lists']


class MessageHistoryFullSerializer(serializers.ModelSerializer):
    message_lists = MessageListFullSerializer(source='messagelist_set', many=True)
    class Meta:
        model = MessageHistory
        fields = ['id', 'message_lists']


class CreateMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['body', 'owner_str', 'message_list', 'owner']