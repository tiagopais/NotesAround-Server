var app =  new function () {
    return {
        init : function() {

            var socket = new WebSocket('ws://websockets.notesaround.com:81/ws/echo');
            socket.onopen = function(event) {
                socket.send('Hello, Opensoft!');
            };

            socket.onmessage = function(event) {
                console.log('Received echo: ' + event.data);
            }

            socket.onclose = function(event) {
                console.log('Closed Connection');
            }
        }
    }
}();