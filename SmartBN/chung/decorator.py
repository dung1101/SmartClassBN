from django.shortcuts import redirect
from django.urls import reverse


def hp_authenticate(func):
    def wrapper(request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            return redirect(reverse('chung:login'))
        elif user.is_authenticated and not user.hieu_pho:
            return redirect(reverse('giao_vien:subject'))
        return func(request, *args, **kwargs)
    return wrapper


def gv_authenticate(func):
    def wrapper(request, *args, **kwargs):
        user = request.user
        if not user.is_authenticated:
            return redirect(reverse('chung:login'))
        elif user.is_authenticated and user.hieu_pho:
            return redirect(reverse('hieu_pho:subject'))
        return func(request, *args, **kwargs)
    return wrapper

