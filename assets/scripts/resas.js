$(document).ready(function() {
    $('#table').DataTable();
});
var serverAdress = "http://localhost:1337";
$.ajaxSetup({
    headers: { 'Authorization': window.sessionStorage['oauth'] }
});
paid = function(id){
    $.ajax({
        method: "POST",
        url: serverAdress+"/paiement/update",
        data: {id: id, paid: true},
        statusCode: {
            200: function(){
                var elem = $(".elem"+id).find('.label-mini');
                $(elem).removeClass('label-warning');
                $(elem).removeClass('label-danger');
                $(elem).addClass('label-success');
                $(elem).html('Réglé à WF');
            },
            400: function(){
                alert('Error request');
            },
            406: function(){
                alert('Forbidden');
            }
        }
    });
}
fixProb = function(id){
    console.log(id);
    $.ajax({
        method: "POST",
        url: serverAdress+"/paiement/update",
        data: {id: id, alert: false},
        statusCode: {
            200: function(){
                var elem = $(".elem"+id).find('.label-mini');
                $(elem).removeClass('label-danger');
                $(elem).removeClass('label-success');
                $(elem).addClass('label-warning');
                $(elem).html('Réglé au centre');
            },
            400: function(){
                alert('Error request');
            },
            406: function(){
                alert('Forbidden');
            }
        }
    });
}
sigProb = function(id){
    $.ajax({
        method: "POST",
        url: serverAdress+"/paiement/update",
        data: {id: id, alert: true},
        statusCode: {
            200: function(){
                var elem = $(".elem"+id).find('.label-mini');
                $(elem).removeClass('label-warning');
                $(elem).removeClass('label-success');
                $(elem).addClass('label-danger');
                $(elem).html('Problème');
            },
            400: function(){
                alert('Error request');
            },
            406: function(){
                alert('Forbidden');
            }
        }
    });
}
getMoney = function(id){
    if(confirm("Vous allez débiter un utilisateur")==true){
        $.ajax({
        method: "POST",
        url: serverAdress+"/pay/transferMoney",
        data: {foot: id, secret: "wfGenius1230"},
        statusCode: {
            200: function(){
                alert('Success');
                var elem = $(".elem"+id).find('.label-mini');
                $(elem).removeClass('label-warning');
                $(elem).removeClass('label-success');
                $(elem).addClass('label-danger');
                $(elem).html('Problème');
            },
            400: function(){
                alert('Error request');
            },
            406: function(){
                alert('Forbidden');
            }
        }
        });
    }
}