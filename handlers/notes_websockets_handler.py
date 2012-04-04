__author__ = 'Tiago Pais'

from pymongo import json_util, DESCENDING
from tornado.options import logging
from datetime import datetime

import json
import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
from notes_server import get_notes_collection

connected_users = []

class NoteWebSocketHandler(tornado.websocket.WebSocketHandler):

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