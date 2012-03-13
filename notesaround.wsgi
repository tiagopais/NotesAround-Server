import sys, os, bottle

sys.stdout = sys.stderr

sys.path = ['/srv/notesaround/www/'] + sys.path
os.chdir(os.path.dirname(__file__))

import notes_server

application = bottle.default_app()