import json

from modules.polls import crud
from handlers.index import ApiHandler


class PollsHandler(ApiHandler):
    def get(self):
        result = crud.getPolls()
        
        self.render_object(result, 200)

    def post(self):
        request = self.request.body
        #extract the post body then return
        data = dict(json.loads(request))
        user = data['ownerID']
        title = data['title']
        desc = data['description']
        status = data['status']
        type= data['type']
        if data.keys().__contains__('contestants'):
            contestants = list(data['contestants'])
            if len(contestants) > 0:
                result = crud.makePoll(user, title, desc, type, status,contestants)
        else:
            result = crud.makePoll(user, title, desc, type, status,)

        self.render_object(result, 201)

class PollHandler(ApiHandler):
    def get(self, poll_id):
        _id = int(poll_id)
        result = crud.getPollDetails(_id)

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