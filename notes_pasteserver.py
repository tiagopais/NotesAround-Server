from bottle import run, PasteServer
import notes_server

run(server=PasteServer,host='localhost')