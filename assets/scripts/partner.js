var serverAdress = "http://localhost:1337";
var field = {};
$.ajax({
    method: "GET",
    url: serverAdress+"/field/getAllFields",
    statusCode: {
        200: function(data){
            $( "#partner-input" ).autocomplete({
                source: _.pluck(data,'name'),
                select: function(e,ui){
                    getInfo(ui.value)
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
        url: serverAdress+"/field/"+field,
        statusCode: {
            200: function(data){
                field = data;
            },
            400: function(){
                alert('Error request');
            }
        }
    });
}