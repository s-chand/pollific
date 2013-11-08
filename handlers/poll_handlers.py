import json

from modules.polls import crud
from handlers.index import ApiHandler


class PollsHandler(ApiHandler):
    def get(self):
        result = crud.getPolls()
        
        self.render_object(result)

    def post(self):
        request = self.request.body
        #extract the post body then return
        data = dict(json.loads(request))
        user = data['user']
        title = data['title']
        desc = data['desc']
        if data.keys().__contains__('contestants'):
            contestants = list(data['contestants'])
            if len(contestants) > 0:
                result = crud.makePoll(user, title, desc, contestants)
        else:
            result = crud.makePoll(user, title, desc)




        self.render_object(result)


class PollHandler(ApiHandler):
    def get(self, id=None):
        if id:
            result = crud.getPoll(id)
        else:
            result = {"error": "no id specified"}
            
        self.render_object(result)

class ContestantsHandler(ApiHandler):
    def post(self):
        request = self.request.body
        #extract the post body then return
        data = json.loads(request)
        name = data['name']
        poll = data['poll']
        img = data['img']
#       img = data['img']
        result = crud.addContestant(name, poll, img)
        
        self.render_object(result)


    def get(self, poll_id):
        result = {"warning": "we are working hard to get this working"}
            
        self.render_object(result)
        
