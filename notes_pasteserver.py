from bottle import run, PasteServer

run(server=PasteServer,host='127.0.0.1',port=8080)