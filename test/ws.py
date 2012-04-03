import unittest
import random

__author__ = 'Tiago Pais'

from ws4py.client.threadedclient import WebSocketClient

class EchoClient(WebSocketClient):
    def opened(self, protocols, extensions):
        print "Connection opened..."
        self.send('Hello everybody...')

    def closed(self, code, reason=None):
        print code, reason

    def received_message(self, m):
        print "Received %s..." % m

class TestWebSockets(unittest.TestCase):

    def test_connect(self):

        ws = EchoClient('ws://websockets.notesaround.com:81/ws/echo')
        ws.connect()
        ws.close()

    def test_send_echo(self):

        ws = EchoClient('ws://websockets.notesaround.com:81/ws/echo')
        ws.connect()
        ws.send("Here I am....")
        ws.close()

    def test_send_note(self):

        ws = EchoClient('ws://websockets.notesaround.com:81/ws/note')
        ws.connect()
        ws.send('{"note" : "Note test", "loc" : [%s, %s]}' % (random.uniform(-90,90), random.uniform(-180,180)))
        ws.close()