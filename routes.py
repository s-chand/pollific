#!/usr/bin/env python

import handlers
import webapp2
from webapp2 import Route
from webapp2_extras.routes import PathPrefixRoute
from webapp2_extras.routes import RedirectRoute
from handlers.file_handlers import UploadHandler, ServeHandler

_routes = [
    Route('/', handler = 'handlers.index.MainHandler', name = 'index_uri'),
    Route('/upload', UploadHandler),
    Route('/serve/<resource>', ServeHandler),
    PathPrefixRoute('/polls', [
        
    ]),
    PathPrefixRoute('/api', [
        RedirectRoute('/', handler = 'handlers.index.ApiHandler', name = 'api_uri'),
        RedirectRoute('/polls/', handler = 'handlers.poll_handlers.PollsHandler', name = 'polls_uri'),
        RedirectRoute('/polls/<id:\d+>', handler = 'handlers.poll_handlers.PollHandler', name = 'poll_uri'),
        RedirectRoute('/polls/<poll_id:\d+>/contestants', handler = 'handlers.poll_handlers.ContestantsHandler', name = 'poll_contestants_uri'),
        RedirectRoute('/contestant', handler = 'handlers.poll_handlers.ContestantsHandler', name = 'contestants_uri'),
        RedirectRoute('/vote', handler = 'handlers.poll_handlers.VoteHandler', name = 'vote_uri')
    ]),
    PathPrefixRoute('/u',[
        RedirectRoute('/login', handler = 'handlers.user.LoginUserHandler', name = 'login_uri', strict_slash = True),
        RedirectRoute('/logout', handler = 'handlers.user.LogoutUserHandler', name = 'logout_uri', strict_slash = True),
        RedirectRoute('/activate', handler = 'handlers.user.ActivateUserHandler', name = 'user_activation_uri', strict_slash = True),
        RedirectRoute('/forgotpass', handler = 'handlers.user.ForgotPassHandler', name = 'forgotpass_uri', strict_slash = True),
        RedirectRoute('/resetpass', handler = 'handlers.user.ResetPassHandler', name = 'resetpass_uri', strict_slash = True),
    ]),
    PathPrefixRoute('/tasks',[
        RedirectRoute('/mail/send_activation_mail', handler = 'tasks.mail.ActivationMailHandler', name = 'send_activation_mail_uri', strict_slash = True),
        RedirectRoute('/mail/send_resetpass_mail', handler = 'tasks.mail.ResetPassMailHandler', name = 'send_resetpass_mail_uri', strict_slash = True),
    ]),
]

def get_routes():
    return _routes

def add_routes(app):
    if app.debug:
        secure_scheme = 'http'
    for r in _routes:
        app.router.add(r)
