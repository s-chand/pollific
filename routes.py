#!/usr/bin/env python

import handlers
import webapp2
from webapp2 import Route
from webapp2_extras.routes import PathPrefixRoute
from webapp2_extras.routes import RedirectRoute
from handlers.file_handlers import UploadHandler, ServeHandler

_routes = [
    Route('/', handler = 'handlers.index.MainHandler', name = 'index_uri'),
    Route('/test', handler = 'handlers.test.MainHandler', name = 'test_uri'),
    Route('/upload', UploadHandler),
    Route('/serve/<resource>', ServeHandler),
    PathPrefixRoute('/polls', [
        
    ]),
    PathPrefixRoute('/api', [
        RedirectRoute('/', handler = 'handlers.index.ApiHandler', name = 'api_uri'),
        #GET and POST allowed to this URL - for a get, a specified number of results should be specified to
        # paginate the results returned...
        #GETs a list of polls giving you just id title and description
        #or
        #POSTs a new poll to the server by supplying details of the poll as well as the contestants if applicable
        RedirectRoute('/polls/', handler = 'handlers.poll_handlers.PollsHandler', name = 'polls_uri'),
        #GETs the full details of a particular poll...details such as ownerID, status, etc
        RedirectRoute('/polls/<poll_id:\d+>', handler = 'handlers.poll_handlers.PollHandler', name = 'poll_uri'),
        #GETs the contestants for a particular poll
        RedirectRoute('/polls/<poll_id:\d+>/contestants', handler = 'handlers.poll_handlers.ContestantsHandler', name = 'poll_contestants_uri'),
        #POSTs a vote to a particular poll
        RedirectRoute('/polls/<poll_id:\d+>/vote', handler = 'handlers.vote_handlers.VoteHandler', name = 'vote_uri'),
        #POSTs a vote to a particular poll
        RedirectRoute('/polls/<poll_id:\d+>/unvote', handler = 'handlers.vote_handlers.UnvoteHandler', name = 'vote_uri'),
        #GETs the votes for a particular poll
        RedirectRoute('/polls/<poll_id:\d+>/votes', handler = 'handlers.vote_handlers.VotesHandler', name = 'vote_uri'),
        #GETs the details of a particular contestant
        RedirectRoute('/contestants/<contestant_id:\d+>', handler = 'handlers.poll_handlers.ContestantHandler', name = 'contestants_uri'),
        #GETs the polls created by a particular user
        RedirectRoute('/polls/user/<user_id>', handler = 'handlers.poll_handlers.UserPollsHandler', name = 'vote_uri'),
         #GETs the polls created by a particular user
        RedirectRoute('/polls/user/voted/<user_id>', handler = 'handlers.poll_handlers.PollsUserVotedHandler', name = 'vote_uri'),
        #GETs the details for the currently logged in user URLRedirectHandler
        RedirectRoute('/users/current_user', handler = 'handlers.index.UserHandler', name='vote_uri'),
        #POSTs a comment to the supplied poll
        RedirectRoute('/polls/comment', handler = 'handlers.poll_handlers.PostCommentsHandler', name = 'vote_uri'),
        #GETs the comments that have been made to the supplied poll
        RedirectRoute('/polls/<poll_id:\d+>/comments', handler = 'handlers.poll_handlers.PollCommentsHandler', name='vote_uri'),
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
