from rest_framework import serializers
from django.contrib.auth import get_user_model
from chats.models import *
from rest_framework_jwt.settings import api_settings


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ('username', 'is_staff', 'is_active', 'date_joined', 'message_history', 'id')


class UserSerializerWithToken(serializers.ModelSerializer):
    token = serializers.SerializerMethodField()
    password = serializers.CharField(write_only=True)

    def get_token(self, obj):
        jwt_payload_handler = api_settings.JWT_PAYLOAD_HANDLER
        jwt_encode_handler = api_settings.JWT_ENCODE_HANDLER

        payload = jwt_payload_handler(obj)
        token = jwt_encode_handler(payload)
        return token

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance

    class Meta:
        model = get_user_model()
        fields = ['token', 'username', 'password']


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