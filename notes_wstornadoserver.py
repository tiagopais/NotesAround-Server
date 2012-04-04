import os
from pymongo import json_util, DESCENDING
from tornado.options import logging
from datetime import datetime

import json
import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
from notes_server import get_notes_collection

__author__ = 'Tiago Pais'

connected_users = []

class IndexHandler(tornado.web.RequestHandler):
    def get(self):
        self.render("index-ws.html")

class EchoHandler(tornado.websocket.WebSocketHandler):
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

        notes = get_notes_collection()

        most_recent_notes = list(notes.find({ "loc" : { "$exists" : "true" },
                                          "timestamp"  : { "$exists" : "true" } },
                                                                                 limit=25).sort("timestamp", DESCENDING))

        connected_users.append(self)

        self.write_message(json.dumps(most_recent_notes, default=json_util.default))

    def on_message(self, message):
        logging.info("New Note %s" % message)

        newnote = message
        newnote_json = json.loads(newnote)
        newnote_json['timestamp'] = datetime.now()
        notes = get_notes_collection()
        notes.insert(newnote_json)

        for connected_user in connected_users :
            connected_user.write_message(json.dumps([newnote_json], default=json_util.default))

    def on_close(self):
        logging.info("Connection opened")

        connected_users.remove(self)

settings = {
    'auto_reload': True,
    'static_path': os.path.join(os.path.dirname(__file__), 'static'),
}

application = tornado.web.Application([
    (r'/ws/echo', EchoHandler),
    (r'/ws/note', NoteHandler),
    (r'/', IndexHandler)
], **settings)

if __name__ == "__main__":
    tornado.options.parse_command_line()

    logging.info("Starting Tornado web server on http://127.0.0.1:9090")
    http_server = tornado.httpserver.HTTPServer(application)
    http_server.listen(port=9090, address="127.0.0.1")
    tornado.ioloop.IOLoop.instance().start()