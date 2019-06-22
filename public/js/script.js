$(document).on('click', '#btnShorten', function(){    

    let link = $('input[name="url"]').val();

    $.ajax({
        url: '/url/short',
        type: 'POST',
        data: {link: link},
        dataType: "json",
        
        error: function(res){
            alert(res.responseText);
        },        
        success: function(res){
            $("#btnShorten").hide();
            $("#btnCopy").show();
            $(".form-control").val('');
            $(".form-control").val(res);
        }
    });           
}); 

$(document).on('click', '#btnCopy', function(res){
    $('.form-control input').val(res);
    $('.form-control').focus();
    $('.form-control').select();
    document.execCommand("copy");
});



