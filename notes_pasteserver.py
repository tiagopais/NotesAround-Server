from bottle import run, PasteServer

run(server=PasteServer,host='localhost',port=8080)