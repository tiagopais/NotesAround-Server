import json
from bson.objectid import ObjectId
from datetime import datetime
from pymongo import json_util, DESCENDING
import tornado
from notes_server import get_notes_collection

__author__ = 'Tiago Pais'

class NoteAPIHandler(tornado.web.RequestHandler):

    def get(self, note_id):
        self.set_header('Content-Type', 'application/json')
        self.set_header('Access-Control-Allow-Origin', '*')

        notes = get_notes_collection()
        single_note = notes.find_one({"_id": ObjectId(note_id)})

        if not single_note:
            return json.dumps({})

        self.write(json.dumps(dict(single_note), default=json_util.default))

    def post(self):
        self.set_header('Content-Type', 'application/json')
        self.set_header('Access-Control-Allow-Origin', '*')

        newnote = self.get_argument('note')
        newnote_json = json.loads(newnote)
        newnote_json['timestamp'] = datetime.now()
        notes = get_notes_collection()

        notes.insert(newnote_json)

        self.write(json.dumps(newnote_json, default=json_util.default))

class NotesAPIHandler(tornado.web.RequestHandler):

    def get(self):
        self.set_header('Content-Type', 'application/json')
        self.set_header('Access-Control-Allow-Origin', '*')

        notes = get_notes_collection()

        most_recent_notes = list(notes.find({ "loc" : { "$exists" : "true" },
                                          "timestamp"  : { "$exists" : "true" } },
                                                                                 limit=25).sort("timestamp", DESCENDING))

        self.write(json.dumps(most_recent_notes, default=json_util.default))
