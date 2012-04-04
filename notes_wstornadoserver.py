import os
from tornado.options import logging

import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
from handlers.echo_handler import EchoHandler
from handlers.notes_api_handler import NoteAPIHandler, NotesAPIHandler
from handlers.notes_websockets_handler import NoteWebSocketHandler

__author__ = 'Tiago Pais'

class IndexHandler(tornado.web.RequestHandler):
        def get(self):
            self.render("index.html")

class IndexWebSocketsHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index-ws.html")

settings = {
    'auto_reload': True,
    'static_path': os.path.join(os.path.dirname(__file__), 'static'),
}

application = tornado.web.Application([
    (r'/ws/echo', EchoHandler),
    (r'/ws/', IndexWebSocketsHandler),
    (r'/ws/note', NoteWebSocketHandler),

    (r'/api/note/(.+)', NoteAPIHandler),
    (r'/api/note/', NoteAPIHandler),
    (r'/api/note', NoteAPIHandler),
    (r'/api/notes', NotesAPIHandler),

    (r'/', IndexHandler)
], **settings)

if __name__ == "__main__":
    tornado.options.parse_command_line()

    logging.info("Starting Tornado web server on http://127.0.0.1:9090")
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(port=9090, address="127.0.0.1")
    tornado.ioloop.IOLoop.instance().start()