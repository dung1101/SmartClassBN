$(document).ready(function(){
    var table_teacher = $('#list_teacher').DataTable({
        ajax: {
            type: "GET",
            url: window.location.href + "_list",
            contentType: "application/json; charset=utf-8",
            data: function(result){
                return JSON.stringify(result);
            },
        },
        columnDefs: [
            { width: "25%", targets: 0 },
            { width: "10%", targets: 1 },
            { width: "25%", targets: 2 },
            { width: "15%", targets: 3 },
            { width: "25%", targets: 4 },
        ],
        order: [[ 0, 'asc' ], [ 1, 'asc' ]],
        lengthMenu: [[10, 25, 50, -1], [10, 25, 50, "All"]],
        displayLength: 50,
    });

    // Xử lý chọn môn
    $("#search_mon").on('input', function () {
          var val = this.value; // this của input
          if($('#ds_mon option').filter(function(){
              return this.value.toUpperCase() === val.toUpperCase(); //this của option
          }).length) {
              //this của input
              var check = true;
              $(".mon_da_chon").each(function(){
                    if($(this).data("val") == val){
                        check = false;
                        return false;
                    }
              })
              if(check){
                var element = `<li class="mon_da_chon" data-val="${this.value}">${this.value} <button class="btn btn-rounded btn-xs btn-danger">X</button></li>`;
                $("#ds_chon").append(element);
              }
              this.value = "";
          }
    });

    $("#ds_chon").on('click', '.btn-xs', function(){
        $(this).parent().remove();
    });

    // show
    $("#new_teacher").on('show.bs.modal', function(event){
        var button = $(event.relatedTarget);
        var title = button.data('title');

        if (title === 'edit'){
            $('#teacher_title').html("Chỉnh sửa giáo viên")
            var gvid = button.attr('id').split('_')[1];
            $("#new_teacher input[name=gvid]").val(gvid);

            var ho_ten = $("#ho_ten_"+gvid).text();
            $("#new_teacher input[name=ho_ten]").val(ho_ten);

            var gioi_tinh = $("#gioi_"+ gvid).text();
            if(gioi_tinh == 'Nam'){
                $('#gioi_tinh option[data-gioi_tinh="1"]').prop('selected', true);
                $('#gioi_tinh option[data-gioi_tinh="0"]').prop('selected', false);
            }else{
                $('#gioi_tinh option[data-gioi_tinh="1"]').prop('selected', false);
                $('#gioi_tinh option[data-gioi_tinh="0"]').prop('selected', true);
            }

            var username = $("#username_"+gvid).text();
            $("#new_teacher input[name=username]").val(username);
            $("#new_teacher input[name=username]").prop("readonly", true);


            $(".passwd").each(function() {
                $(this).hide();
            });

            $('#ds_chon').empty();

            $(".mon_"+gvid).each(function(){
                let element = `<li class="mon_da_chon" data-val="${$(this).text()}">${$(this).text()} <button class="btn btn-rounded btn-xs btn-danger">X</button></li>`;
                $("#ds_chon").append(element);
            })

            $("#new_teacher  input[name=kieu]").val("edit");

            $("#create_new_teacher").html("Chỉnh sửa");

        }else{
            $('#teacher_title').html("Thêm mới giáo viên")
            $("#new_teacher input[name=gvid]").val(0);
            $("#new_teacher input[name=ho_ten]").val("");
            $("#new_teacher input[name=search_mon]").val("");
            $("#new_teacher input[name=gioi_tinh]").val("");
            $("#new_teacher input[name=username]").val("");
            $("#new_teacher input[name=password]").val("");
            $("#new_teacher input[name=password2]").val("");



            $("#new_teacher input[name=username]").prop("readonly", false);
            $('#ds_chon').empty();

            $(".passwd").each(function() {
                $(this).show();
            });

            $("#new_teacher  input[name=kieu]").val("new");
            $("#create_new_teacher").html("Thêm mới");
        }
    });

    $('#create_new_teacher').click( function(){
        var kieu = $("#new_teacher  input[name=kieu]").val();
        var token = $("#new_teacher input[name=csrfmiddlewaretoken]").val();
        var ho_ten = $("#new_teacher input[name=ho_ten]").val();
        var gioi_tinh= $('#gioi_tinh option:selected').data('gioi_tinh');
        var username = $("#new_teacher input[name=username]").val();
        var password = $("#new_teacher input[name=password]").val();
        var password2 = $("#new_teacher input[name=password2]").val();
        var list_mon = [];
        $('.mon_da_chon').each(function() {
            list_mon.push($(this).data('val'));
        });

        if(ho_ten==""){
            Swal.fire({
                type: 'error',
                title: 'Lỗi',
                text: 'Không được để trống',
            });
            return false;
        }

        if(kieu == 'new'){
            if(username=="" || password==""){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: 'Không được để trống',
                });
                return false;
            }

            if(password != password2){
                Swal.fire({
                    type: 'error',
                    title: 'Lỗi',
                    text: 'Mật khẩu nhâp lại không đúng',
                });
                return false;
            }
        }
        var data = {
            'csrfmiddlewaretoken':token,
            'kieu':kieu,
            'ho_ten': ho_ten,
            'gioi_tinh': gioi_tinh,
            'list_mon': JSON.stringify(list_mon),
            'username': username,
            'password': password,
            'id': $("#new_teacher input[name=gvid]").val(),
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
                    $("#new_teacher").modal("hide");
                    table_teacher.ajax.reload(null,false);
                });
            };
        });
    });

//     Xóa
    $("#list_teacher").on('click', '.del', function(){
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
                id_xoa: id,
                kieu: 'del'
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
                        table_teacher.ajax.reload(null,false);
                        $("#new_mon").modal("hide");
                    });
                };
            });
          }
        })
    });


});
