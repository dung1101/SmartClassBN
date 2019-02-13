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
        order: [[ 0, 'asc' ], [ 1, 'asc' ]],
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        displayLength: 50,
    });


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
            $("#create_new_mon").html("Chỉnh sửa");
        }else{
            $("#new_mon input[name=id]").val(0);
            $("#new_mon input[name=ten]").val("");
            $("#new_mon input[name=khoi]").val(1);
            $('#new_mon_titlee').html("Tạo mới lớp")
            $("#create_new_mon").html("Tạo mới");
        }
    });

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

    // Chỉnh sửa
//    $("#list_mon").on('click', '.edit', function(){
//        var id = $(this).data("id");
//        $("#new_mon").modal("show");
//        var ten = $("#ten_"+id).text();
//        $("#new_mon input[name=ten]").val(ten);
//        var khoi = $("#khoi_"+id).text();
//        $("#new_mon input[name=khoi]").val(khoi);
//        $('#new_mon_title').html("Chỉnh sửa môn")
//        $("#create_new_mon").html("Chỉnh sửa");
//    });


});
