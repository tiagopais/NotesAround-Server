import json
import random
from restclient import GET, POST
import unittest

__author__ = 'Tiago Pais'

class TestPOST(unittest.TestCase):

    def test_get_allnotes(self):
        responseheaders, response_allnotes = GET("http://localhost:8080/api/notes",
                                async = False, resp=True)

        self.assertTrue(response_allnotes)
        self.assertEquals(200, responseheaders.status)
        self.assertEquals("application/json", responseheaders['content-type'])

        django_notes = json.loads(response_allnotes)

        self.assertTrue(django_notes)

    def test_get_onenote(self):
        responseheaders, response_onenote = GET("http://localhost:8080/api/note/4f5e81e06c83ee214c000000",
                               async = False, resp=True)

        self.assertTrue(response_onenote)
        self.assertEquals(200, responseheaders.status)
        self.assertEquals("application/json", responseheaders['content-type'])

        django_note = json.loads(response_onenote)

        self.assertTrue(django_note)

    def test_newnote(self):
        responseheaders, response = POST("http://localhost:8080/api/note",
                        params = {'note' : '{"note" : "Note test", "loc" : [%s, %s]}' % (random.uniform(-90,90), random.uniform(-180,180))},
                        async = False, resp=True)

        self.assertTrue(response)
        self.assertEquals(200, responseheaders.status)
        self.assertEquals("application/json", responseheaders['content-type'])

        django_note = json.loads(response)

        self.assertTrue(django_note)

