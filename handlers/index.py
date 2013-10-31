#!/usr/bin/env python
from handlers.base import BaseHandler

class MainHandler(BaseHandler):
    def get(self):
        # Insert useful code here
        self.render_template('index.html')
        
class ApiHandler(BaseHandler):
    def get(self):
        # Insert useful code here
        self.render_template('api.html')