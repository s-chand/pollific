#!/usr/bin/env python
from handlers.base import BaseHandler
import webapp2
import logging
import json

class MainHandler(BaseHandler):
    def get(self):
        # Insert useful code here
        self.render_template('index.html')


class ApiHandler(webapp2.RequestHandler):
    """
        This class defines a base handler for all the api request handlers
        and eases the creation of json responses
    """

    def render_object(self, result):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.response.headers['Content-Type'] = 'application/json'
        self.response.write(json.dumps(result))
