import logging
__author__ = 'Tomiwa Ijaware'

__modified_by__ = 'Adekola Adebayo'
from models.poll import Poll, Vote, Contestant
from google.appengine.ext import ndb


def makePoll(ownerID, title, desc, type, status, contestants=None):
    nPoll = Poll(title=title, description=desc, ownerID=ownerID,type=type, status=status)
    key = nPoll.put()
    id = str(key.id())
    contestants_results = []
    if contestants is not None:
        for c in contestants:
           contestant_result = addContestant(c['name'], id, c['img'], c['info'], c['code'])
           contestants_results.append(contestant_result)

    result = {"poll_id": id, "title": title, "description": desc, "ownerID": ownerID, "contestants": contestants_results }
    return result

#this method is used by the makePoll method above to create contestants to a Poll on the fly
def addContestant(name, poll, img, info, code=""):
    c = Contestant(name=name, poll=poll, photoURL=img, information=info, code=code)
    c.put()
    result = {
        "name": name,
        "poll_id": poll,
        "contestant_id": str(c.key.id()),
        "photoURL": img,
        "information": info,
        "code": code
    }
    return result

#this returns a list of polls with lil details - title, description and poll_id
def getPolls(user = None):
    if user:
        query = Poll.query(Poll.ownerId == user).fetch()
    else:
        query = Poll.query()
        
    poll_result = list()
    for p in query:
        poll_item = {"title": p.title, "description": p.description, "poll_id": str(p.key.id()) }
        poll_result.append(poll_item)

    return poll_result

#this retrieves full details of a poll whose id is supplied
def getPollDetails(poll_id):
    poll = Poll.get_by_id(int(poll_id))
    if poll:
        result = {
            "poll_id": id,
            "title": poll.title,
            "description": poll.description,
            "ownerID": poll.ownerId,
            "status":poll.status,
            "type": poll.type
        }

    else: 
        result = {"error": "No poll found with that Id"}
    
    return result

#this retrieves the list of contestants in a poll
def getPollContestants(poll_id):
    contestants =list()
    for contestant in Contestant.query(Contestant.poll==poll_id):
        contestants.append({"name": contestant.name,"contestant_id": str(contestant.key.id())})

    pool_contestants = {"poll_id": poll_id, "contestants": contestants}

#this votes for a contestant in poll
def vote(voter, contestant, poll, value):
    # step 1. Get the Poll and the User's Entry
    # step 2. 
    votes = Vote.query(Vote.poll==poll and Vote.voter==voter).fetch()
    if not votes: #i.e no votes already cast
        vote = Vote(contestant=contestant, poll=poll, voter=voter, value=value)
        key = vote.put()
        vote_id = str(key.id())
        result= {
        "vote_id": vote_id,
        "poll_id": vote.poll,
        "contestant_id": vote.contestant,
        "value": vote.value
    }
    else:
        result = {"error": "A vote has already been cast in this poll by the voter"}


    return result

#this gets the votes that have been made in a poll...the votes info excludes the id of the voter...since its mostly anonymous
def getVotesInPoll(poll_id):
    votes = Vote.query(Vote.poll == poll_id).fetch()
    if votes: #i.e there have been votes cast in this poll
        votes_list = list()
        for vote in votes:
            votes_list.append({"contestant_voted": vote.contestant, "vote_value": vote.value})

        poll_votes = {"poll_id": poll_id, "poll_votes": votes_list}
        return poll_votes

    else:
        return {"error": "This poll has no votes yet"}


#this gets the details for a given contestant
def getContestantDetails(contestant_id):
    contestant = Contestant.get_by_id(contestant_id)
    if contestant:
        result = {
            "name": contestant.name,
            "information":contestant.information,
            "contestant_id": str(contestant.key.id()),
            "photoURL": contestant.photoURL,
            "code":contestant.code
        }
        return result

    else:
        return {}


# we need to decide if and how unvoting will be done
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
