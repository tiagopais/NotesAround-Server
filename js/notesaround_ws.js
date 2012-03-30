var app =  new function () {
    return {
        init : function() {

            var socket = new WebSocket('ws://127.0.0.1:9090/ws/echo');
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