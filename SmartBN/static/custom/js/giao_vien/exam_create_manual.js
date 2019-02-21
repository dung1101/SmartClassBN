$(document).ready(function(){
    var max_tn = 0;
    var max_dt = 0;
    var max_tl = 0;
    var chon_tn = 0;
    var chon_dt = 0;
    var chon_tl = 0;
    var so_diem_dt = 0;
    var so_diem_tl = 0;
    $("#exam_subject").text($("#gv_mon option:selected").text());
    $("#exam_time").text("(Thời gian làm bài "+ $("#thoi_gian option:selected").text() +")");
    $("#exam_subject").text("Môn: " + $("#gv_mon option:selected").text());
    $("#exam_name").text("Khảo sát chất lượng " + $("#ky_hoc option:selected").data('show'));
    $("#exam_year").text("Năm học "+$("#year_0").val()+" - "+$("#year_1").val());

    $(".so_luong").bind('keyup mouseup', function () {
        if($(this).attr("name") == 'sl_tn'){
            max_tn = parseInt($(this).val());
            $("#max_tn").html("Trắc nhiệm: "+chon_tn+ "/" + max_tn);
        }
        else if($(this).attr("name") == 'sl_dt'){
            max_dt = parseInt($(this).val());
            $("#max_dt").html("Điền từ: "+chon_dt+ "/" + max_dt);
        }
        else if($(this).attr("name") == 'sl_tl'){
            max_tl = parseInt($(this).val());
            $("#max_tl").html("Tự luận: "+chon_tl+ "/" + max_tl);
        }
    });

    var table_ques_selected = $("#list_ques_selected").DataTable({
        "searching": false,
        "scrollY": '400px',
        "scrollCollapse": true,
        "paging": false,
        "ordering": false,
    });

    $("#ck_tn").change(function() {
        if(this.checked) {
            $("input[name=sl_tn]").prop("disabled",false);
            $("input[name=pt_tn]").prop("disabled",false);
            chon_tn = 0;
            max_tn = parseInt($("input[name=sl_tn]").val());
            $("#max_tn").html("Trắc nhiệm: "+chon_tn+ "/" + max_tn);
        }
        else{
            $("input[name=sl_tn]").prop("disabled",true);
            $("input[name=pt_tn]").prop("disabled",true);
            chon_tn = 0;
            max_tn = 0;
            $("#max_tn").html("Trắc nhiệm: "+chon_tn+ "/" + max_tn);
            $(".dch").each(function(){
                if(($(this).val()).includes("Trắc nhiệm")){
                    var row = $(this).parent().parent();
                    table_ques_selected.row(row).remove().draw();
                }
            });
        }

    });

    $("#ck_dt").change(function() {
        if(this.checked) {
            $("input[name=sl_dt]").prop("disabled",false);
            $("input[name=pt_dt]").prop("disabled",false);
            chon_dt = 0;
            max_dt = parseInt($("input[name=sl_dt]").val());
            $("#max_dt").html("Điền từ: "+chon_dt+ "/" + max_dt);
        }
        else{
            $("input[name=sl_dt]").prop("disabled",true);
            $("input[name=pt_dt]").prop("disabled",true);
            chon_dt = 0;
            max_dt = 0;
            $("#max_dt").html("Điền từ: "+chon_dt+ "/" + max_dt);
            $(".dch").each(function(){
                if(($(this).val()).includes("Điền từ")){
                    var row = $(this).parent().parent();
                    table_ques_selected.row(row).remove().draw();
                }
            });
        }
    });

    $("#ck_tl").change(function() {
        if(this.checked) {
            $("input[name=sl_tl]").prop("disabled",false);
            $("input[name=pt_tl]").prop("disabled",false);
            chon_tl = 0;
            max_tl = parseInt($("input[name=sl_tl]").val());
            $("#max_tl").html("Tự luận: "+chon_tl+ "/" + max_tl);
        }
        else{
            $("input[name=sl_tl]").prop("disabled",true);
            $("input[name=pt_tl]").prop("disabled",true);
            chon_tl = 0;
            max_tl = 0;
            $("#max_tl").html("Tự luận: "+chon_tl+ "/" + max_tl);
            $(".dch").each(function(){
                if(($(this).val()).includes("Tự luận")){
                    var row = $(this).parent().parent();
                    table_ques_selected.row(row).remove().draw();
                }
            });
        }
    });

    $("#ky_hoc, #ten_de").on('change', function(){
        let text = $("#ten_de").val() +" "+ $("#ky_hoc option:selected").data("show");
        $("#exam_name").text(text);
    });

    $("#gv_mon").on('change', function(){
        $("#exam_subject").text("Môn: " + $("#gv_mon option:selected").text());
    });

    $("#thoi_gian").on('change', function(){
        $("#exam_time").text("(Thời gian làm bài "+ $("#thoi_gian option:selected").text() +")");
    });

    $("#year_0, #year_1").on('change', function(){
        $("#exam_year").text("Năm học "+$("#year_0").val()+" - "+$("#year_1").val());
    })

    var option = {
        mon : $("#gv_mon option:selected").val(),
        ky_hoc: $('#ky_hoc option:selected').val(),
        trac_nhiem: $("#ck_tn").prop("checked"),
        dien_tu: $("#ck_dt").prop("checked"),
        tu_luan: $("#ck_tl").prop("checked")
    }
    path = "/giao_vien/question_list_option_" + JSON.stringify(option);

    var table_question = $("#list_question").DataTable({
        "ajax": {
            "type": "GET",
            "url": path,
            "contentType": "application/json; charset=utf-8",
            "data": function(result){
                return JSON.stringify(result);
            },
        },
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "displayLength": 10,
        "order": [[ 3, 'desc' ]],
        "scrollCollapse": false,
    });

    $("#gv_mon, #ky_hoc, #ck_tn, #ck_dt, #ck_tl").on('change', function(){
        var id = $(this).attr("id");
        var option = {
            mon : $("#gv_mon option:selected").val(),
            ky_hoc: $('#ky_hoc option:selected').val(),
            trac_nhiem: $("#ck_tn").prop("checked"),
            dien_tu: $("#ck_dt").prop("checked"),
            tu_luan: $("#ck_tl").prop("checked")
        }
        path = "/giao_vien/question_list_option_" + JSON.stringify(option);
        table_question.ajax.url(path).load();
        if (id == 'gv_mon' || (id == 'ky_hoc')){
            table_ques_selected.clear().draw();
            chon_tn = 0;
            max_tn = 0;
            $("#max_tn").html("Trắc nhiệm: "+chon_tn+ "/" + max_tn);
            chon_dt = 0;
            max_dt = 0;
            $("#max_dt").html("Điền từ: "+chon_dt+ "/" + max_dt);
            chon_tl = 0;
            max_tl = 0;
            $("#max_tl").html("Tự luận: "+chon_tl+ "/" + max_tl);
        }
    });




    $('#list_question tbody').on( 'click', 'tr', function () {
        if (table_question.data().count() == 0){
            return false;
        }
        var id = $(this).find('td').first().text();
        $('#question_title').html('Câu hỏi #'+id);
        $.ajax({
            type: "GET",
            url: "/giao_vien/question_detail_"+id,
            success: function(data){
                $("#khung_modal").html(data);
                $("#question").modal("show");
                $("#select_question").show();
                $("#remove_question").hide();
            }
        });
    });

    $('#list_ques_selected tbody').on( 'click', 'tr', function () {
        if (table_ques_selected.data().count() == 0){
            return false;
        }
        var id = $(this).find('p').first().attr('id').split("_")[1];
        $('#question_title').html('Câu hỏi #'+id);
        $.ajax({
            type: "GET",
            url: "question_detail_"+id,
            success: function(data){
                $("#khung_modal").html(data);
                $("#question").modal("show");
                $("#select_question").hide();
                $("#remove_question").show();
            }
        });
    });

    $('#select_question').on('click', function(){
        $("#question").modal("hide");
        var modal = $(this).parent().parent();
        var id = modal.find('input[name=id]').first().val();
        var dang_cau_hoi = modal.find("input[name=dang]").first().val();
        var so_diem = modal.find("input[name=so_diem]").first().val();
        if($("#ch_"+id).text() != ""){
            Swal.fire({
                type: 'error',
                title: 'Lỗi',
                text: 'Câu hỏi đã được chọn',
            });
            return false;
        }
        if(dang_cau_hoi.includes("Trắc nhiệm")){
            if (chon_tn + 1 > max_tn){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: "Vượt quá số lượng câu hỏi trắc nhiệm",
                });
                return false;
            }
            so_diem = 'x';
            chon_tn += 1;
            $("#max_tn").html("Trắc nhiệm: "+chon_tn+ "/" + max_tn);
        }
        else if(dang_cau_hoi.includes("Điền từ")){
            let phan_tram = $("input[name='pt_dt']").val();
            let max = phan_tram;
            let diem = parseInt(so_diem_dt) + parseInt(so_diem);
            if ( diem > max){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: "Vượt quá số điểm câu hỏi điền từ " + diem + " điểm/" + max+ " điểm",
                });
                return false;
            }
            so_diem_dt += parseInt(so_diem);
            if (chon_dt + 1 > max_dt){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: "Vượt quá số lượng câu hỏi điền từ",
                });
                return false;
            }
            chon_dt += 1;
            $("#max_dt").html("Điền từ: "+chon_dt+ "/" + max_dt);
        }
        else if(dang_cau_hoi.includes("Tự luận")){
            let phan_tram = $("input[name='pt_tl']").val();
            let max = phan_tram;
            let diem = parseInt(so_diem_tl) + parseInt(so_diem);
            if (diem > max){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: "Vượt quá số điểm câu hỏi tự luận " + diem + " điểm/" + max+ " điểm",
                });
                return false;
            }
            so_diem_tl += parseInt(so_diem);
            if (chon_tl + 1 > max_tl){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: "Vượt quá số lượng câu hỏi tự luận",
                });
                return false;
            }
            chon_tl += 1;
            $("#max_tl").html("Tự luận: "+chon_tl+ "/" + max_tl);
        }
        var content = `
        <p id="ch_${id}">(${id}) ${dang_cau_hoi} ${so_diem} điểm</p>
        <input type="hidden" class="dch" value="${dang_cau_hoi}">
        `
        table_ques_selected.row.add([content]).draw();

//        $("#so_luong").html(table_ques_selected.data().count());
//        update_review();
    })

    $('#remove_question').on('click', function(){
        $("#question").modal("hide");
        var modal = $(this).parent().parent();
        var id = modal.find('input[name=id]').first().val();
        var dang_cau_hoi = modal.find("input[name=dang]").first().val();
        var so_diem = modal.find("input[name=so_diem]").first().val();
        var row = $("#ch_"+id).parent().parent();
        table_ques_selected.row(row).remove().draw();
        if(dang_cau_hoi.includes("Trắc nhiệm")){
            chon_tn -= 1;
            $("#max_tn").html("Trắc nhiệm: "+chon_tn+ "/" + max_tn);
        }
        else if(dang_cau_hoi.includes("Điền từ")){
            chon_dt -= 1;
            $("#max_dt").html("Điền từ: "+chon_dt+ "/" + max_dt);
            so_diem_dt -= so_diem;
        }
        else if(dang_cau_hoi.includes("Tự luận")){
            chon_tl -= 1;
            $("#max_tl").html("Điền từ: "+chon_tl+ "/" + max_tl);
            so_diem_tl -= so_diem;
        }
    })

    setTimeout(function(){
        $('#wizard').find('.buttonFinish').first().click(function(){
            if(!$("input[name='pt_dt']").prop('disabled')){
                var max_diem_dt = $("input[name='pt_dt']").val();
                if(so_diem_dt < max_diem_dt){
                    Swal.fire({
                        type: 'error',
                        title: 'Lỗi',
                        text: "Số điểm câu hỏi điền từ chưa đủ "+ so_diem_dt + " điểm/" + max_diem_dt+ " điểm",
                    });
                    return false;
                }
                else if(so_diem_dt > max_diem_dt){
                    Swal.fire({
                        type: 'error',
                        title: 'Lỗi',
                        text: "Số điểm câu hỏi điền từ thừa" + so_diem_dt + " điểm/" + max_diem_dt+ " điểm",
                    });
                    return false;
                }

            }

            if(!$("input[name='pt_dt']").prop('disabled')){
                var max_diem_tl = $("input[name='pt_tl']").val();
                if(so_diem_tl < max_diem_tl){
                    Swal.fire({
                        type: 'error',
                        title: 'Lỗi',
                        text: "Số điểm câu hỏi tự luận chưa đủ " + so_diem_tl + " điểm/" + max_diem_tl+ " điểm",
                    });
                    return false;
                }
                else if(so_diem_tl > max_diem_tl){
                    Swal.fire({
                        type: 'error',
                        title: 'Lỗi',
                        text: "Số điểm câu hỏi tự luận thừa " + so_diem_tl + " điểm/" + max_diem_tl+ " điểm",
                    });
                    return false;
                }

            }

            if (chon_tn < max_tn){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: "Chưa đủ số lượng câu hỏi trắc nhiệm",
                });
                return false;
            }
            else if (chon_tn > max_tn){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: "Quá số lượng câu hỏi trắc nhiệm",
                });
                return false;
            }
            if (chon_dt < max_dt){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: "Chưa đủ số lượng câu hỏi điền từ",
                });
                return false;
            }
            else if (chon_dt > max_dt){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: "Quá số lượng câu hỏi điền từ",
                });
                return false;
            }
            if (chon_tl < max_tl){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: "Chưa đủ số lượng câu hỏi tự luận",
                });
                return false;
            }
            else if (chon_tl > max_tl){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: "Quá số lượng câu hỏi tự luận",
                });
                return false;
            }
            var token = $("input[name=csrfmiddlewaretoken]").val();
            var ten_de = $('input[name=ten_de]').val();
            if(ten_de == ''){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: "Chưa đặt tên",
                });
                return false;
            }
            var mon = $('#gv_mon option:selected').val();
            var cau_truc = {};
            var pham_tram = 0;
            $(".phan_tram").each(function(){
                if(typeof($(this).attr("disabled")) == 'undefined'){
                    cau_truc[$(this).attr('name')] = parseInt($(this).val());
                    pham_tram += parseInt($(this).val());
                }
                else{
                    cau_truc[$(this).attr('name')] = (-1);
                }
            });
            if(pham_tram != 10){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: "Tổng điểm phải đủ 10",
                });
                return false;
            }
            if(jQuery.inArray(0, cau_truc) != -1){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: "Chưa chọn điểm số",
                });
                return false;
            }
            var so_luong = 0;
            var chi_tiet_so_luong = {}
            $(".so_luong").each(function(){
                if(typeof($(this).attr("disabled")) == 'undefined'){
                    chi_tiet_so_luong[$(this).attr('name')] = parseInt($(this).val());
                    so_luong += parseInt($(this).val());
                }
                else{
                    chi_tiet_so_luong[$(this).attr('name')] = (-1);
                }
            });
            if(jQuery.inArray(0, chi_tiet_so_luong) != -1){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: "Chưa chọn số lượng câu hỏi",
                });
                return false;
            }
            var list_ques = [];
            $('#list_ques_selected tbody tr').each(function(){
                list_ques.push($(this).find('p').first().attr('id').split('_')[1]+'_'+$(this).find('input[name=don]').first().val());
            });
            var btn = $(this)
            btn.prop('disabled', true);
            $.ajax({
                 type:'POST',
                 url:location.href,
                 data:{
                    'csrfmiddlewaretoken': token,
                    'mon':mon,
                    'thoi_gian': $('#thoi_gian option:selected').text(),
                    'ky_hoc': $("#ky_hoc option:selected").text(),
                    'de': $("#step-3").html(),
                 },
                 success: function(msg, status, jqXHR){
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
                            location.reload();
                            btn.prop('disabled', false);
                        });
                    };
                 },
            });
        });
        $('#wizard').find('.buttonNext').first().click(function(){
            if ($("#step-2").css('display') == 'block'){
                if(table_ques_selected.data().count() > 0){
                    let cau_truc = {
                        so_tn: max_tn,
                        so_dt: max_dt,
                        so_tl: max_tl,
                    }
                    $(".phan_tram").each(function(){
                        if(typeof($(this).attr("disabled")) == 'undefined'){
                            cau_truc[$(this).attr('name')] = parseInt($(this).val());
                        }
                        else{
                            cau_truc[$(this).attr('name')] = (-1);
                        }
                    });
                    var ds_ch = [];
                    $('#list_ques_selected tbody tr').each(function(){
                        ds_ch.push(parseInt($(this).find('p').first().attr('id').split('_')[1]));
                    });
                    cau_truc.ds_ch = ds_ch;
                    $.ajax({
                        type: "GET",
                        url: "/giao_vien/question_detail_review_"+JSON.stringify(cau_truc),
                        success: function(data){
                            $("#3_con").html(data);
                            setTimeout(function(){
                                $("#tab_content1 .x_content .stepContainer").innerHeight($("#3_con").outerHeight(true));
                            },500);
                        },
                    });
                }
            }

//
        });
        $("a[href='#step-3']").click(function(){
            if (table_ques_selected.data().count() > 0){
                var ds_ch = [];
                $('#list_ques_selected tbody tr').each(function(){
                    ds_ch.push($(this).find('p').first().attr('id').split('_')[1]+'_'+$(this).find('input[name=don]').first().val());
                });
                $.ajax({
                    type: "GET",
                    url: "/question_data_detail_review_"+JSON.stringify(ds_ch),
                    success: function(data){
                        $("#3_con").html(data);
                        setTimeout(function(){
                            $("#tab_content1 .x_content .stepContainer").innerHeight($("#3_con").outerHeight(true));
                        },500);
                    },
                });
            };
        });
    }, 3000);

});



