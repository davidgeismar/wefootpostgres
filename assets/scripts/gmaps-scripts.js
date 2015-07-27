var GoogleMaps = function () {
    var mapMarker = function () {
        var map = new GMaps({
            div: '#gmap_marker',
            lat: -12.043333,
            lng: -77.028333
        });
        map.addMarker({
            lat: -12.043333,
            lng: -77.03,
            title: 'Lima',
            details: {
                database_id: 42,
                author: 'HPNeo'
            },
            click: function (e) {
                if (console.log) console.log(e);
                alert('You clicked in this marker');
            }
        });
        map.addMarker({
            lat: -12.042,
            lng: -77.028333,
            title: 'Marker with InfoWindow',
            infoWindow: {
                content: 'HTML Content!!!!'
            }
        });
     }

    return {
        //main function to initiate map samples
        init: function () {
            mapMarker();
            $('.gmaps').css('height',window.innerHeight/1.2);
        }

    };

}();