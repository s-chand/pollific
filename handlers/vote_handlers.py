from handlers.base import ApiHandler
import json
from modules.polls import crud


class VoteHandler(ApiHandler):
    def post(self):
        request = self.request.body
        #extract the post body then return
        data = json.loads(request)
        poll = data['poll']
        user = data['user']
        contestant = data['contestant']
        result = crud.vote(user, contestant, poll)
        
        self.render_object(result)

    def get(self):
        result = {"warning": "getting individual contestants is not allowed"}
            
        self.render_object(result)