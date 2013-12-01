from handlers.base import BaseHandler
import webapp2
import logging
import json
from google.appengine.api import users
import cgi

class MainHandler(BaseHandler):
    def get(self):
        user = users.get_current_user()
       # dest_url = replace(str(self.request.uri), "#" , "%23")
        if user:
            self.render_template('test.html')
        else:
          #  self.redirect(users.create_login_url(dest_url))
            self.render_template('test.html')