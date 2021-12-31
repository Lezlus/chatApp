from django.urls import path
from .views import *
from rest_framework_jwt.views import obtain_jwt_token

urlpatterns = [
    path('get-users/', UserAPIView.as_view()),
    path('get-users/<pk>/', GetUserAPIView.as_view()),
    path('get-message-history/', MessageHistoryFullAPIView.as_view()),
    path('get-message-history/<pk>', GetMessageHistoryAPIView.as_view()),
    path('get-message-history-minified/<pk>', MessageHistoryMinifiedAPIView.as_view()),
    path('get-message-list/', MessageListFullAPIView.as_view()),
    path('get-message-list/<pk>', GetMessageListAPIView.as_view()),
    path('create-message/', MessageCreateAPI.as_view()),
    path('token-auth/', obtain_jwt_token),
    path('current-user/', current_user),
    path('create-user/', CreateUser.as_view()),
]