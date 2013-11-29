import json

from modules.polls import crud
from handlers.index import ApiHandler
from google.appengine.api import users


class PollsHandler(ApiHandler):
    def get(self):
        result = crud.getPolls()
        
        self.render_object(result, 200)

    def post(self):
        request = self.request.body
        #extract the post body then return
        data = dict(json.loads(request))
        user = data['ownerID']
        if user and user == users.get_current_user().user_id():
            title = data['title']
            desc = data['description']
            status = data['status']
            type= data['type']
            if data.keys().__contains__('contestants'):
                contestants = list(data['contestants'])
                if len(contestants) > 0:
                    result = crud.makePoll(user, title, desc, type, status,contestants)
            else:
                result = crud.makePoll(user, title, desc, type, status)

        else:
            result = {"error": "You are not logged in to PollPlus.you hav to log in to create a poll"}



        self.render_object(result, 201)


class PollHandler(ApiHandler):
    def get(self, poll_id):
        _id = int(poll_id)
        result = crud.getPollDetails(_id)

        self.render_object(result, 200)

    def post(self):
        self.render_object({}, 405)


class UserPollsHandler(ApiHandler):
    def get(self, user_id):
        result = crud.getPollsByUser(user_id)
        self.render_object(result, 200)

    def post(self):
        self.render_object({}, 405)


class ContestantsHandler(ApiHandler):
    def get(self, poll_id):
        if poll_id:
            result = crud.getPollContestants(poll_id)
            self.render_object(result, 200)
        else:
            result = {"error": "no id specified"}

    def post(self):
        self.render_object({},405)


class ContestantHandler(ApiHandler):
    def get(self,contestant_id):
        result = crud.getContestantDetails(int(contestant_id))
        self.render_object(result, 200)

    def post(self):
        self.render_object({}, 405)


class PollsUserVotedHandler(ApiHandler):
    def get(self, user_id):
        result = crud.getPollsUserVoted(user_id)
        self.render_object(result, 200)

    def post(self):
        self.render_object({},405)

class PostCommentsHandler(ApiHandler):
    def get(self):
        self.render_object({}, 405)

    def post(self):
        data = json.loads(self.request.body)
        user_id = data["user_id"]
        poll_id  =data["poll_id"]
        comment  = data["comment"]
        result = crud.addComment(user_id, poll_id, comment)
        self.render_object(result, 201)


class PollCommentsHandler(ApiHandler):
    def get(self, poll_id):
        user_id = self.request.get('user_id')
        if user_id:
            result = crud.getUserCommentInPoll(poll_id=poll_id, user_id=user_id)
        else:
            result = crud.getCommentsForPoll(poll_id)
        self.render_object(result, 200)

    def post(self):
        self.render_object({}, 405)

class UserCommentsInPollHandler(ApiHandler):
    def get(self, poll_id, user_id):
        result = crud.getUserVoteInPoll(user_id, poll_id)
        self.render_object(result, 200)

    def post(self):
        self.render_object({}, 405)