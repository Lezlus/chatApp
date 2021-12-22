from django.shortcuts import render
from rest_framework import generics
from chats.models import *
from django.contrib.auth import get_user_model
from .serializers import *
# Create your views here.


class UserAPIView(generics.ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class GetUserAPIView(generics.RetrieveAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = UserSerializer


class MessageListFullAPIView(generics.ListAPIView):
    queryset = MessageList.objects.all()
    serializer_class = MessageListFullSerializer


class GetMessageListAPIView(generics.RetrieveAPIView):
    queryset = MessageList.objects.all()
    serializer_class = MessageListFullSerializer


class MessageHistoryFullAPIView(generics.ListAPIView):
    queryset = MessageHistory.objects.all()
    serializer_class = MessageHistoryFullSerializer


class GetMessageHistoryAPIView(generics.RetrieveAPIView):
    queryset = MessageHistory.objects.all()
    serializer_class = MessageHistoryFullSerializer


class MessageHistoryMinifiedAPIView(generics.RetrieveAPIView):
    queryset = MessageHistory.objects.all()
    serializer_class = MessageHistorySerializer

class MessageCreateAPI(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = CreateMessageSerializer