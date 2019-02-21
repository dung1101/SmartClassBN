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
});
