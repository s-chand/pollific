#!/usr/bin/env python
from handlers.base import BaseHandler
import webapp2
import logging
import json

class MainHandler(BaseHandler):
    def get(self):
        # Insert useful code here
        self.render_template('index.html')


class ApiHandler(BaseHandler):
    """
        This class defines a base handler for all the api request handlers
        and eases the creation of json responses
    """

    def get(self):
        self.render_template('api.html')

    def render_object(self, result, response_code):
        self.response.headers['Access-Control-Allow-Origin'] = '*'
        self.response.headers.add_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.response.headers['Content-Type'] = 'application/json'
        self.response.set_status(response_code)
        self.response.write(json.dumps(result))


#it appears this has not a found a use yet..but should soon...
def getResponseMessage(code):
    return {'201': 'Resource Successfully Created',
            '401': 'Unauthorized Request; Please make sure you are Authorized',
            '400': 'That was a bad request; Be sure to modify your request before retrying',
            '404': 'Resource was not found',
            '405': 'That method is not allowed on this resource. Please refer to the API documentation',
            '500': 'Internal Server Error; Please contact Admin if this persists',
            '204': 'No content to send'}[code]
