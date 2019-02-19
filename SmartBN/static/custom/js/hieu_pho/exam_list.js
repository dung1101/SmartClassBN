$(document).ready(function(){
    var table_question = $("#list_exam").DataTable({
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
        "order": [[ 2, 'desc' ]],
    });

    $("#gv_mon").on('change', function(){
        table_question.ajax.url(location.href + "_data_" + $("#gv_mon option:selected").val()).load();
    });

    $('#list_exam tbody').on( 'click', 'tr', function () {
        if(table_question.data().count() == 0){
            return false;
        }
        var id = $(this).find('p').first().attr('id').split("_")[1];
        $("#khung_modal").load("/hieu_pho/exam_detail_"+id);
        $("#exam").modal("show");
    });

    $("#print_exam").on("click",function () {
        $("body").first().html($("#khung_exam").html());
        window.print();
        location.reload();
        return true;
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


