var field = {};
$.ajax({
    method: "GET",
    url: "../field/getAllFields",
    statusCode: {
        200: function(data){
            $( "#partner-input" ).autocomplete({
                source: _.pluck(data,'name'),
                select: function(e,ui){
                    console.log(ui.item.value);
                    getInfo(ui.item.value);
                }
            });
        },
        400: function(){
            alert('Error request');
        }
    }
});
var getInfo = function(field){
    $.ajax({
        method: "GET",
        url: "../field/getFieldInfo/"+field,
        statusCode: {
            200: function(data){
                field = data;
                $('.content-field').removeClass('hidden');
                $('.content-field img').attr('src',data.picture);
                $('.content-field p').text(data.address+" "+data.city);
                $('.next-stage').removeClass('hidden');
                $('.partner-prices-button').removeClass('hidden');
                $('.id-partner').val(data.id);
            },
            400: function(){
                alert('Error request');
            }
        }
    });
}
var count = 0;
var addPrice = function(){
    if(count<3){
        count++;
        $('.day'+count).removeClass('hidden');
    }
    else
        alert('Pas plus de 4 prix');
}

$('#save-comis').click(function(){
    var hours = ['matin','midi','aprem','soir'];
    var comis = [];
    for(var i=0; i<7; i++){
        var obj = {};
        for(var j=0; j<4; j++){
            obj[hours[j]]= parseInt($('[data-day='+i+'][data-hour='+hours[j]+']').val())/100;
        }
        comis.push(obj);
    }
    $('#value-comis').val(JSON.stringify(comis));
    $('#modalComis').modal('hide');
});