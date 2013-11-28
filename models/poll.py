from google.appengine.ext import ndb

class Poll(ndb.Model):
    ownerID = ndb.StringProperty()
    title = ndb.StringProperty()
    description = ndb.TextProperty()
    type = ndb.StringProperty() # Private or public, rite?
    status = ndb.StringProperty()  #....Published or not
    date_added = ndb.DateProperty(auto_now_add=True)

    def _to_dict(self, include=None, exclude=None):
        crap = self.to_dict()
        crap['id'] = self.key.id()
        return crap

    
class Contestant(ndb.Model):
    poll = ndb.StringProperty()
    name = ndb.StringProperty()
    information = ndb.StringProperty()
    photoURL = ndb.StringProperty()
    code= ndb.StringProperty()

    
class Vote(ndb.Model):
    poll= ndb.StringProperty()
    contestant = ndb.StringProperty()
    voter =ndb.StringProperty()
    value = ndb.StringProperty()
    date_added = ndb.DateProperty(auto_now_add=True)

class Comment(ndb.Model):
    poll_id = ndb.StringProperty()
    user_id = ndb.StringProperty()
    comment = ndb.StringProperty()
    date_added = ndb.DateProperty(auto_now_add=True)

