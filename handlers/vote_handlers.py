from handlers.index import ApiHandler
import json
from modules.polls import crud


class VoteHandler(ApiHandler):
    def post(self, poll_id):
        request = self.request.body
        #extract the post body then return
        data = json.loads(request)
        user = data['voter']
        contestant = data['contestant']
        val= data['value']
        value = val == True
        result = crud.vote(user, contestant, poll_id, value)
        self.render_object(result, 201)

    def get(self):
        self.render_object({}, 405)


class VotesHandler(ApiHandler):
    def post(self):
        self.render_object({},405)

    def get(self, poll_id):
        result = crud.getVotesInPoll(poll_id)
        self.render_object(result, 200)
