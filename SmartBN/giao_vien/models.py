from django.db import models


class ChuDe(models.Model):
    ten = models.CharField(max_length=255)

    class Meta:
        db_table = 'chu_de'


class Mon(models.Model):
    ten = models.CharField(max_length=100)
    khoi = models.IntegerField()
    chu_de = models.ManyToManyField(ChuDe, related_name='mon', through='ChuDeMon')

    class Meta:
        db_table = 'mon'


class ChuDeMon(models.Model):
    chu_de = models.ForeignKey(ChuDe, on_delete=models.CASCADE, related_name="chu_de_mon")
    mon = models.ForeignKey(Mon, on_delete=models.CASCADE, related_name="chu_de_mon")

    class Meta:
        db_table = 'chu_de_mon'


class Truong(models.Model):
    ten = models.CharField(max_length=255)

    class Meta:
        db_table = 'truong'


class GiaoVien(models.Model):
    ten = models.CharField(max_length=20)
    ho = models.CharField(max_length=20)
    ten_dem = models.CharField(max_length=20, blank=True)
    hieu_pho = models.BooleanField(default=False)
    truong = models.ForeignKey(Truong, on_delete=models.CASCADE, related_name='giao_vien')
    mon = models.ManyToManyField(Mon, related_name='giao_vien', through="GiaoVienMon")
    NAM = 'nam'
    NU = 'nữ'
    LUA_CHON_GIOI_TINH = ((NAM, 'nam'), (NU, 'nữ'))
    gioi_tinh = models.CharField(max_length=3, choices=LUA_CHON_GIOI_TINH)

    @property
    def ho_ten(self):
        """ Họ tên giáo viên """
        if self.ten_dem == '':
            return "%s %s" % (self.ho, self.ten)
        return "%s %s %s" % (self.ho, self.ten_dem, self.ten)

    class Meta:
        db_table = 'giao_vien'


class GiaoVienMon(models.Model):
    mon = models.ForeignKey(Mon, on_delete=models.CASCADE, related_name='giao_vien_mon')
    giao_vien = models.ForeignKey(GiaoVien, on_delete=models.CASCADE, related_name='giao_vien_mon')

    class Meta:
        db_table = 'giao_vien_mon'


class CauHoi(models.Model):
    mon = models.ForeignKey(Mon, on_delete=models.CASCADE, related_name='cau_hoi_mon')
    chu_de = models.ForeignKey(ChuDe, on_delete=models.CASCADE, related_name='cau_hoi_chu_de')
    giao_vien_tao = models.ForeignKey(GiaoVien, on_delete=models.CASCADE, related_name='cau_hoi_giao_vien')
    thoi_gian_tao = models.DateTimeField(auto_now_add=True)
    noi_dung = models.TextField()
    co_cau_hoi_nho = models.BooleanField(default=False)
    cau_hoi_nho = models.ManyToManyField("self",
                                         related_name='cau_hoi_nho',
                                         db_table='cau_hoi_da')
    dap_an = models.ManyToManyField("DapAn", related_name='cau_hoi_dap_an', through="DapAnCauHoi")
    GKI = "GKI"
    CKI = "CKI"
    GKII = "GKII"
    CKII = "CKII"
    LUA_CHON_KY_HOC = ((GKI, "giữa kỳ I"), (CKI, "cuối kỳ I"), (GKII, "giữa kỳ II"), (CKII, "cuối kỳ II"))
    ky_hoc = models.CharField(max_length=4, choices=LUA_CHON_KY_HOC)
    TN = "TN"
    DT = "DT"
    TL = "TL"
    LUA_CHON_DANG = ((TN, "trắc nhiệm"), (DT, "điền từ"), (TL, "tự luận"))
    dang = models.CharField(max_length=2, choices=LUA_CHON_DANG)
    TEXT = "txt"
    IMAGE = "img"
    AUDIO = "au"
    VIDEO = "vi"
    LUA_CHON_THE_LOAI = ((TEXT, "văn bản"), (IMAGE, "hình ảnh"), (AUDIO, "âm thanh"), (VIDEO, "phim"))
    the_loai = models.CharField(max_length=3, choices=LUA_CHON_THE_LOAI)
    dinh_kem = models.FileField(blank=True, upload_to='uploads/')
    DE = 'D'
    TRUNG_BINH = 'TB'
    KHO = 'K'
    LUA_CHON_DO_KHO = ((DE, "dễ"), (TRUNG_BINH, "trung bình"), (KHO, "khó"))
    do_kho = models.CharField(max_length=2, choices=LUA_CHON_DO_KHO)

    class Meta:
        db_table = 'cau_hoi'


# class CauHoiDa(models.Model):
#     cau_hoi_chinh = models.ForeignKey(CauHoi, on_delete=models.CASCADE, related_name='cau_hoi_da_chinh')
#     cau_hoi_phu = models.ForeignKey(CauHoi, on_delete=models.CASCADE, related_name='cau_hoi_da_phu')
#
#     class Meta:
#         db_table = 'cau_hoi_da'


class DapAn(models.Model):
    mon = models.ForeignKey(Mon, on_delete=models.CASCADE, related_name='cau_hoi')
    chu_de = models.ForeignKey(ChuDe, on_delete=models.CASCADE, related_name='cau_hoi')
    noi_dung = models.TextField()
    dung = models.BooleanField(default=False)

    class Meta:
        db_table = 'dap_an'


class DapAnCauHoi(models.Model):
    cau_hoi = models.ForeignKey(CauHoi, on_delete=models.CASCADE, related_name='dap_an_cau_hoi')
    dap_an = models.ForeignKey(DapAn, on_delete=models.CASCADE, related_name='dap_an_cau_hoi')

    class Meta:
        db_table = 'dap_an_cau_hoi'



