$(document).ready(function(){
    $("#ds_chu_de_tn").html(mon[$("#r_gv_mon option:selected").text()]);
    $("#ds_chu_de_dt").html(mon[$("#r_gv_mon option:selected").text()]);
    $("#ds_chu_de_tl").html(mon[$("#r_gv_mon option:selected").text()]);

    // thay đổi môn
    $("#r_gv_mon").change(function(){
        $("#ds_chu_de_tn").html(mon[$("#r_gv_mon option:selected").text()]);
        $("#table_tn .table_data").each(function(){
            $(this).remove();
        })

        $("#ds_chu_de_dt").html(mon[$("#r_gv_mon option:selected").text()]);
        $("#table_dt .table_data").each(function(){
            $(this).remove();
        })

        $("#ds_chu_de_tl").html(mon[$("#r_gv_mon option:selected").text()]);
        $("#table_tl .table_data").each(function(){
            $(this).remove();
        })
    });

    // chọn chủ đề cho trắc nhiệm
    $("#search_chu_de_tn").on('input', function () {
          var val = this.value; // this của input
          if($('#ds_chu_de_tn option').filter(function(){
              return this.value.toUpperCase() === val.toUpperCase(); //this của option
          }).length) {
              //this của input
              var check = true;
              $(".chu_de_tn_da_chon").each(function(){
                    if($(this).data("val") == val){
                        check = false;
                        Swal.fire({
                            type: 'error',
                            title: 'Lỗi',
                            text: 'Chủ đề đã chọn',
                        });
                        return false;
                    }
              })
              if(check){
                let html = `
                  <tr class='table_data'>
                    <td>
                        <p class="chu_de_tn_da_chon" data-val="${this.value}"><button class="btn btn-rounded btn-xs btn-danger xoa_chu_de">X</button>${this.value}</p>
                    </td>
                    <td>
                        <input type="number" class="form-control r_trac_nhiem r_so_luong" min=0 max=100 name="r_tn_d" value="0" data-chu_de='${this.value}' data-the_loai="r_pt_tn">
                    </td>
                    <td>
                        <input type="number" class="form-control r_trac_nhiem r_so_luong" min=0 max=100 name="r_tn_tb" value="0" data-chu_de='${this.value}' data-the_loai="r_pt_tn">
                    </td>
                    <td>
                        <input type="number" class="form-control r_trac_nhiem r_so_luong" min=0 max=100 name="r_tn_k" value="0" data-chu_de='${this.value}' data-the_loai="r_pt_tn">
                    </td>
                  </tr>
                  `
                  $("#table_tn").append(html);
              }
              this.value = "";
          }
    });

    // chọn chủ đề cho điền từ
    $("#search_chu_de_dt").on('input', function () {
          var val = this.value; // this của input
          if($('#ds_chu_de_dt option').filter(function(){
              return this.value.toUpperCase() === val.toUpperCase(); //this của option
          }).length) {
              //this của input
              var check = true;
              $(".chu_de_dt_da_chon").each(function(){
                    if($(this).data("val") == val){
                        check = false;
                        Swal.fire({
                            type: 'error',
                            title: 'Lỗi',
                            text: 'Chủ đề đã chọn',
                        });
                        return false;
                    }
              })
              if(check){
                let html = `
                  <tr class='table_data'>
                    <td>
                        <p class="chu_de_dt_da_chon" data-val="${this.value}"><button class="btn btn-rounded btn-xs btn-danger xoa_chu_de">X</button>${this.value}</p>
                    </td>
                    <td>
                        <input type="number" class="form-control r_dien_tu r_so_luong" min=0 max=100 name="r_dt_d" value="0" data-chu_de='${this.value}' data-the_loai="r_pt_dt">
                    </td>
                    <td>
                        <input type="number" class="form-control r_dien_tu r_so_luong" min=0 max=100 name="r_dt_tb" value="0" data-chu_de='${this.value}' data-the_loai="r_pt_dt">
                    </td>
                    <td>
                        <input type="number" class="form-control r_dien_tu r_so_luong" min=0 max=100 name="r_dt_k" value="0" data-chu_de='${this.value}' data-the_loai="r_pt_dt">
                    </td>
                  </tr>
                  `
                  $("#table_dt").append(html);
              }
              this.value = "";
          }
    });

    // chọn chủ đề cho tự luận
    $("#search_chu_de_tl").on('input', function () {
          var val = this.value; // this của input
          if($('#ds_chu_de_tl option').filter(function(){
              return this.value.toUpperCase() === val.toUpperCase(); //this của option
          }).length) {
              //this của input
              var check = true;
              $(".chu_de_tl_da_chon").each(function(){
                    if($(this).data("val") == val){
                        check = false;
                        Swal.fire({
                            type: 'error',
                            title: 'Lỗi',
                            text: 'Chủ đề đã chọn',
                        });
                        return false;
                    }
              })
              if(check){
                let html = `
                  <tr class='table_data'>
                    <td>
                        <p class="chu_de_tl_da_chon" data-val="${this.value}"><button class="btn btn-rounded btn-xs btn-danger xoa_chu_de">X</button>${this.value}</p>
                    </td>
                    <td>
                        <input type="number" class="form-control r_tu_luan r_so_luong" min=0 max=100 name="r_tl_d" value="0" data-chu_de='${this.value}' data-the_loai="r_pt_tl">
                    </td>
                    <td>
                        <input type="number" class="form-control r_tu_luan r_so_luong" min=0 max=100 name="r_tl_tb" value="0" data-chu_de='${this.value}' data-the_loai="r_pt_tl">
                    </td>
                    <td>
                        <input type="number" class="form-control r_tu_luan r_so_luong" min=0 max=100 name="r_tl_k" value="0" data-chu_de='${this.value}' data-the_loai="r_pt_tl">
                    </td>
                  </tr>
                  `
                  $("#table_tl").append(html);
              }
              this.value = "";
          }
    });

    // xóa chủ đề
    $("#tab_content2").on('click', '.xoa_chu_de', function(){
        $(this).parent().parent().parent().remove();
    });

    $("#r_tao_de").click(function () {
        var ten_de = $('input[name=r_ten_de]').val();
        if (ten_de == '') {
            Swal.fire({
                type: 'error',
                title: 'Lỗi',
                text: 'Chưa đặt tên'
            })
            return false;
        }
        var cau_truc = {};
        var pham_tram = 0;
        $(".r_phan_tram").each(function () {
            cau_truc[$(this).attr('name')] = parseInt($(this).val());
            if ($(this).val() > 0){
                pham_tram += parseInt($(this).val());
            }
        });

        if (pham_tram != 100) {
            Swal.fire({
                type: 'error',
                title: 'Lỗi',
                text: 'Tổng phần trăm điểm số phải đủ 100%'
            })
            return false;
        }

        var chi_tiet_so_luong = {};
        var so_trac_nhiem = {};
        var so_dien_tu = {};
        var so_tu_luan = {};
        var so_luong = 0;

        if(cau_truc['r_pt_tn'] > 0){
            $("#table_tn .r_so_luong").each(function(){
                if(typeof(so_trac_nhiem[$(this).data('chu_de')]) == 'undefined'){
                    so_trac_nhiem[$(this).data('chu_de')] = {};
                }
                so_trac_nhiem[$(this).data('chu_de')][$(this).attr("name")] = parseInt($(this).val());
            })
            chi_tiet_so_luong['Trắc nhiệm'] = so_trac_nhiem;
        }

        if(cau_truc['r_pt_dt'] > 0){
            $("#table_dt .r_so_luong").each(function(){
                if(typeof(so_dien_tu[$(this).data('chu_de')]) == 'undefined'){
                    so_dien_tu[$(this).data('chu_de')] = {};
                }
                so_dien_tu[$(this).data('chu_de')][$(this).attr("name")] = parseInt($(this).val());
            })
            chi_tiet_so_luong['Điền từ'] = so_dien_tu;
        }

        if(cau_truc['r_pt_tl'] > 0){
            $("#table_tl .r_so_luong").each(function(){
                if(typeof(so_tu_luan[$(this).data('chu_de')]) == 'undefined'){
                    so_tu_luan[$(this).data('chu_de')] = {};
                }
                so_tu_luan[$(this).data('chu_de')][$(this).attr("name")] = parseInt($(this).val());
            })
            chi_tiet_so_luong['Tự luận'] = so_tu_luan;
        }
        $.ajax({
            type: 'POST',
            url: location.href,
            data: {
                'csrfmiddlewaretoken': $("input[name=csrfmiddlewaretoken]").val(),
                'ten_de': ten_de,
                'mon': $('#r_gv_mon option:selected').val(),
                'cau_truc': JSON.stringify(cau_truc),
                'chi_tiet_so_luong': JSON.stringify(chi_tiet_so_luong),
                'thoi_gian': $('input[name=r_thoi_gian]').val(),
                'ky_hoc': $("#ky_hoc option:selected").text(),
                'so_de': $("#so_de").val()
            },
            success: function (msg, status, jqXHR) {
                if(msg.status == 'False'){
                    Swal.fire({
                        type: 'error',
                        title: 'Lỗi',
                        text: msg.messages,
                    });
                }
                else{
                    Swal.fire({
                        type: 'success',
                        title: 'Thành công',
                        text: msg.messages,
                        showConfirmButton: false,
                        timer: 1000
                    }).then((msg) => {
                        $("#new_teacher").modal("hide");
                    });
                };
            },
        });
    });

});



