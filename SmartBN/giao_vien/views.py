from django.contrib.auth import login, logout
from django.contrib.auth.hashers import check_password
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse
from django.shortcuts import render, redirect

from .models import *


def user_login(request):
    user = request.user
    if user.is_authenticated:
        if user.hieu_pho:
            return render(request, 'hieu_pho/base.html')
        return render(request, 'giao_vien/base.html')
    else:
        if request.method == "POST":
            username = request.POST['username']
            password = request.POST['password']
            try:
                user = GiaoVien.objects.get(username=username)
            except ObjectDoesNotExist:
                pass
            else:
                if check_password(password, user.password):
                    login(request, user)
                    if user.hieu_pho:
                        return render(request, 'hieu_pho/base.html')
                    return render(request, 'giao_vien/base.html')
            return HttpResponse("Wrong")
        return render(request, 'chung/login.html')


def user_logout(request):
    logout(request)
    return HttpResponse("Out")
