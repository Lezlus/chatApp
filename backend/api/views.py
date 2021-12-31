from django.shortcuts import render
from rest_framework import generics
from chats.models import *
from rest_framework import permissions, status
from django.contrib.auth import get_user_model
from .serializers import *
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.decorators import api_view
# Create your views here.

@api_view(['GET'])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class CreateUser(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, format=None):
        serializer = UserSerializerWithToken(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)





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
    # permission_classes = (permissions.AllowAny,)
    queryset = MessageHistory.objects.all()
    serializer_class = MessageHistoryFullSerializer


class MessageHistoryMinifiedAPIView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = MessageHistory.objects.all()
    serializer_class = MessageHistorySerializer

class MessageCreateAPI(generics.CreateAPIView):
    queryset = Message.objects.all()
    serializer_class = CreateMessageSerializer