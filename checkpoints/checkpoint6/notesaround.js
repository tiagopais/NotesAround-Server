var app = {

    init: function () {
        var myOptions = {
            center: new google.maps.LatLng(-34.397, 150.644),
            zoom: 5,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            mapTypeControl: false,
            zoomControl: true,
            panControl: false,
            rotateControl: false,
            scaleControl: false,
            overviewMapControl: false
        };
        this.appMap = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
        this.updateCurrentPosition();
        this.initWebSocket();
    },

    initWebSocket : function () {
        var me = this;

        this.socket = new WebSocket('ws://notesaround.com/ws/note');

        this.socket.onopen = function (event) {
            console.log('Opened Connection to Note');
        };

        this.socket.onmessage = function (event) {
            console.log('Received Notes: ' + event.data);
            var new_notes = jQuery.parseJSON(event.data);
            for (var new_note in new_notes) {
                if (new_notes[new_note].note) {
                    var noteMarker = me.displayNote(new_notes[new_note]);
                }
            }
        }

        this.socket.onclose = function (event) {
            console.log('Closed Connection');
        }
    },

    updateCurrentPosition: function () {
        var me = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                                                         console.log("Position Found");
                                                         var calculatedPosition = new google.maps.LatLng(position.coords.latitude,
                                                                                                         position.coords.longitude);
                                                         if (!me.currentPosition) {
                                                             me.appMap.setCenter(calculatedPosition);
                                                             me.appMap.setZoom(14);
                                                         }

                                                         me.currentPosition = calculatedPosition;
                                                     },
                                                     function (error) {
                                                         console.log("Something went wrong: ", error);
                                                         me.currentPosition = new google.maps.LatLng(-34.397, 150.644);
                                                     },
                                                     {
                                                         maximumAge: Infinity,
                                                         enableHighAccuracy: true
                                                     });
        } else {
            alert('I guess this browser does not support geolocation!')
        }
    },

    displayNote: function (note) {
        var noteMarker = new google.maps.Marker({
                                                    position: new google.maps.LatLng(note.loc[0],
                                                                                     note.loc[1]),
                                                    map: this.appMap,
                                                    animation: google.maps.Animation.DROP,
                                                    icon: 'marker.png',
                                                    title: note.note
                                                });
        return noteMarker;
    },

    addNewNote: function () {
        this.updateCurrentPosition();
        var me = this;
        var postBox = $("#textToPost");
        var post = postBox.val();

        var noteAsJsonString = JSON.stringify({ 'note': post, 'loc': [me.currentPosition.lat(), me.currentPosition.lng()] })
        me.socket.send(noteAsJsonString);

        postBox.val('');
    }
};
