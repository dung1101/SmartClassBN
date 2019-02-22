$(document).ready(function(){
    var table_mon = $('#list_mon').DataTable({
        ajax: {
            type: "GET",
            url: window.location.href + "_list",
            contentType: "application/json; charset=utf-8",
            data: function(result){
                return JSON.stringify(result);
            },
        },
        columnDefs: [
            { width: "40%", targets: 0 },
            { width: "35%", targets: 1 },
            { width: "25%", targets: 2 },
        ],
        order: [[ 0, 'asc' ], [ 1, 'asc' ]],
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        displayLength: 50,
    });

    // show
    $("#new_mon").on('show.bs.modal', function(event){
        var button = $(event.relatedTarget);
        var title = button.data('title');
        $("#new_mon  input[name=kieu]").val(title);
        if (title === 'edit'){
            var id = button.data('id');
            $("#new_mon input[name=id]").val(id);
            var ten = $("#ten_"+id).text();
            $("#new_mon input[name=ten]").val(ten);
            var khoi = $("#khoi_"+id).text();
            $("#new_mon input[name=khoi]").val(khoi);
            $('#new_mon_title').html("Chỉnh sửa môn")
            $("#create_new_mon").html("Lưu chỉnh sửa");
        }else{
            $("#new_mon input[name=id]").val(0);
            $("#new_mon input[name=ten]").val("");
            $("#new_mon input[name=khoi]").val("");
            $('#new_mon_titlee').html("Tạo mới lớp")
            $("#create_new_mon").html("Tạo mới");
        }
    });

    // Tạo mới + sửa
    $('#create_new_mon').click( function(){
        var ten = $("#new_mon input[name=ten]").val();
        var khoi = $("#new_mon input[name=khoi]").val();
        var kieu = $("#new_mon  input[name=kieu]").val();
        var id = $("#new_mon  input[name=id]").val();

        if(ten == "" || khoi == ""){
            Swal.fire({
                type: 'error',
                title: 'Lỗi',
                text: 'Không được để trống',
            });
            return false;
        }

        if(khoi < 1 || khoi > 12){
            Swal.fire({
                type: 'error',
                title: 'Lỗi',
                text: 'Khối không chính xác (1-12)',
            });
            return false;
        }

        var data= {
            csrfmiddlewaretoken :$("input[name=csrfmiddlewaretoken]").val(),
            ten_moi: ten,
            khoi_moi: khoi,
            kieu: kieu,
        };
        if(kieu == 'edit'){
            data.id_sua = id;
        }

        var posting = $.post(location.href, data);
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
                    timer: 1000
                }).then((result) => {
                    table_mon.ajax.reload(null,false);
                    $("#new_mon").modal("hide");
                });
            };
        });
    });

    // Xóa
    $("#list_mon").on('click', '.del', function(){
        var id = $(this).data("id");
        Swal.fire({
          title: 'Bạn chắc chắn muốn xóa ?',
          text: "Tất cả dữ liệu về câu hỏi, đề thi thuộc bộ môn sẽ mất!",
          type: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#3085d6',
          cancelButtonColor: '#d33',
          confirmButtonText: 'Có',
          cancelButtonText: 'Không'
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
                        timer: 1000
                    }).then((result) => {
                        table_mon.ajax.reload(null,false);
                        $("#new_mon").modal("hide");
                    });
                };
            });
          }
        })
    });


});
