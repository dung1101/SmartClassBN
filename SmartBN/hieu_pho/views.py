from django.contrib.auth.hashers import check_password
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, get_object_or_404
from django.urls import reverse

from .decorator import hp_authenticate
from giao_vien.models import *


@hp_authenticate
def subject(request):
    if request.method == "POST":
        if "kieu" in request.POST:
            if request.POST['kieu'] == 'edit':
                mon = get_object_or_404(Mon, pk=request.POST['id_sua'])
                mon.ten = request.POST['ten_moi']
                mon.khoi = request.POST['khoi_moi']
                mon.save()
                return JsonResponse({"status": "Done", "messages": 'Chỉnh sửa thành công'})
            else:
                Mon.objects.create(ten=request.POST['ten_moi'], khoi=request.POST['khoi_moi'])
                return JsonResponse({"status": "Done", "messages": 'Tạo mới thành công'})
    return render(request, 'hieu_pho/subject.html')


@hp_authenticate
def subject_list(request):
    data = []
    for mon in Mon.objects.all():
        ten = '<p id="ten_{0}">{1}</p>'.format(mon.id, mon.ten)
        khoi = '<p id="khoi_{0}">{1}</p>'.format(mon.id, mon.khoi)
        link_mon = reverse("hieu_pho:subject_detail", kwargs={'id': mon.id})
        options = '''
            <div class="btn-group">
                <button type="button" class="btn btn-info edit" data-toggle="modal" data-target="#new_mon" 
                data-id="{mon.id}" id="edit_{mon.id}" data-title='edit'>
                    Chỉnh sửa
                </button>
                <button type="button" class="btn btn-danger del" data-id="{mon.id}" id="del_{mon.id}">
                    Xóa
                </button>
                <a class="btn btn-success" href="{link_mon}" target='_blank'>
                    Chủ đề
                </a> 
            </div>
        '''.format(mon=mon, link_mon=link_mon)
        data.append([ten, khoi, options])
    return JsonResponse({"data": data})


@hp_authenticate
def subject_detail(request, id):
    mon = get_object_or_404(Mon, pk=id)
    if request.method == "POST":
        # tạo mới
        if "ten_moi" in request.POST:
            mon.chu_de.create(ten=request.POST['ten_moi'])
            return JsonResponse({"status": "Done", "messages": 'Tạo mới thành công'})
        # xóa
        elif "id_xoa" in request.POST:
            chu_de = get_object_or_404(ChuDe, pk=request.POST['id_xoa'])
            chu_de.delete()
            return JsonResponse({"status": "Done", "messages": 'Xóa thành công'})
        # sửa
        elif "id_sua" in request.POST:
            chu_de = get_object_or_404(ChuDe, pk=request.POST['id_sua'])
            chu_de.ten = request.POST['ten_sua']
            chu_de.save()
            return JsonResponse({"status": "Done", "messages": 'Sửa thành công'})
    return render(request, 'hieu_pho/subject_detail.html', {'mon': mon})


@hp_authenticate
def teacher(request):
    return render(request, 'hieu_pho/base.html')


@hp_authenticate
def question(request):
    return render(request, 'hieu_pho/base.html')


@hp_authenticate
def exam(request):
    return render(request, 'hieu_pho/base.html')


@hp_authenticate
def profile(request):
    if request.method == 'POST':
        user = request.user
        if 'ten' in request.POST:
            if check_password(request.POST['password'], user.password):
                user.ho = request.POST['ho']
                user.ten_dem = request.POST['ten_dem']
                user.ten = request.POST['ten']
                if 'nu' in request.POST:
                    user.gioi_tinh = GiaoVien.NU
                else:
                    user.gioi_tinh = GiaoVien.NAM
                user.save()
                return JsonResponse({"status": "Done", "messages": 'Cập nhật thành công'})
            else:
                return JsonResponse({"status": "False", "messages": 'Mật khẩu không đúng'})
        else:
            if check_password(request.POST['pass1'], user.password):
                user.set_password(request.POST['pass2'])
                user.save()
                return JsonResponse({"status": "Done", "messages": 'Cập nhật thành công'})
            else:
                return JsonResponse({"status": "False", "messages": 'Mật khẩu không đúng'})
    return render(request, 'hieu_pho/profile.html')




