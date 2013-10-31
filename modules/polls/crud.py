import logging
__author__ = 'Tomiwa Ijaware'
from models.poll import Poll, Vote, Contestant
from google.appengine.ext import ndb

def makePoll(user, title, desc):
    nPoll = Poll(title=title, desc=desc, author=user)
    key = nPoll.put()
    id = str(key.id())
    result = {
       "id": id,
       "title": nPoll.title,
       "desc": nPoll.desc,
       "user": nPoll.author 
    }
    return result

def addContestant(name, poll, img):
    c = Contestant(name=name, poll=poll, img=img)
    c.put()
    result = {
        "name": name,
        "poll": poll,
        "id": c.key.id(),
        "img": img
    }
    return result

def getPolls(user = None):
    if user:
        query = Poll.query(Poll.author == user)
    else:
        query = Poll.query()
        
    result = list()
    for p in query:
        pItem = {"title": p.title, "desc": p.desc, "contestants": 'Contestant', 'id': p.key.id()}
        result.append(pItem)

    return result

def getPoll(poll_id):
    
    query = Poll.get_by_id(int(poll_id))
    if query:
        contestants =list()
        for c in Contestant.query(Contestant.poll==str(query.key.id())):
            contestants.append({"name": c.name})
        result = {"id": query.key.id(), "title": query.title, "desc": query.desc, "contestants": contestants}
    else: 
        result = {"error": "No poll found with that Id"}
    
    return result

def vote(user, contestant, poll):
    # step 1. Get the Poll and the User's Entry
    # step 2. 
    votes = Vote.query(Vote.poll==poll and Vote.user==user).fetch()
    if not votes:
        vote = Vote(contestant=contestant, poll=poll, user=user)
    else:
        vote=votes[0]
    vote.value = True
    vote.contestant = contestant
    vote.put()
    result= {
        "id": vote.key.id(),
        "poll": vote.poll,
        "contestant": vote.contestant,
        "value": vote.value
    }
    return result

def removeVote(contestant, poll, user):
    vote = Vote.query(poll=poll, user=user).fetch()
    if not vote:
        return {"warning": "no vote has been made"}
    v = vote[0]
    v.value = False
    v.put()
    return {
        "id": v.key.id(),
        "poll": v.poll,
        "contestant": v.contestant,
        "value": v.value
    } 
