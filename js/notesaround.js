var app =  new function () {
    var myOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 14,
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
    var currentPosition;
    var markers;
    var socket;

    return {
        init : function() {
            var that = this;
            this.updateCurrentPosition();
            me.appMap = new google.maps.Map(document.getElementById("map_canvas"),myOptions);
            me.markers = [];

            $("#textToPost").keypress(function(event) {
                if ( event.which == 13 ) {
                    app.putMarker();
                }
            });
            NotesAround_FX.bindToAccelerometer(NotesAround_FX.eraseOnTilt);

            $.PeriodicalUpdater('/api/notes', {
                                    method: 'GET',
                                    type: 'json',
                                    minTimeout: 15000,
                                    maxTimeout: 60000,
                                    runatonce: true
                                },
                                function (notes, success, xhr, handle) {
                                    that.clearMarkers();
                                    for (note in notes) {

                                        if (notes[note].note) {
                                            that.displayNote(notes[note]);
                                        }
                                    }
                                });

            socket = new WebSocket('ws://127.0.0.1:9090/ws/note');
            socket.onopen = function(event) {
                console.log('Opened Connection to Note');
            };

            socket.onmessage = function(event) {
                console.log('Received Note: ' + event.data);
            }

            socket.onclose = function(event) {
                console.log('Closed Connection');
            }
        },

        clearMarkers : function() {
            console.log("Clearing all markers...");

            if (me.markers) {
                for (var i = 0; i < me.markers.length; i++ ) {

                    if (me.markers[i] !== null) {
                        console.log("Clearing... " + me.markers[i] + " -> " + me.markers[i].title);
                    } else {
                        console.log("Clearing marker at... " + i);
                    }

                    me.markers[i].setMap(null);
                    me.markers[i] = null;
                }
               me.length = 0;
            }
        },

        displayNote: function(note) {
            var that = this;
            var noteMarker = new google.maps.Marker({
                                                  position: new google.maps.LatLng(note.loc[0],
                                                                                   note.loc[1]),
                                                  map: me.appMap,
                                                  animation: google.maps.Animation.DROP,
                                                  icon: 'img/marker.png',
                                                  title : note.note
                                              });
            me.markers.push(noteMarker);

//            that.complementNote(noteMarker);
        },

        complementNote: function (noteMarker) {
            var that = this;
            NotesAround.search({
                                   query: noteMarker.title,
                                   engine: 'google',
                                   preprocessor: 'yahoo',
                                   callback: function (results) {
                                       var img = '<a href="' + results[0].url + '" target="_blank"><img width="' + results[0].tbWidth + '" src="' + results[0].tbUrl + '"></a>';
                                       var contentString =
                                           '<div id="content">' +
                                               '<div id="imgContent">' + img + '</div>' +
                                               '<div id="bodyContent">' + noteMarker.title + '</div>' +
                                           '</div>'

                                       var infowindow = new google.maps.InfoWindow({content:contentString});

                                       google.maps.event.addListener(noteMarker, 'click', function () {
                                           infowindow.open(me.appMap, noteMarker);
                                       });
                                   }
                               });
        },

        putMarker: function() {
            this.updateCurrentPosition();
            var that = this;
            var postBox = $("#textToPost");
            var post = postBox.val();

            var noteAsJsonString = JSON.stringify({ 'note' : post , 'loc': [me.currentPosition.lat(), me.currentPosition.lng()] })
            $.post("/api/note", 'note=' + noteAsJsonString,
            function (new_note) {
                if (new_note.note) {
                    that.displayNote(new_note);
                }
            });
            socket.send(noteAsJsonString);

            postBox.val('');
        } ,

        updateCurrentPosition : function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function( position ){
                                                             // Log that this is the initial position.
                                                             console.log( "Position Found" );
                                                             var calculatedPosition = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                                                             if (me.currentPosition === undefined) {
                                                                 me.appMap.setCenter(calculatedPosition);
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

        bounceMarkers : function() {
            for(marker in me.markers) {
                if(me.markers[marker].animation !== google.maps.Animation.BOUNCE) {
                    me.markers[marker].setAnimation(google.maps.Animation.BOUNCE);
                } else {
                    me.markers[marker].setAnimation(null);
                }
            }
        },

        aboutUs : function() {
            NOTESAROUND_ABOUT.showAbout(me.markers,me.appMap);
        }
    }
}();

