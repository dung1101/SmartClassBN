$(document).ready(function(){
    var max_tn = 0;
    var max_dt = 0;
    var max_tl = 0;
    var chon_tn = 0;
    var chon_dt = 0;
    var chon_tl = 0;

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

    var table_question = $("#list_question").DataTable({
        "ajax": {
            "type": "GET",
            "url": "/hieu_pho/question_list_" + $("#gv_mon option:selected").val() +"_"+ $('#ky_hoc option:selected').val(),
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

    $("#gv_mon, #ky_hoc").on('change', function(){
        path = "/hieu_pho/question_list_" + $("#gv_mon option:selected").val() +"_"+ $('#ky_hoc option:selected').val()
        table_question.ajax.url(path).load();
        table_ques_selected.clear().draw();
    });

    $('#list_question tbody').on( 'click', 'tr', function () {
        if (table_question.data().count() == 0){
            return false;
        }
        var id = $(this).find('td').first().text();
        $('#question_title').html('Câu hỏi #'+id);
        $.ajax({
            type: "GET",
            url: "/hieu_pho/question_detail_"+id,
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
        if($("#ch_"+id).text() != ""){
            alert("Câu hỏi đã được chọn");
            return false;
        }
        if(dang_cau_hoi.includes("Trắc nhiệm")){
            if (chon_tn + 1 > max_tn){
                alert("Vượt quá số lượng câu hỏi trắc nhiệm");
                return false;
            }
            chon_tn += 1;
            $("#max_tn").html("Trắc nhiệm: "+chon_tn+ "/" + max_tn);
        }
        else if(dang_cau_hoi.includes("Điền từ")){
            if (chon_dt + 1 > max_dt){
                alert("Vượt quá số lượng câu hỏi điền từ");
                return false;
            }
            chon_dt += 1;
            $("#max_dt").html("Điền từ: "+chon_dt+ "/" + max_dt);
        }
        else if(dang_cau_hoi.includes("Tự luận")){
            if (chon_tl + 1 > max_tl){
                alert("Vượt quá số lượng câu hỏi tự luận");
                return false;
            }
            chon_tl += 1;
            $("#max_tl").html("Tự luận: "+chon_tl+ "/" + max_tl);
        }
        var content = `
        <p id="ch_${id}">(${id})</p>
        <input type="hidden" class="dch" value="${dang_cau_hoi}">`
        table_ques_selected.row.add([content]).draw();

//        $("#so_luong").html(table_ques_selected.data().count());
//        update_review();
    })

    $('#remove_question').on('click', function(){
        $("#question").modal("hide");
        var modal = $(this).parent().parent();
        var id = modal.find('input[name=id]').first().val();
        var dang_cau_hoi = modal.find("input[name=dang]").first().val();
        var row = $("#ch_"+id).parent().parent();
        table_ques_selected.row(row).remove().draw();
        if(dang_cau_hoi.includes("Trắc nhiệm")){
            chon_tn -= 1;
            $("#max_tn").html("Trắc nhiệm: "+chon_tn+ "/" + max_tn);
        }
        else if(dang_cau_hoi.includes("Điền từ")){
            chon_dt -= 1;
            $("#max_dt").html("Điền từ: "+chon_dt+ "/" + max_dt);
        }
        else if(dang_cau_hoi.includes("Tự luận")){
            chon_tl -= 1;
            $("#max_tl").html("Điền từ: "+chon_tl+ "/" + max_tl);
        }
    })

    setTimeout(function(){
        $('#wizard').find('.buttonFinish').first().click(function(){
            if (chon_tn < max_tn){
                alert("Chưa đủ số lượng câu hỏi trắc nhiệm");
                return false;
            }
            else if (chon_tn > max_tn){
                alert("Quá số lượng câu hỏi trắc nhiệm");
                return false;
            }
            if (chon_dt < max_dt){
                alert("Chưa đủ số lượng câu hỏi điền từ");
                return false;
            }
            else if (chon_dt > max_dt){
                alert("Quá số lượng câu hỏi điền từ");
                return false;
            }
            if (chon_tl < max_tl){
                alert("Chưa đủ số lượng câu hỏi tự luận");
                return false;
            }
            else if (chon_tl > max_tl){
                alert("Quá số lượng câu hỏi tự luận");
                return false;
            }
            var token = $("input[name=csrfmiddlewaretoken]").val();
            var ten_de = $('input[name=ten_de]').val();
            if(ten_de == ''){
                alert("Chưa đặt tên");
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
            if(pham_tram != 100){
                alert("Tổng phần trăm điểm số phải đủ 100%");
                return false;
            }
            if(jQuery.inArray(0, cau_truc) != -1){
                alert("Chưa chọn phần trăm điểm số");
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
                alert("Chưa chọn số lượng câu hỏi");
                return false;
            }
            var list_ques = [];
            $('#list_ques_selected tbody tr').each(function(){
                list_ques.push($(this).find('p').first().attr('id').split('_')[1]+'_'+$(this).find('input[name=don]').first().val());
            });
            $("#processing").modal({backdrop: 'static', keyboard: false});
            var btn = $(this)
            btn.prop('disabled', true);
            $.ajax({
                xhr: function() {
                    var xhr = new window.XMLHttpRequest();
                    xhr.upload.addEventListener("progress", function(event){
                        var percent = Math.round((event.loaded / event.total) * 100) + '%';
                        $("#progressBar").attr("style","width:"+percent);
                        $("#progressBar").text(percent);
    //                    $("#loaded_n_total").html("Tải lên " + event.loaded + " bytes của " + event.total);
                    }, false);
                    $("#cancel_upload").click(function(){
                        xhr.abort();
                    });
                    btn.prop('disabled', false);
                    return xhr;
                  },
                 type:'POST',
                 url:location.href,
                 data:{'csrfmiddlewaretoken': token, 'ten_de':ten_de, 'mon':mon, 'loai_de':loai_de,
                 'list_ques':JSON.stringify(list_ques), 'cau_truc':JSON.stringify(cau_truc),
                 'so_luong': so_luong, 'chi_tiet_so_luong':JSON.stringify(chi_tiet_so_luong),
                 'thoi_gian': $('input[name=thoi_gian]').val()},
                 success: function(){
                    $("#processing").modal('hide');
                    location.reload();
                    btn.prop('disabled', false);
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
                        url: "/hieu_pho/question_detail_review_"+JSON.stringify(cau_truc),
                        success: function(data){
                            $("#3_con").html(data);
                            setTimeout(function(){
                                $("#tab_content1 .x_content .stepContainer").innerHeight($("#3_con").outerHeight(true));
                            },500);
                        },
                    });
                }
            }else if($("#step-1").css('display') == 'block'){
//                var table_question = $("#list_question").DataTable({
//                    "ajax": {
//                        "type": "GET",
//                        "url": "/hieu_pho/question_list_" + $("#gv_mon option:selected").val() +"_"+ $('#ky_thi option:selected').val(),
//                        "contentType": "application/json; charset=utf-8",
//                        "data": function(result){
//                            return JSON.stringify(result);
//                        },
//                    },
//                    "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
//                    "displayLength": 10,
//                    "order": [[ 3, 'desc' ]],
//                    "scrollCollapse": false,
//                });
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



