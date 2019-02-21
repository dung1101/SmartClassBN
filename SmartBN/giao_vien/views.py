import datetime
import json
import random

from django.contrib.auth.hashers import check_password
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from django.http import JsonResponse, HttpResponse, Http404
from django.shortcuts import render, get_object_or_404
from django.urls import reverse

from chung.utils import handle_uploaded_file
from chung.decorator import gv_authenticate
from giao_vien.models import *


@gv_authenticate
def subject(request):
    if request.method == "POST":
        # tạo mới + sửa
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
        # xóa
        else:
            mon = get_object_or_404(Mon, pk=request.POST['id_xoa'])
            mon.delete()
            return JsonResponse({"status": "Done", "messages": 'Xóa thành công'})
    return render(request, 'giao_vien/subject.html')


@gv_authenticate
def subject_list(request):
    data = []
    for mon in request.user.mon.all():
        ten = '<p id="ten_{0}">{1}</p>'.format(mon.id, mon.ten)
        khoi = '<p id="khoi_{0}">{1}</p>'.format(mon.id, mon.khoi)
        link_mon = reverse("giao_vien:subject_detail", kwargs={'id': mon.id})
        options = '''
            <div class="btn-group">
                <a class="btn btn-success" href="{link_mon}" target='_blank'>
                    Chủ đề
                </a> 
            </div>
        '''.format(mon=mon, link_mon=link_mon)
        data.append([ten, khoi, options])
    return JsonResponse({"data": data})


@gv_authenticate
def subject_detail(request, id):
    try:
        mon = request.user.mon.get(id=id)
    except ObjectDoesNotExist:
        raise Http404("Trang này không tồn tại")
    else:
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
    return render(request, 'giao_vien/subject_detail.html', {'mon': mon})


@gv_authenticate
def question(request):
    if request.method == "POST":
        ten_mon, lop_mon = request.POST['mon'].split(" - ")
        try:
            mon = request.user.mon.get(ten=ten_mon, khoi=int(lop_mon))
        except ObjectDoesNotExist:
            return JsonResponse({"status": "False", "messages": 'Bạn không có quyền'})
        chu_de = mon.chu_de.get(ten=request.POST['chu_de'])
        the_loai, dang = request.POST['dang_cau_hoi'].split(" + ")
        if 'nd_cau_hoi' in request.POST:
            ch = CauHoi.objects.create(giao_vien_tao=request.user,
                                       mon=mon,
                                       noi_dung=request.POST['noi_dung'],
                                       do_kho=request.POST['do_kho'],
                                       chu_de=chu_de,
                                       ky_hoc=request.POST['ky_hoc'],
                                       dang=dang,
                                       the_loai=the_loai,
                                       co_cau_hoi_nho=True,
                                       so_diem=request.POST['so_diem'])
            for index, nd in enumerate(json.loads(request.POST['nd_cau_hoi'])):
                cau_hoi_nho = CauHoi.objects.create(giao_vien_tao=request.user,
                                                    mon=mon,
                                                    noi_dung=nd,
                                                    do_kho=request.POST['do_kho'],
                                                    chu_de=chu_de,
                                                    ky_hoc=request.POST['ky_hoc'],
                                                    dang=dang,
                                                    the_loai=the_loai,
                                                    la_cau_hoi_nho=True)
                if cau_hoi_nho.dang == CauHoi.TN:
                    dap_an = json.loads(request.POST['dap_an'])
                    nd_dap_an = json.loads(request.POST['nd_dap_an'])
                    for i in range(index * int(request.POST['so_dap_an']),
                                   (index + 1) * int(request.POST['so_dap_an'])):
                        if dap_an[i] == 0:
                            dung = False
                        else:
                            dung = True
                        cau_hoi_nho.dap_an.create(mon=ch.mon, chu_de=ch.chu_de, noi_dung=nd_dap_an[i],
                                                  dung=dung, cau_hoi=ch)
                elif cau_hoi_nho.dang == CauHoi.DT:
                    nd_dap_an = json.loads(request.POST['nd_dap_an'])
                    for i in range(index * int(request.POST['so_dap_an']),
                                   (index + 1) * int(request.POST['so_dap_an'])):
                        cau_hoi_nho.dap_an.create(mon=ch.mon, chu_de=ch.chu_de, noi_dung=nd_dap_an[i],
                                                  dung=True, cau_hoi=ch)
                cau_hoi_nho.save()
                ch.cau_hoi_nho.add(cau_hoi_nho)
        else:
            ch = CauHoi.objects.create(giao_vien_tao=request.user,
                                       mon=mon,
                                       noi_dung=request.POST['noi_dung'],
                                       do_kho=request.POST['do_kho'],
                                       chu_de=chu_de,
                                       ky_hoc=request.POST['ky_hoc'],
                                       dang=dang,
                                       the_loai=the_loai,
                                       so_diem=request.POST['so_diem'])
            if ch.dang == CauHoi.TN:
                dap_an = json.loads(request.POST['dap_an'])
                nd_dap_an = json.loads(request.POST['nd_dap_an'])
                for i in range(len(dap_an)):
                    if dap_an[i] == 0:
                        dung = False
                    else:
                        dung = True
                    ch.dap_an.create(mon=ch.mon, chu_de=ch.chu_de, noi_dung=nd_dap_an[i], dung=dung, cau_hoi=ch)
            elif ch.dang == CauHoi.DT:
                nd_dap_an = json.loads(request.POST['nd_dap_an'])
                for nd in nd_dap_an:
                    ch.dap_an.create(mon=ch.mon, chu_de=ch.chu_de, noi_dung=nd, dung=True, cau_hoi=ch)

        if request.FILES.get('dinh_kem') is not None:
            ch.dinh_kem = request.FILES['dinh_kem']
            # handle_uploaded_file(request.FILES['dinh_kem'])
        ch.save()
        return JsonResponse({"status": "Done", "messages": 'Tạo thành công'})
    content = {
        "list_mon": request.user.mon.all(),
    }
    return render(request, 'giao_vien/question_create.html', content)


@gv_authenticate
def question_list(request):
    if request.method == "POST":
        try:
            cau_hoi = CauHoi.objects.get(id=request.POST['id_xoa'])
        except ObjectDoesNotExist:
            return JsonResponse({"status": "False", "messages": 'Không tìm thấy'})
        if cau_hoi.giao_vien_tao != request.user:
            return JsonResponse({"status": "False", "messages": 'Chỉ người tạo mới có quyền xóa'})
        cau_hoi.delete()
        return JsonResponse({"status": "Done", "messages": 'Xóa thành công'})
    content = {
        "list_mon": request.user.mon.all(),
    }
    return render(request, 'giao_vien/question_list.html', content)


@gv_authenticate
def question_list_option(request, option):
    data = []
    option = json.loads(option)
    dang_cau_hoi = []
    if option['trac_nhiem']:
        dang_cau_hoi.append(CauHoi.TN)
    if option['dien_tu']:
        dang_cau_hoi.append(CauHoi.DT)
    if option['tu_luan']:
        dang_cau_hoi.append(CauHoi.TL)
    if option['ky_hoc'] == 'GKI':
        ky_hoc = ["Giữa kì I", ]
    elif option['ky_hoc'] == "CKI":
        ky_hoc = ["Giữa kì I", "Cuối kì I"]
    elif option['ky_hoc'] == "GKII":
        ky_hoc = ["Giữa kì II", ]
    else:
        ky_hoc = ["Giữa kì I", "Cuối kì I", "Giữa kì II", "Cuối kì II"]
    ds_cau_hoi = CauHoi.objects.filter(la_cau_hoi_nho=False,
                                       mon_id=option['mon'],
                                       ky_hoc__in=ky_hoc,
                                       dang__in=dang_cau_hoi)
    for cau_hoi in ds_cau_hoi:
        data.append([cau_hoi.id, cau_hoi.chu_de.ten, cau_hoi.dang, cau_hoi.do_kho,
                     cau_hoi.giao_vien_tao.ho_ten, str(cau_hoi.thoi_gian_tao)[:-16]])
    return JsonResponse({"data": data})


@gv_authenticate
def question_list_data(request, id):
    if id == 0:
        mon = request.user.mon.all()
    else:
        try:
            mon = request.user.mon.filter(id=id)
        except ObjectDoesNotExist:
            return JsonResponse({"data": []})
    danh_sach_cau_hoi = CauHoi.objects.filter(la_cau_hoi_nho=False, mon__in=mon)
    data = []
    for cau_hoi in danh_sach_cau_hoi:
        chu_de = '<p id="chu_de_{cau_hoi.id}">{cau_hoi.chu_de.ten}</p>'.format(cau_hoi=cau_hoi)
        dang = '<p id="dang_{cau_hoi.id}">{cau_hoi.dang}</p>'.format(cau_hoi=cau_hoi)
        the_loai = '<p id="the_loai_{cau_hoi.id}">{cau_hoi.the_loai}</p>'.format(cau_hoi=cau_hoi)
        do_kho = '<p id="do_kho_{cau_hoi.id}">{cau_hoi.do_kho}</p>'.format(cau_hoi=cau_hoi)
        thoi_gian_tao = '<p id="thoi_gian_tao_{cau_hoi.id}">{thoi_gian_tao}' \
                        '</p>'.format(cau_hoi=cau_hoi, thoi_gian_tao=str(cau_hoi.thoi_gian_tao)[:-16])
        nguoi_tao = '<p id="nguoi_tao_{cau_hoi.id}">{cau_hoi.giao_vien_tao.ho_ten}</p>'.format(cau_hoi=cau_hoi)
        data.append([chu_de, the_loai, dang, do_kho, thoi_gian_tao, nguoi_tao])
    return JsonResponse({"data": data})


@gv_authenticate
def question_detail_data(request, id):
    cau_hoi = get_object_or_404(CauHoi, pk=id)
    thoi_gian_tao = str(cau_hoi.thoi_gian_tao)[:-16]
    if cau_hoi.dang != CauHoi.TN:
        so_diem = "<h5>Điểm số: {} điểm</h5>".format(cau_hoi.so_diem)
        kieu_dap_an = '1'
    else:
        so_diem = ""
        kieu_dap_an = 'A'
    if cau_hoi.the_loai == CauHoi.TEXT:
        dinh_kem = ''
    else:
        dinh_kem = """<img src="/media/{}" style="margin: 1em;width:80%">""".format(cau_hoi.dinh_kem)

    if cau_hoi.co_cau_hoi_nho:
        chi_tiet = """
        <input type="hidden" value={cau_hoi.id} name='id'>
        <input type="hidden" value='{cau_hoi.dang}' name='dang'>
        <input type="hidden" value='{cau_hoi.so_diem}' name='so_diem'>
        <div id=chi_tiet_{cau_hoi.id} style="display:block;">
            <h5>Môn: {cau_hoi.mon.ten_dai}</h4>
            <h5>Chủ đề: {cau_hoi.chu_de.ten}</h4>
            <h5>Độ khó: {cau_hoi.do_kho}</h4>
            {so_diem}
            <h5>Kì học: {cau_hoi.ky_hoc}</5>
            <h5>Giáo viên tạo: {cau_hoi.giao_vien_tao.ho_ten}</h4>
            <h6>Ngày tạo: {thoi_gian_tao}</h5>
            <hr>
            {dinh_kem}
            {cau_hoi.noi_dung}
            <ol type='a'>
        """.format(cau_hoi=cau_hoi, thoi_gian_tao=thoi_gian_tao, so_diem=so_diem, dinh_kem=dinh_kem)
        for index, ch in enumerate(cau_hoi.cau_hoi_nho.all()):
            chi_tiet += "<li>{}<ol type='{}'>".format(ch.noi_dung, kieu_dap_an)
            for index, da in enumerate(ch.dap_an.all()):
                if da.dung:
                    dung = "correct_answer"
                else:
                    dung = ""
                chi_tiet += """
                <li class='{dung}'>{da.noi_dung}</li>
                """.format(da=da, dung=dung)
            chi_tiet += "</ol></li>"
        chi_tiet += "</ol></div>"
    else:
        chi_tiet = """
        <input type="hidden" value={cau_hoi.id} name='id'>
        <input type="hidden" value='{cau_hoi.dang}' name='dang'>
        <input type="hidden" value='{cau_hoi.so_diem}' name='so_diem'>
        <div id=chi_tiet_{cau_hoi.id} style="display:block;">
            <h5>Môn: {cau_hoi.mon.ten_dai}</h4>
            <h5>Chủ đề: {cau_hoi.chu_de.ten}</h4>
            <h5>Độ khó: {cau_hoi.do_kho}</h4>
            {so_diem}
            <h5>Kì học: {cau_hoi.ky_hoc}</5>
            <h5>Giáo viên tạo: {cau_hoi.giao_vien_tao.ho_ten}</h4>
            <h6>Ngày tạo: {thoi_gian_tao}</h5>
            <hr>
            {dinh_kem}
            {cau_hoi.noi_dung}
            <ol type='{kieu_dap_an}'>
        """.format(cau_hoi=cau_hoi, thoi_gian_tao=thoi_gian_tao, so_diem=so_diem,
                   kieu_dap_an=kieu_dap_an, dinh_kem=dinh_kem)
        for index, da in enumerate(cau_hoi.dap_an.all()):
            if da.dung:
                dung = "correct_answer"
            else:
                dung = ""
            chi_tiet += """
            <li class='{dung}'>{da.noi_dung}</li>
            """.format(da=da, dung=dung)
        chi_tiet += "</ol></div>"
    return HttpResponse(chi_tiet)


@gv_authenticate
def question_detail_review(request, cau_truc):
    cau_truc = json.loads(cau_truc)
    chi_tiet = """"""
    if cau_truc['so_tn'] > 0:
        diem_tn = round(cau_truc['pt_tn'] / cau_truc['so_tn'], 2)
        chi_tiet += "<b><u>Phần:</u> Trắc nhiệm</b><br>"
        for index, cau_hoi in enumerate(CauHoi.objects.filter(id__in=cau_truc['ds_ch'], dang="Trắc nhiệm")):
            if cau_hoi.the_loai == CauHoi.TEXT:
                dinh_kem = ''
            else:
                dinh_kem = """<br><img src="/media/{}" style="margin: 1em;width:80%">""".format(cau_hoi.dinh_kem)
            if cau_hoi.co_cau_hoi_nho:
                ds_cau_hoi_nho = cau_hoi.cau_hoi_nho.all()
                diem_con = round(diem_tn / len(ds_cau_hoi_nho), 2)
                chi_tiet += """
                    <b>Câu {index} </b>({diem} điểm)
                    {dinh_kem}
                    {cau_hoi.noi_dung}
                    <ol type='a'>
                """.format(cau_hoi=cau_hoi, index=index + 1, diem=diem_tn, dinh_kem=dinh_kem)
                for ch in ds_cau_hoi_nho:
                    chi_tiet += "<li><div>({diem} điểm){}<ol type='A'>".format(ch.noi_dung, diem=diem_con)
                    for da in ch.dap_an.all():
                        if da.dung:
                            dung = "dap_an_trac_nhiem"
                        else:
                            dung = ''
                        chi_tiet += """
                        <li class="{dung}"><div>{da.noi_dung}</div></li>
                        """.format(da=da, dung=dung)
                    chi_tiet += "</ol></div></li>"
                chi_tiet += "</ol>"
            else:
                chi_tiet += """
                    <b>Câu {index} </b>({diem} điểm)
                    {dinh_kem}
                    {cau_hoi.noi_dung}
                    <ol type='A'>
                """.format(cau_hoi=cau_hoi, index=index + 1, diem=diem_tn, dinh_kem=dinh_kem)
                for da in cau_hoi.dap_an.all():
                    if da.dung:
                        dung = "dap_an_trac_nhiem"
                    else:
                        dung = ''
                    chi_tiet += """
                    <li class="{dung}"><div>{da.noi_dung}</div></li>
                    """.format(da=da, dung=dung)
                chi_tiet += "</ol>"

    if cau_truc['so_dt'] > 0:
        chi_tiet += "<b><u>Phần:</u> Điền từ</u></b><br>"
        for index, cau_hoi in enumerate(CauHoi.objects.filter(id__in=cau_truc['ds_ch'], dang="Điền từ")):
            if cau_hoi.the_loai == CauHoi.TEXT:
                dinh_kem = ''
            else:
                dinh_kem = """<br><img src="/media/{}" style="margin: 1em;width:80%">""".format(cau_hoi.dinh_kem)
            chi_tiet += """
                <b>Câu {index} ({cau_hoi.so_diem} điểm)</b>
                {dinh_kem}
                {cau_hoi.noi_dung}
                <ol type="1">
            """.format(cau_hoi=cau_hoi, index=index + 1, dinh_kem=dinh_kem)
            for da in cau_hoi.dap_an.all():
                chi_tiet += """
                <li class="dap_an_dien_tu" >{da.noi_dung}</li>
                """.format(da=da)
            chi_tiet += "</ol>"

    if cau_truc['so_tl'] > 0:
        chi_tiet += "<b><u>Phần:</u> Tự luận</u></b><br>"
        for index, cau_hoi in enumerate(CauHoi.objects.filter(id__in=cau_truc['ds_ch'], dang="Tự luận")):
            if cau_hoi.the_loai == CauHoi.TEXT:
                dinh_kem = ''
            else:
                dinh_kem = """<br><img src="/media/{}" style="margin: 1em; width:80%">""".format(cau_hoi.dinh_kem)
            if cau_hoi.co_cau_hoi_nho:
                chi_tiet += """
                    <b>Câu {index} ({cau_hoi.so_diem} điểm)</b>
                    {dinh_kem}
                    {cau_hoi.noi_dung}
                    <ol type='a'>
                """.format(cau_hoi=cau_hoi, index=index + 1, dinh_kem=dinh_kem)
                for ch in cau_hoi.cau_hoi_nho.all():
                    chi_tiet += "<li>{}</li>".format(ch.noi_dung)
                chi_tiet += "</ol>"
            else:
                chi_tiet += """
                    <b>Câu {index} ({cau_hoi.so_diem} điểm)</b>
                    {dinh_kem}
                    {cau_hoi.noi_dung}
                """.format(cau_hoi=cau_hoi, index=index + 1, dinh_kem=dinh_kem)
    return HttpResponse(chi_tiet)


@gv_authenticate
def exam_create_manual(request):
    if request.method == 'POST':
        De.objects.create(mon_id=request.POST['mon'],
                          thoi_gian=request.POST['thoi_gian'],
                          giao_vien_tao=request.user,
                          ky_hoc=request.POST['ky_hoc'],
                          cau_hoi_html=request.POST['de'])
        return JsonResponse({"status": "Done", "messages": 'Tạo thành công'})
    now = datetime.datetime.now()
    if now.month < 7:
        year = [now.year - 1, now.year]
    else:
        year = [now.year, now.year + 1]
    content = {
        "list_mon": request.user.mon.all(),
        "year": year,
    }
    return render(request, 'giao_vien/exam_create_manual.html', content)


@gv_authenticate
def exam_create_auto(request):
    if request.method == 'POST':
        cau_truc = json.loads(request.POST['cau_truc'])
        chi_tiet_so_luong = json.loads(request.POST['chi_tiet_so_luong'])
        mon = Mon.objects.get(id=int(request.POST['mon']))
        if request.POST['ky_hoc'] == 'Giữa kì I':
            ky_hoc = ['Giữa kì I', ]
        elif request.POST['ky_hoc'] == 'Cuối kì I':
            ky_hoc = ['Giữa kì I', 'Cuối kì I']
        elif request.POST['ky_hoc'] == 'Giữa kì II':
            ky_hoc = ['Giữa kì II', ]
        else:
            ky_hoc = ['Giữa kì I', 'Cuối kì I', "Giữa kì II", 'Cuối kì II']
        chi_tiet = ""
        for dang, chi_tiet_chu_de in chi_tiet_so_luong.items():

            if dang == "Trắc nhiệm":
                ds_tn = []
                for ten_chu_de, so_luong in chi_tiet_chu_de.items():
                    if ten_chu_de == 'Tất cả':
                        ds_chu_de = mon.chu_de.all()
                    else:
                        ds_chu_de = mon.chu_de.filter(ten=ten_chu_de)
                    if 'r_tn_d' in so_luong.keys():
                        ds_cau_hoi = CauHoi.objects.filter(mon=mon,
                                                           la_cau_hoi_nho=False,
                                                           ky_hoc__in=ky_hoc,
                                                           dang="Trắc nhiệm",
                                                           chu_de__in=ds_chu_de,
                                                           do_kho=CauHoi.DE)
                        try:
                            ds_tn.extend(random.sample(set(ds_cau_hoi), so_luong['r_tn_d']))
                        except ValueError:
                            return JsonResponse({"status": "False",
                                                 "messages": 'Không đủ câu hỏi trắc nhiệm dễ trong ngân hàng'})

                    if 'r_tn_tb' in so_luong.keys():
                        ds_cau_hoi = CauHoi.objects.filter(mon=mon,
                                                           la_cau_hoi_nho=False,
                                                           ky_hoc__in=ky_hoc,
                                                           dang="Trắc nhiệm",
                                                           chu_de__in=ds_chu_de,
                                                           do_kho=CauHoi.TRUNG_BINH)
                        try:
                            ds_tn.extend(random.sample(set(ds_cau_hoi), so_luong['r_tn_tb']))
                        except ValueError:
                            return JsonResponse({"status": "False",
                                                 "messages": 'Không đủ câu hỏi trắc nhiệm trung bình trong ngân hàng'})

                    if 'r_tn_k' in so_luong.keys():
                        ds_cau_hoi = CauHoi.objects.filter(mon=mon,
                                                           la_cau_hoi_nho=False,
                                                           ky_hoc__in=ky_hoc,
                                                           dang="Trắc nhiệm",
                                                           chu_de__in=ds_chu_de,
                                                           do_kho=CauHoi.KHO)
                        try:
                            ds_tn.extend(random.sample(set(ds_cau_hoi), so_luong['r_tn_k']))
                        except ValueError:
                            return JsonResponse({"status": "False",
                                                 "messages": 'Không đủ câu hỏi trắc nhiệm khó trong ngân hàng'})
                so_luong_tn = len(ds_tn)
                diem = round(cau_truc['r_pt_tn'] / so_luong_tn, 2)
                chi_tiet += "<b><u>Phần:</u> Trắc nhiệm</b><br>"
                for index, cau_hoi in enumerate(ds_tn):
                    if cau_hoi.co_cau_hoi_nho:
                        ds_cau_hoi_nho = cau_hoi.cau_hoi_nho.all()

                        diem_con = round(diem / len(ds_cau_hoi_nho), 2)
                        chi_tiet += """
                            <b>Câu {index} </b>({diem} điểm)
                            {cau_hoi.noi_dung}
                            <ol type='a'>
                        """.format(cau_hoi=cau_hoi, index=index + 1, diem=diem)
                        for ch in ds_cau_hoi_nho:
                            chi_tiet += "<li><div>({diem} điểm){}<ol type='A'>".format(ch.noi_dung, diem=diem_con)
                            for k, da in enumerate(ch.dap_an.all()):
                                if da.dung:
                                    dung = "dap_an_trac_nhiem"
                                else:
                                    dung = ""
                                chi_tiet += """
                                <li class={dung}><div>{da.noi_dung}</div></li>
                                """.format(da=da, dung=dung)

                            chi_tiet += "</ol></div></li>"
                        chi_tiet += "</ol>"
                    else:
                        chi_tiet += """
                            <b>Câu {index} </b>({diem} điểm)
                            {cau_hoi.noi_dung}
                            <ol type='A'>
                        """.format(cau_hoi=cau_hoi, index=index + 1, diem=diem)
                        for k, da in enumerate(cau_hoi.dap_an.all()):
                            if da.dung:
                                dung = "dap_an_trac_nhiem"
                            else:
                                dung = ""
                            chi_tiet += """
                            <li class={dung}><div>{da.noi_dung}</div></li>
                            """.format(da=da, dung=dung)
                        chi_tiet += "</ol>"

            elif dang == "Điền từ":
                ds_dt = []
                for i in range(0, len(chi_tiet_chu_de['Chủ đề'])):
                    if chi_tiet_chu_de['Chủ đề'][i] == 'Tất cả':
                        ds_chu_de = mon.chu_de.all()
                    else:
                        ds_chu_de = mon.chu_de.filter(ten=chi_tiet_chu_de['Chủ đề'][i])
                    ds_ch_dt = CauHoi.objects.filter(mon=mon,
                                                     la_cau_hoi_nho=False,
                                                     ky_hoc__in=ky_hoc,
                                                     dang="Điền từ",
                                                     chu_de__in=ds_chu_de,
                                                     do_kho=chi_tiet_chu_de['Độ khó'][i],
                                                     so_diem=chi_tiet_chu_de['Điểm'][i])
                    if len(ds_ch_dt) == 0:
                        return JsonResponse({"status": "False",
                                             "messages": 'Không đủ câu hỏi điền từ trong ngân hàng'})
                    cau_hoi = random.choice(ds_ch_dt)
                    count = 1
                    while count < 10 and cau_hoi in ds_dt:
                        cau_hoi = random.choice(ds_ch_dt)
                        count += 1
                    if cau_hoi in ds_dt:
                        return JsonResponse({"status": "False",
                                             "messages": 'Không đủ câu hỏi điền từ trong ngân hàng'})
                    ds_dt.append(cau_hoi)

                chi_tiet += "<b><u>Phần:</u> Điền từ</u></b><br>"
                for index, cau_hoi in enumerate(ds_dt):
                    chi_tiet += """
                        <b>Câu {index} ({cau_hoi.so_diem} điểm)</b>
                        {cau_hoi.noi_dung}
                        <ol type="1">
                    """.format(cau_hoi=cau_hoi, index=index + 1)
                    for da in cau_hoi.dap_an.all():
                        chi_tiet += """
                        <li class="dap_an_dien_tu" >{da.noi_dung}</li>
                        """.format(da=da)
                    chi_tiet += '</ol>'
            else:
                ds_tl = []
                for i in range(0, len(chi_tiet_chu_de['Chủ đề'])):
                    if chi_tiet_chu_de['Chủ đề'][i] == 'Tất cả':
                        ds_chu_de = mon.chu_de.all()
                    else:
                        ds_chu_de = mon.chu_de.filter(ten=chi_tiet_chu_de['Chủ đề'][i])
                    ds_ch_tl = CauHoi.objects.filter(mon=mon,
                                                     la_cau_hoi_nho=False,
                                                     ky_hoc__in=ky_hoc,
                                                     dang="Tự luận",
                                                     chu_de__in=ds_chu_de,
                                                     do_kho=chi_tiet_chu_de['Độ khó'][i],
                                                     so_diem=chi_tiet_chu_de['Điểm'][i])
                    if len(ds_ch_tl) == 0:
                        return JsonResponse({"status": "False",
                                             "messages": 'Không đủ câu hỏi tự luận trong ngân hàng'})
                    cau_hoi = random.choice(ds_ch_tl)
                    count = 1
                    while count < 10 and cau_hoi in ds_tl:
                        cau_hoi = random.choice(ds_ch_tl)
                        count += 1
                    if cau_hoi in ds_tl:
                        return JsonResponse({"status": "False",
                                             "messages": 'Không đủ câu hỏi tự luận trong ngân hàng'})
                    ds_tl.append(cau_hoi)

                chi_tiet += "<b><u>Phần:</u> Tự luận</u></b><br>"
                for index, cau_hoi in enumerate(ds_tl):
                    if cau_hoi.co_cau_hoi_nho:
                        chi_tiet += """
                                    <b>Câu {index} ({cau_hoi.so_diem} điểm)</b>
                                    {cau_hoi.noi_dung}
                                    <ol type='a'>
                                """.format(cau_hoi=cau_hoi, index=index + 1)
                        for ch in cau_hoi.cau_hoi_nho.all():
                            chi_tiet += "<li>{}</li>".format(ch.noi_dung)
                        chi_tiet += "</ol>"
                    else:
                        chi_tiet += """
                                    <b>Câu {index} ({cau_hoi.so_diem} điểm)</b>
                                    {cau_hoi.noi_dung}
                                """.format(cau_hoi=cau_hoi, index=index + 1)

        cau_hoi_html = """
        <div class="row" id="tieude" style="text-align:center">
                <div class="col-md-4">
                    <h5><b>{user.truong.ten}</b></h5>
                </div>
                <div class="col-md-2">
                </div>
                <div class="col-md-6">
                    <h5><b id="exam_name">Khảo sát chất lượng {ky_hoc}</b></h5>
                    <h5><b id="exam_year">Năm học {nam_hoc}</b></h5>
                    <b id="exam_subject">Môn : {mon.ten_dai} </b><i id="exam_time">(Thời gian làm bài {thoi_gian})
                    </i>
                </div>
            </div>
            <div class="row">
                <div class="col-md-2">
                </div>
                <div class="col-md-7">
                    <p>Họ tên học sinh: ............................................................................
                    </p>
                </div>
                <div class="col-md-3">
                    <p>Lớp:............</p>
                </div>
            </div>
            <div class="row">
                <table class="exam_table">
                    <tr>
                        <td width="40%">Chữ kí của giám thị 1</td>
                        <td width="40%">Chữ kí của giám thị 2</td>
                        <td width="20%">Số Phách</td>
                    </tr>
                </table>
                <table class="exam_table">
                    <tr>
                        <td width="20%">Điểm bằng số</td>
                        <td width="20%">Điểm bằng chữ</td>
                        <td width="40%">Chữ kí của giáo viên</td>
                        <td width="20%">Số Phách</td>
                    </tr>
                </table>
                <div>
                    <b style="float: left;"><u>Đề bài</u></b>
                </div>
            </div>
            <div id="3_con" class="exam_body">
                {chi_tiet}
            </div>
        """.format(user=request.user,
                   ky_hoc=request.POST['ky_hoc'].lower(),
                   nam_hoc=request.POST['nam_hoc'],
                   mon=mon,
                   thoi_gian=request.POST['thoi_gian'],
                   chi_tiet=chi_tiet)
        De.objects.create(mon=mon,
                          thoi_gian=request.POST['thoi_gian'],
                          giao_vien_tao=request.user,
                          ky_hoc=request.POST['ky_hoc'],
                          cau_hoi_html=cau_hoi_html)
        return JsonResponse({"status": "Done", "messages": 'Tạo thành công'})
    now = datetime.datetime.now()
    if now.month < 7:
        year = [now.year - 1, now.year]
    else:
        year = [now.year, now.year + 1]
    content = {
        "list_mon": request.user.mon.all(),
        "year": year,
    }
    return render(request, 'giao_vien/exam_create_auto.html', content)


@gv_authenticate
def exam_list(request):
    if request.method == "POST":
        try:
            de = De.objects.get(id=request.POST['id_xoa'])
        except ObjectDoesNotExist:
            return JsonResponse({"status": "False", "messages": 'Không tìm thấy'})
        if de.giao_vien_tao != request.user:
            return JsonResponse({"status": "False", "messages": 'Chỉ người tạo mới có quyền xóa'})
        de.delete()
        return JsonResponse({"status": "Done", "messages": 'Xóa thành công'})
    content = {
        "list_mon": request.user.mon.all(),
    }
    return render(request, 'giao_vien/exam_list.html', content)


@gv_authenticate
def exam_list_data(request, id):
    if id == 0:
        ds_de = De.objects.filter(mon__in=request.user.mon.all())
    else:
        ds_de = De.objects.filter(mon=Mon.objects.get(id=id))
    data = []
    for de in ds_de:
        mon = '<p id="mon_{de.id}">{de.mon.ten_dai}</p>'.format(de=de)
        thoi_gian = '<p id="thoi_gian_{de.id}">{de.thoi_gian}</p>'.format(de=de)
        ky_hoc = '<p id="ky_hoc_{de.id}">{de.ky_hoc}</p>'.format(de=de)
        thoi_gian_tao = '<p id="thoi_gian_tao_{cau_hoi.id}">{thoi_gian_tao}' \
                        '</p>'.format(cau_hoi=de, thoi_gian_tao=str(de.thoi_gian_tao)[:-16])
        giao_vien_tao = '<p id="giao_vien_tao_{de.id}">{de.giao_vien_tao.ho_ten}</p>'.format(de=de)
        data.append([mon, giao_vien_tao, thoi_gian_tao, thoi_gian, ky_hoc])
    return JsonResponse({"data": data})


@gv_authenticate
def exam_detail(request, id):
    de = get_object_or_404(De, pk=id)
    return HttpResponse(de.cau_hoi_html)


@gv_authenticate
def profile(request):
    if request.method == 'POST':
        user = request.user
        # chỉnh sửa thông tin
        if 'ho_ten' in request.POST:
            if check_password(request.POST['password'], user.password):
                user.ho_ten = request.POST['ho_ten']
                if request.POST['gioi_tinh'] == 'nu':
                    user.gioi_tinh = GiaoVien.NU
                else:
                    user.gioi_tinh = GiaoVien.NAM
                user.save()
                return JsonResponse({"status": "Done", "messages": 'Cập nhật thành công'})
            else:
                return JsonResponse({"status": "False", "messages": 'Mật khẩu không đúng'})
        # chỉnh sửa pass
        else:
            if check_password(request.POST['pass1'], user.password):
                user.set_password(request.POST['pass2'])
                user.save()
                return JsonResponse({"status": "Done", "messages": reverse('chung:login')})
            else:
                return JsonResponse({"status": "False", "messages": 'Mật khẩu không đúng'})
    return render(request, 'giao_vien/profile.html')

