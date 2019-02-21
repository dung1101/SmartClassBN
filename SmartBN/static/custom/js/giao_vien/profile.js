$(document).ready(function(){
    $(".gioi_tinh").change(function() {
        if(this.checked && this.name === 'nam'){
            $('#profile input[name=nu]').prop('checked', false);
        }
        else if(this.checked && this.name === 'nu'){
            $('#profile input[name=nam]').prop('checked', false);
        }
    });

    $("#save_profile").click(function(){
        var ho_ten = $("input[name='ho_ten']").val();
        var pass = $("input[name='password']").val();
        var gioi_tinh;
        $(".gioi_tinh").each(function(){
            if(this.checked){
                gioi_tinh = this.name;
            }
        })

        if( pass == "" || ho_ten == ""){
            Swal.fire({
                type: 'error',
                title: 'Lỗi',
                text: 'Họ tên và mật khẩu không được để trống',
            });
            return false;
        }

        var posting = $.post(window.location.href, {
            ho_ten: ho_ten,
            gioi_tinh: gioi_tinh,
            password: pass,
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
        });

        posting.done(function( data ) {
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

    $("#save_password").click(function(){
        var pass1 = $("input[name='pass1']").val();
        var pass2 = $("input[name='pass2']").val();
        var pass3 = $("input[name='pass3']").val();

        if( pass1 == "" || pass2 == "" || pass3 == "" ){
            Swal.fire({
                type: 'error',
                title: 'Lỗi',
                text: 'Không được để trống trường nào',
            });
            return false;
        };

        if( pass2 != pass3){
            Swal.fire({
                type: 'error',
                title: 'Lỗi',
                text: 'Mật khẩu nhập lại không trùng khớp'
            });
            return false;
        };

        var posting = $.post(window.location.href, {
            pass1: pass1,
            pass2: pass2,
            pass3: pass3,
            csrfmiddlewaretoken: $("input[name=csrfmiddlewaretoken]").val(),
        });

        posting.done(function( data ) {
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
                    text: 'Hãy đăng nhập lại',
                    showConfirmButton: false,
                    timer: 2000
                }).then(() => {
                    location.replace(result.messages)
                });
            };
        });

    });
});

