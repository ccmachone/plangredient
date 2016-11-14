$(function(){
    var $select = $(".num_menu");
    for (i=0;i<=100;i++){
        $select.append($('<option></option>').val(i).html(i))
    }
});

$()