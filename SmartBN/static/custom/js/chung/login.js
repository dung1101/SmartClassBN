$(document).ready(function(){
    $("#login").click(function(){
        var username = $('input[name=username]').val();
        var password = $('input[name=password]').val();

        alert(username, password);
        if(username == ""){
            Swal.fire({
                type: 'error',
                title: 'Lỗi',
                text: 'Tên đăng nhập không được để trống'
            })
            return false;
        }

        if(password == ""){
            Swal.fire({
                type: 'error',
                title: 'Lỗi',
                text: 'Mật khẩu không được để trống'
            })
            return false;
        }

        var posting = $.post(window.location.href, {
            username: username,
            password: password,
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
                    text: 'Đăng nhập thành công',
                    showConfirmButton: false,
                    timer: 1000
                })
            };
        });


    });

});



