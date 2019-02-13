$(document).ready(function(){
//    var table_mon = $('#list_chu_de').DataTable({
//        paging:   false,
//        ordering: false,
//        searching: false,
//        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
//        displayLength: 50,
//    });


//    $("#list_mon").on('click', '.btn-danger', function(){
//        var id = $(this).attr('id').split('_')[1];
//        var token = $("input[name=csrfmiddlewaretoken]").val();
//        if (confirm('Bạn có chắc ?')){
//            $.ajax({
//                type:'POST',
//                url:location.href,
//                data: {'delete':id, 'csrfmiddlewaretoken':token},
//                success: function(){
//                    table_mon.ajax.reload(null,false);
//                }
//           });
//        }
//    });
//
//    $("#new_mon").on('show.bs.modal', function(event){
//        var button = $(event.relatedTarget);
//        var title = button.data('title');
//        $("#new_mon  input[name=kieu]").val(title);
//        if (title === 'edit'){
//            var id = button.attr('id').split('_')[1];
//            $("#new_mon input[name=id]").val(id);
//            var ten = $("#ten_"+id).text();
//            $("#new_mon input[name=ten]").val(ten);
//            var lop = $("#lop_"+id).text();
//            $("#new_mon input[name=lop]").val(lop);
//            var mo_ta = $("#mota_"+id).text();
//            $("#new_mon textarea[name=mo_ta]").val(mo_ta);
//            $('#new_mon_title').html("Chỉnh sửa môn")
//            $("#create_new_mon").html("Chỉnh sửa");
//        }else{
//            $("#new_mon input[name=id]").val(0);
//            $("#new_mon input[name=ten]").val("");
//            $("#new_mon input[name=lop]").val(1);
//            $("#new_mon textarea[name=mo_ta]").val("");
//            $('#new_mon_titlee').html("Tạo mới lớp")
//            $("#create_new_mon").html("Tạo mới");
//        }
//    });
//
    // tạo mới
    $('#create_new_chu_de').click( function(){
        var ten = $("#new_chu_de textarea[name=ten]").val();

        if(ten == ""){
            Swal.fire({
                type: 'error',
                title: 'Lỗi',
                text: 'Không được để trống',
            });
            return false;
        }

        var posting = $.post(location.href, {
            csrfmiddlewaretoken :$("input[name=csrfmiddlewaretoken]").val(),
            ten_moi: ten
        });
        posting.done(function(data){
            var result = JSON.parse(JSON.stringify(data));

            if(result.status == 'False'){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: result.messages,
                });
            }
            else{
                Swal.fire({
                    type: 'success',
                    title: 'Thành công',
                    text: result.messages,
                    showConfirmButton: false,
                    timer: 2000
                }).then((result) => {
                    window.location.reload();
                });
            };
        });
    });

    // Chỉnh sửa
    $("#list_chu_de").on('click', '.edit', function(){
        var id = $(this).data("id");
        $("#val_"+id).attr("disabled",false);
        $("#save_"+id).show();
        $("#cancel_"+id).show();
        $("#del_"+id).hide();
        $(this).hide();
    });

    // Hủy chỉnh sửa
    $("#list_chu_de").on('click', '.cancel', function(){
        var id = $(this).data("id");
        var input = $("#val_"+id);
        input.val($(this).data("val"));
        input.attr("disabled",true);
        $("#save_"+id).hide();
        $("#edit_"+id).show();
        $("#del_"+id).show();
        $(this).hide();
    });

    // Lưu chỉnh sửa
    $("#list_chu_de").on('click', '.save', function(){
        var id = $(this).data("id");
        var posting = $.post(location.href, {
            csrfmiddlewaretoken :$("input[name=csrfmiddlewaretoken]").val(),
            id_sua: id,
            ten_sua: $("#val_"+id).val(),
        });
        posting.done(function(data){
            var result = JSON.parse(JSON.stringify(data));
            if(result.status == 'False'){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: result.messages,
                });
            }
            else{
                Swal.fire({
                    type: 'success',
                    title: 'Thành công',
                    text: result.messages,
                    showConfirmButton: false,
                    timer: 2000
                }).then((result) => {
                    window.location.reload();
                });
            };
        });
    });

    // Xóa
    $("#list_chu_de").on('click', '.del', function(){
        var id = $(this).data("id");
        Swal.fire({
          title: 'Cảnh báo',
          text: " Bạn chắc chắn muốn xóa ?",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Đúng',
          cancelButtonText: 'Sai'
        }).then((result) => {
          if (result.value) {
            var posting = $.post(location.href, {
                csrfmiddlewaretoken :$("input[name=csrfmiddlewaretoken]").val(),
                id_xoa: id
            });
            posting.done(function(data){
                var result = JSON.parse(JSON.stringify(data));
                if(result.status == 'False'){
                    Swal.fire({
                        type: 'error',
                        title: 'Lỗi',
                        text: result.messages,
                    });
                }
                else{
                    Swal.fire({
                        type: 'success',
                        title: 'Thành công',
                        text: result.messages,
                        showConfirmButton: false,
                        timer: 2000
                    }).then((result) => {
                        window.location.reload();
                    });
                };
            });
          }
        })
    });


});
