import json
from pymongo import Connection, json_util
from bottle import get, post, run, request, response
from pymongo.objectid import ObjectId

def get_notes_collection():
    notesaround_db = Connection().notesaround
    notes = notesaround_db.notes
    return notes


@get('/api/notes')
def get_notes():

    response.content_type = 'application/json'

    notes = get_notes_collection()

    most_recent_notes = list(notes.find())

    return json.dumps(most_recent_notes, default=json_util.default)


@get('/api/note/<note>')
def get_note(note):

    response.content_type = 'application/json'

    notes = get_notes_collection()
    single_note = notes.find({"_id": ObjectId(note)})

    if not single_note:
      return json.dumps({})

    return  json.dumps(dict(single_note), default=json_util.default)

@post('/api/note')
def new_note():

    response.content_type = 'application/json'

    newnote = request.forms.get('note')
    newnote_json = json.loads(newnote)

    notes = get_notes_collection()

    notes.insert(newnote_json)

    return json.dumps(newnote_json, default=json_util.default)

run(server='PasteServer',host='localhost')