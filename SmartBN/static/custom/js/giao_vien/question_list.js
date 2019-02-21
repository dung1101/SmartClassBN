$(document).ready(function(){

    var table_question = $("#list_question").DataTable({
        "ajax": {
            "type": "GET",
            "url": location.href + "_data_" + $("#gv_mon option:selected").val(),
            "contentType": "application/json; charset=utf-8",
            "data": function(result){
                return JSON.stringify(result);
            },
        },
        "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
        "displayLength": 25,
        "order": [[ 5, 'desc' ]],
    });

    $("#gv_mon").on('change', function(){
        table_question.ajax.url(location.href + "_data_" + $("#gv_mon option:selected").val()).load();
    });

    $('#list_question tbody').on( 'click', 'tr', function () {
        if(table_question.data().count() == 0){
            return false;
        }
        var id = $(this).find('p').first().attr('id').split("_")[2];
        $("#khung_modal").load("/giao_vien/question_detail_"+id);
        $("#question_title").text("Câu hỏi "+id);
        $("#question").modal("show");
    });

    $("#remove_question").click(function(){
        $.ajax({
            type: "POST",
            url: location.href,
            data: {
                id_xoa: $("#question_title").text().split(" ")[2],
                csrfmiddlewaretoken: $("input[name='csrfmiddlewaretoken']").val()
            },
            success: function(data){
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
                        text: 'Xóa thành công',
                        showConfirmButton: false,
                        timer: 1500
                    }).then(() => {
                        $("#question").modal("hide");
                        table_question.ajax.reload(null, false);
                    });
                };
            }
        });
    });

});

function readURL(input,image) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      $('#'+image).attr('src', e.target.result);
    }
    reader.readAsDataURL(input.files[0]);
  }
}


