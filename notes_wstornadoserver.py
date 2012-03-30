__author__ = 'Tiago Pais'

from tornado.options import logging

import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web

connected_users = []

class RealtimeHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        print "Echo Connection opened"

    def on_message(self, message):
        print "New echo message %s" % message

        self.write_message(message)

    def on_close(self):
        print "Echo Connection opened"

class NoteHandler(tornado.websocket.WebSocketHandler):
    def open(self):
        logging.info("Connection opened")

        connected_users.append(self)

    def on_message(self, message):
        logging.info("New Note %s" % message)

        for connected_user in connected_users :
            if connected_user != self :
                connected_user.write_message(message)

    def on_close(self):
        logging.info("Connection opened")

        connected_users.remove(self)

settings = {
    'auto_reload': True,
    }

application = tornado.web.Application([
    (r'/ws/echo', RealtimeHandler),
    (r'/ws/note', NoteHandler),
], **settings)

if __name__ == "__main__":
    tornado.options.parse_command_line()

    logging.info("Starting Tornado web server on http://127.0.0.1:9090")
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(port=9090, address="127.0.0.1")
    tornado.ioloop.IOLoop.instance().start()