$(document).ready(function(){
    setTimeout(function(){
        $("#ds_chu_de_tn").html(mon[$("#r_gv_mon option:selected").text()]);
        $("#ds_chu_de_dt").html(mon[$("#r_gv_mon option:selected").text()]);
        $("#ds_chu_de_tl").html(mon[$("#r_gv_mon option:selected").text()]);
    }, 1000)


    // thay đổi môn
    $("#r_gv_mon").change(function(){
        $("#ds_chu_de_tn").html(mon[$("#r_gv_mon option:selected").text()]);
        $("#table_tn .table_data").each(function(){
            $(this).remove();
        })

        $("#table_dt .cau_hoi_da_chon").each(function(){
            $(this).remove();
        })

        $("#table_tl .cau_hoi_da_chon").each(function(){
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
              if((val=="Tất cả")&&($(".chu_de_tn_da_chon").length>0)){
                    check = false;
                    Swal.fire({
                        type: 'error',
                        title: 'Lỗi',
                        text: 'Chọn chủ đề tất cả thì không thể chọn thêm chủ đề',
                    });
              }
              $(".chu_de_tn_da_chon").each(function(){
                    if($(this).data("val")=="Tất cả"){
                        check = false;
                        Swal.fire({
                            type: 'error',
                            title: 'Lỗi',
                            text: 'Chọn chủ đề tất cả thì không thể chọn thêm chủ đề',
                        });
                        return false;
                    }
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
              if((val=="Tất cả")&&($(".chu_de_dt_da_chon").length>0)){
                    check = false;
                    Swal.fire({
                        type: 'error',
                        title: 'Lỗi',
                        text: 'Chọn chủ đề tất cả thì không thể chọn thêm chủ đề',
                    });
              }
              $(".chu_de_dt_da_chon").each(function(){
                    if($(this).data("val")=="Tất cả"){
                        check = false;
                        Swal.fire({
                            type: 'error',
                            title: 'Lỗi',
                            text: 'Chọn chủ đề tất cả thì không thể chọn thêm chủ đề',
                        });
                        return false;
                    }
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

    //
    $("#so_luong_dt").on('change', function(){
        var sl = parseInt($(this).val());
        if(sl < 0){
            Swal.fire({
                type: "warning",
                title: "Cảnh báo",
                text: "Số lượng câu hỏi phải >= 1"
            })
            $(this).val(1);
            sl = 1;
        }
        var chu_de = mon[$("#r_gv_mon option:selected").text()];
        $("#table_dt .cau_hoi_da_chon").remove();
        for(let i=1;i<sl+1;i++){
            var html = `
            <tr class="cau_hoi_da_chon">
                <td>${i}</td>
                <td>
                    <select class="form-control chu_de_dt_chon">
                        ${chu_de}
                    </select>
                </td>
                <td>
                    <select class="form-control do_kho_dt_chon">
                        <option>Dễ</option>
                        <option>Trung bình</option>
                        <option>Khó</option>
                    </select>
                </td>
                <td>
                    <input type="number" class="form-control diem_dt_chon" value="1" min="0.25" max="10" step="0.25">
                </td>
            </tr>
            `
            $("#table_dt").append(html);
        }
    })

    // chọn chủ đề cho tự luận
    $("#so_luong_tl").on('change', function(){
        var sl = parseInt($(this).val());
        if(sl < 0){
            Swal.fire({
                type: "warning",
                title: "Cảnh báo",
                text: "Số lượng câu hỏi phải >= 1"
            })
            $(this).val(1);
            sl = 1;
        }
        var chu_de = mon[$("#r_gv_mon option:selected").text()];
        $("#table_tl .cau_hoi_da_chon").remove();
        for(let i=1;i<sl+1;i++){
            var html = `
            <tr class="cau_hoi_da_chon">
                <td>${i}</td>
                <td>
                    <select class="form-control chu_de_tl_chon">
                        ${chu_de}
                    </select>
                </td>
                <td>
                    <select class="form-control do_kho_tl_chon">
                        <option>Dễ</option>
                        <option>Trung bình</option>
                        <option>Khó</option>
                    </select>
                </td>
                <td>
                    <input type="number" class="form-control diem_tl_chon" value="1" min="0.25" max="10" step="0.25">
                </td>
            </tr>
            `
            $("#table_tl").append(html);
        }
    })

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

        if (pham_tram != 10) {
            Swal.fire({
                type: 'error',
                title: 'Lỗi',
                text: 'Tổng điểm phải đủ 10'
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
            if($("#so_luong_dt").val() <=0){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: 'Chưa chọn số lượng câu hỏi điền từ'
                })
                return false;
            }
            so_dien_tu['Chủ đề'] = [];
            $("#table_dt .chu_de_dt_chon").each(function(){
                so_dien_tu["Chủ đề"].push($(this).find("option:selected").first().val());
            })
            so_dien_tu['Độ khó'] = [];
            $("#table_dt .do_kho_dt_chon").each(function(){
                so_dien_tu["Độ khó"].push($(this).find("option:selected").first().val());
            })
            so_dien_tu['Điểm'] = [];
            let diem = 0;
            $("#table_dt .diem_dt_chon").each(function(){
                so_dien_tu["Điểm"].push(parseFloat($(this).val()));
                diem += parseFloat($(this).val());
            })
            if(diem != cau_truc['r_pt_dt']){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: 'Số điểm điền từ không bẳng số quy định'
                })
                return false;
            }
            chi_tiet_so_luong['Điền từ'] = so_dien_tu;
        }

        if(cau_truc['r_pt_tl'] > 0){
            if($("#so_luong_tl").val() <=0){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: 'Chưa chọn số lượng câu hỏi tự luận'
                })
                return false;
            }
            so_tu_luan['Chủ đề'] = [];
            $("#table_tl .chu_de_tl_chon").each(function(){
                so_tu_luan["Chủ đề"].push($(this).find("option:selected").first().val());
            })
            so_tu_luan['Độ khó'] = [];
            $("#table_tl .do_kho_tl_chon").each(function(){
                so_tu_luan["Độ khó"].push($(this).find("option:selected").first().val());
            })
            so_tu_luan['Điểm'] = [];
            let diem = 0;
            $("#table_tl .diem_tl_chon").each(function(){
                so_tu_luan["Điểm"].push(parseFloat($(this).val()));
                diem += parseFloat($(this).val());
            })
            console.log(diem, cau_truc['r_pt_tl']);
            if(diem != cau_truc['r_pt_tl']){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: 'Số điểm tự luận không bẳng số quy định'
                })
                return false;
            }
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
                'thoi_gian': $('#r_thoi_gian option:selected').text(),
                'ky_hoc': $("#ky_hoc option:selected").text(),
                'so_de': $("#so_de").val(),
                'nam_hoc': $("#year_0").val() + " - " + $("#year_1").val()
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
                        window.location.reload();
                    });
                };
            },
        });
    });

});



