from google.appengine.ext import ndb

class Poll(ndb.Model):
    author = ndb.StringProperty()
    title = ndb.StringProperty()
    desc = ndb.TextProperty()
    expire_date = ndb.DateTimeProperty()

    def _to_dict(self, include=None, exclude=None):
        crap = self.to_dict()
        crap['id'] = self.key.id()
        return crap

    
class Contestant(ndb.Model):
    poll = ndb.StringProperty()
    name = ndb.StringProperty()
    img = ndb.StringProperty()

    
class Vote(ndb.Model):
    poll= ndb.StringProperty()
    contestant = ndb.StringProperty()
    user =ndb.StringProperty()
    value = ndb.BooleanProperty()
