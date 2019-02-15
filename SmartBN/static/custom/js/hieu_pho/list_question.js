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
        $("#khung_modal").load("/hieu_pho/question_detail_"+id);
        $("#question").modal("show");
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


