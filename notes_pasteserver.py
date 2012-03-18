from bottle import run, PasteServer
import notes_server

run(server=PasteServer,host='192.168.1.2')