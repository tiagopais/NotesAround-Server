from bottle_websocket import GeventWebSocketServer
from bottle_websocket import websocket
from bottle import run, get, route

@get('/ws/echo', apply=[websocket])
def echo(ws):
    while True:
        msg = ws.receive()
        print "Received %s..." % msg

        if msg is not None:
            ws.send(msg)

run(host='127.0.0.1', server=GeventWebSocketServer)