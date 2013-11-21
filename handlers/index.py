#!/usr/bin/env python
from handlers.base import BaseHandler
import webapp2
import logging
import json
from google.appengine.api import users

class MainHandler(BaseHandler):
    def get(self):
        user = users.get_current_user()
        if user:
            self.render_template('index.html')
        else:
            self.render_template('landing.html')


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


class UserHandler(ApiHandler):
    def get(self):
        user = users.get_current_user()
        if user:
            result = { "user_logged_in": True,
                       "user_id": users.get_current_user().user_id(),
                       "user_name": users.get_current_user().nickname(),
                       "logout_url": users.create_logout_url('/')}

        else:
            result = {
                "user_logged_in": False,
                "login_url": users.create_login_url('/')
            }

        self.render_object(result, 200)

    def post(self):
        pass


#it appears this has not a found a use yet..but should soon...
def getResponseMessage(code):
    return {'201': 'Resource Successfully Created',
            '401': 'Unauthorized Request; Please make sure you are Authorized',
            '400': 'That was a bad request; Be sure to modify your request before retrying',
            '404': 'Resource was not found',
            '405': 'That method is not allowed on this resource. Please refer to the API documentation',
            '500': 'Internal Server Error; Please contact Admin if this persists',
            '204': 'No content to send'}[code]
