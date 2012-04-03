var app =  new function () {
    var myOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 5,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        zoomControl: true,
        panControl : false,
        rotateControl : false,
        scaleControl : false,
        overviewMapControl : false
    };
    var me = this;
    var appMap;

    return {
        init : function() {
            var that = this;
            me.appMap = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
        }
    }
}();
