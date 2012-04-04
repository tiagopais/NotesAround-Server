import tornado

__author__ = 'Tiago Pais'

class EchoHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print "Echo Connection opened"

    def on_message(self, message):
        print "New echo message %s" % message

        self.write_message(message)

    def on_close(self):
        print "Echo Connection opened"