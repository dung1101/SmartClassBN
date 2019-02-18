from django.contrib.auth.base_user import AbstractBaseUser, BaseUserManager
from django.db import models


class ChuDe(models.Model):
    ten = models.CharField(max_length=255)

    class Meta:
        db_table = 'chu_de'


class Mon(models.Model):
    ten = models.CharField(max_length=100)
    khoi = models.IntegerField()
    chu_de = models.ManyToManyField(ChuDe, related_name='mon_chu_de', db_table='chu_de_mon')

    @property
    def ten_dai(self):
        """ Tên đầy đủ"""
        return "{mon.ten} - {mon.khoi}".format(mon=self)

    class Meta:
        db_table = 'mon'


# class ChuDeMon(models.Model):
#     chu_de = models.ForeignKey(ChuDe, on_delete=models.CASCADE, related_name="chu_de_mon")
#     mon = models.ForeignKey(Mon, on_delete=models.CASCADE, related_name="chu_de_mon")
#
#     class Meta:
#         db_table = 'chu_de_mon'


class Truong(models.Model):
    ten = models.CharField(max_length=255)

    class Meta:
        db_table = 'truong'


class GiaoVienManager(BaseUserManager):
    def create(self, username, password, ho_ten, truong, gioi_tinh, hieu_pho=False):
        giao_vien = self.model(
            username=username,
            ho_ten=ho_ten,
            hieu_pho=hieu_pho,
            truong=truong,
            gioi_tinh=gioi_tinh,
        )
        giao_vien.set_password(password)
        giao_vien.save(using=self._db)
        return giao_vien


class GiaoVien(AbstractBaseUser):
    username = models.CharField(max_length=20, unique=True)
    ho_ten = models.CharField(max_length=100)
    hieu_pho = models.BooleanField(default=False)
    truong = models.ForeignKey(Truong, on_delete=models.CASCADE, related_name='giao_vien_truong')
    mon = models.ManyToManyField(Mon, related_name='giao_vien_mon', db_table="giao_vien_mon")
    NAM = 'nam'
    NU = 'nữ'
    LUA_CHON_GIOI_TINH = ((NAM, 'nam'), (NU, 'nữ'))
    gioi_tinh = models.CharField(max_length=3, choices=LUA_CHON_GIOI_TINH)

    objects = GiaoVienManager()
    USERNAME_FIELD = 'username'

    class Meta:
        db_table = 'giao_vien'


# class GiaoVienMon(models.Model):
#     mon = models.ForeignKey(Mon, on_delete=models.CASCADE, related_name='giao_vien_mon')
#     giao_vien = models.ForeignKey(GiaoVien, on_delete=models.CASCADE, related_name='giao_vien_mon')
#
#     class Meta:
#         db_table = 'giao_vien_mon'


class CauHoi(models.Model):
    mon = models.ForeignKey(Mon, on_delete=models.CASCADE, related_name='cau_hoi_mon', related_query_name='cau_hoi_mon')
    chu_de = models.ForeignKey(ChuDe, on_delete=models.CASCADE, related_name='cau_hoi_chu_de')
    giao_vien_tao = models.ForeignKey(GiaoVien, on_delete=models.CASCADE, related_name='cau_hoi_giao_vien')
    thoi_gian_tao = models.DateTimeField(auto_now_add=True)
    noi_dung = models.TextField()
    so_diem = models.FloatField(null=True)
    co_cau_hoi_nho = models.BooleanField(default=False)
    la_cau_hoi_nho = models.BooleanField(default=False)
    cau_hoi_nho = models.ManyToManyField("self", related_name='cau_hoi_nho', db_table='cau_hoi_da')
    dap_an = models.ManyToManyField("DapAn", related_name='cau_hoi_dap_an', db_table="dap_an_cau_hoi")
    GKI = "Giữa kỳ I"
    CKI = "Cuối kỳ I"
    GKII = "Giữa kỳ II"
    CKII = "Cuối kỳ II"
    LUA_CHON_KY_HOC = ((GKI, "Giữa kỳ I"), (CKI, "Cuối kỳ I"), (GKII, "Giữa kỳ II"), (CKII, "Cuối kỳ II"))
    ky_hoc = models.CharField(max_length=20, choices=LUA_CHON_KY_HOC)
    TN = "Trắc nhiệm"
    DT = "Điền từ"
    TL = "Tự luận"
    LUA_CHON_DANG = ((TN, "Trắc nhiệm"), (DT, "Điền từ"), (TL, "Tự luận"))
    dang = models.CharField(max_length=20, choices=LUA_CHON_DANG)
    TEXT = "Văn bản"
    IMAGE = "Hình ảnh"
    AUDIO = "Âm thanh"
    VIDEO = "Phim"
    LUA_CHON_THE_LOAI = ((TEXT, "Văn bản"), (IMAGE, "Hình ảnh"), (AUDIO, "Âm thanh"), (VIDEO, "Phim"))
    the_loai = models.CharField(max_length=20, choices=LUA_CHON_THE_LOAI)
    dinh_kem = models.FileField(blank=True, upload_to='uploads/')
    DE = 'Dễ'
    TRUNG_BINH = 'Trung bình'
    KHO = 'Khó'
    LUA_CHON_DO_KHO = ((DE, "Dễ"), (TRUNG_BINH, "Trung bình"), (KHO, "Khó"))
    do_kho = models.CharField(max_length=20, choices=LUA_CHON_DO_KHO)

    class Meta:
        db_table = 'cau_hoi'


# class CauHoiDa(models.Model):
#     cau_hoi_chinh = models.ForeignKey(CauHoi, on_delete=models.CASCADE, related_name='cau_hoi_da_chinh')
#     cau_hoi_phu = models.ForeignKey(CauHoi, on_delete=models.CASCADE, related_name='cau_hoi_da_phu')
#
#     class Meta:
#         db_table = 'cau_hoi_da'


class DapAn(models.Model):
    mon = models.ForeignKey(Mon, on_delete=models.CASCADE, related_name='dap_an_mon')
    chu_de = models.ForeignKey(ChuDe, on_delete=models.CASCADE, related_name='dap_an_chu_de')
    cau_hoi = models.ForeignKey(CauHoi, on_delete=models.CASCADE, related_name='dap_an_cau_hoi')
    noi_dung = models.TextField()
    dung = models.BooleanField(default=False)

    class Meta:
        db_table = 'dap_an'


# class DapAnCauHoi(models.Model):
#     cau_hoi = models.ForeignKey(CauHoi, on_delete=models.CASCADE, related_name='dap_an_cau_hoi')
#     dap_an = models.ForeignKey(DapAn, on_delete=models.CASCADE, related_name='dap_an_cau_hoi')
#
#     class Meta:
#         db_table = 'dap_an_cau_hoi'


class De(models.Model):
    mon = models.ForeignKey(Mon, on_delete=models.CASCADE, related_name='de_mon')
    thoi_gian_tao = models.DateTimeField(auto_now_add=True)
    thoi_gian = models.CharField(max_length=20)
    giao_vien_tao = models.ForeignKey(GiaoVien, on_delete=models.CASCADE, related_name='de_giao_vien')
    GKI = "Giữa kỳ I"
    CKI = "Cuối kỳ I"
    GKII = "Giữa kỳ II"
    CKII = "Cuối kỳ II"
    LUA_CHON_KY_HOC = ((GKI, "Giữa kỳ I"), (CKI, "Cuối kỳ I"), (GKII, "Giữa kỳ II"), (CKII, "Cuối kỳ II"))
    ky_hoc = models.CharField(max_length=20, choices=LUA_CHON_KY_HOC)
    cau_hoi_html = models.TextField(blank=True)
    dap_an_html = models.TextField(blank=True)

    class Meta:
        db_table = 'de'


# class ChiTietDe(models.Model):
#     cau_hoi = models.ForeignKey(CauHoi, on_delete=models.SET_NULL, null=True, related_name='chi_tiet_de_cau_hoi')
#     de = models.ForeignKey(De, on_delete=models.CASCADE, related_name='chi_tiet_de_de')
#
#     class Meta:
#         db_table = 'chi_tiet_de'





