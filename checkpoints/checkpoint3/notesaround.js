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
            this.updateCurrentPosition();
            this.fetchNotes();
        },

        updateCurrentPosition : function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function( position ){
                        // Log that this is the initial position.
                        console.log( "Position Found" );
                        var calculatedPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        if (me.currentPosition === undefined) {
                            me.appMap.setCenter(calculatedPosition);
                            me.appMap.setZoom(14);
                        }

                        me.currentPosition = calculatedPosition;
                    },
                    function( error ){
                        console.log( "Something went wrong: ", error );
                        me.currentPosition =   new google.maps.LatLng(-34.397, 150.644);
                    },
                    {
                        maximumAge:Infinity,
                        enableHighAccuracy: true
                    } );
            } else {
                alert('I guess this browser does not support geolocation!')
            }
        },

        fetchNotes : function() {
            var that = this;
            $.getJSON('http://www.notesaround.com/api/notes', function (notes, success, xhr, handle) {
                    for (var note in notes) {
                        if (notes[note].note) {
                            that.displayNote(notes[note]);
                        }
                    }
                });
        },

        displayNote: function(note) {
            var that = this;
            var noteMarker = new google.maps.Marker({
                position: new google.maps.LatLng(note.loc[0],
                    note.loc[1]),
                map: me.appMap,
                animation: google.maps.Animation.DROP,
                icon: 'marker.png',
                title : note.note
            });
        }
    }
}();
