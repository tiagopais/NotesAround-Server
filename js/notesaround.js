var app =  new function () {
    var myOptions = {
        center: new google.maps.LatLng(-34.397, 150.644),
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        mapTypeControl: false,
        zoomControl: false,
        panControl : false,
        rotateControl : false,
        scaleControl : false,
        overviewMapControl : false
    };
    var me = this;
    var appMap;
    var currentPosition;

    return {
        init : function() {
            var that = this;
            this.updateCurrentPosition();
            me.appMap = new google.maps.Map(document.getElementById("map_canvas"),myOptions);

            $("#textToPost").keypress(function(event) {
                if ( event.which == 13 ) {
                    app.putMarker('img/icon.png');
                }
            });
            NotesAround_FX.bindToAccelerometer(NotesAround_FX.logalaisso);

            $.PeriodicalUpdater('/api/notes', {
                                    method: 'GET',
                                    type: 'json',
                                    minTimeout: 15000,
                                    maxTimeout: 60000,
                                    runatonce: true
                                },
                                function (notes, success, xhr, handle) {
                                    for (note in notes) {

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
                                                  icon: 'img/icon.png',
                                                  title : note.note
                                              });

            that.complementNote(noteMarker);
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

        putMarker: function(image) {
            this.updateCurrentPosition();
            var that = this;
            var postBox = $("#textToPost");
            var post = postBox.val();

            $.post("/api/note", 'note=' + JSON.stringify({ 'note' : post , 'loc': [me.currentPosition.lat(), me.currentPosition.lng()] }),
            function (new_note) {
                if (new_note.note) {
                    that.displayNote(new_note);
                }
            });

            postBox.val('');
        } ,

        updateCurrentPosition : function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function( position ){
                                                             // Log that this is the initial position.
                                                             console.log( "Position Found" );
                                                             var calculatedPosition = new google.maps.LatLng(position.coords.latitude,
                                                                 position.coords.longitude);
                                                             if(me.currentPosition===undefined) {
                                                                 me.appMap.setCenter(calculatedPosition);
                                                             }
                                                             me.currentPosition = calculatedPosition;

                                                         },
                                                         function( error ){
                                                             console.log( "Something went wrong: ", error );
                                                             me.currentPosition =   new google.maps.LatLng(-34.397, 150.644);
                                                         },
                                                         {
                                                             timeout: (5 * 1000),
                                                             maximumAge: (1000 * 60 * 15),
                                                             enableHighAccuracy: true
                                                         } );
            } else {
                alert('I guess this browser does not support geolocation!')
            }
        }
    }

}();

