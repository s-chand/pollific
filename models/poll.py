from google.appengine.ext import ndb

class Poll(ndb.Model):
    author = ndb.StringProperty()
    title = ndb.StringProperty()
    desc = ndb.TextProperty()
    expire_date = ndb.DateTimeProperty()
    
class Contestant(ndb.Model):
    poll = ndb.StringProperty()
    name = ndb.StringProperty()
    img = ndb.StringProperty()
    
class Vote(ndb.Model):
    poll= ndb.StringProperty()
    contestant = ndb.StringProperty()
    user =ndb.StringProperty()
    value = ndb.BooleanProperty()
