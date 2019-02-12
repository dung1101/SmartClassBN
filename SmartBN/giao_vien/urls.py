from django.urls import path

from . import views


app_name = 'giao_vien'
urlpatterns = [
    path('login', views.user_login, name='login'),
]