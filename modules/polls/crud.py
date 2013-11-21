import logging
__author__ = 'Tomiwa Ijaware'

__modified_by__ = 'Adekola Adebayo'
from models.poll import Poll, Vote, Contestant
from google.appengine.ext import ndb
from collections import Counter
from google.appengine.api import users


def makePoll(ownerID, title, desc, type, status, contestants=None):
   try:
        nPoll = Poll(title=title, description=desc, ownerID=ownerID,type=type, status=status)
        key = nPoll.put()
        id = str(key.id())
        contestants_results = []
        if contestants is not None:
            for c in contestants:
               contestant_result = addContestant(c['name'], id, c['photoURL'], c['information'], c['code'])
               contestants_results.append(contestant_result)

        result = {"poll_id": id, "title": title, "description": desc, "ownerID": ownerID, "contestants": contestants_results }
        return result

   except KeyError as e:
        return {"error": "There has been an error These key(s) are missing: %s"%e }

#this method is used by the makePoll method above to create contestants to a Poll on the fly
def addContestant(name, poll, photoURL, info, code=""):
    try:
         c = Contestant(name=name, poll=poll, photoURL=photoURL, information=info, code=code)
         c.put()
         result = {
        "name": name,
        "poll_id": poll,
        "contestant_id": str(c.key.id()),
        "photoURL": photoURL,
        "information": info,
        "code": code }

         return result
    except:
        return {"error" : "There has been an error"}

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
    user= users.get_current_user()
    user_id = user.user_id()
    try:
        poll = Poll.get_by_id(poll_id)
        if poll is not None:
            result = {
                "poll_id": poll_id,
                "title": poll.title,
                "description": poll.description,
                "ownerID": poll.ownerID,
                "status":poll.status,
                "type": poll.type,
                "date_added": poll.date_added.strftime('%m/%d/%Y'),
                "user_vote": getUserVoteInPoll(user_id, poll_id)
            }

        else:
            result = {"error": "No poll found with that Id"}

    except LookupError as e:
        result = {"error": "There has been an error %s"%e }

    return result

#this retrieves the list of contestants in a poll
def getPollContestants(poll_id):
    contestants =list()
    try:
        for contestant in Contestant.query(Contestant.poll==poll_id):
            contestants.append({"name": contestant.name,"contestant_id": str(contestant.key.id()),
                                "information": contestant.information, "photoURL": contestant.photoURL,
                                "code": contestant.code})
        poll_contestants = {"poll_id": poll_id, "contestants": contestants}
        return poll_contestants

    except LookupError as e:
        result = {"result": "There has been an error: %s"%e }
        return result

#this votes for a contestant in poll
def vote(voter, contestant, poll, value):
    # step 1. Get the Poll and the User's Entry
    # step 2.
    #check if the poll exists!!!!
    votes = Vote.query(Vote.poll==poll, Vote.voter==voter).fetch()
    if votes: #voter has voted in this poll already
        for vote in votes:
             #check if the vote is for an existing contestant,
             # if yes, bounce user,
            if vote.contestant == contestant:
                result = {"error": "Voter has already voted for this contestant "}
            else: #this is a vote for another contestant, remove the one in the db and add the new one
                unvote(voter, vote.contestant, poll, value)
                try:
                    vote = Vote(contestant=contestant, poll=poll, voter=voter, value=value)
                    key = vote.put()
                    vote_id = str(key.id())
                    result            = {
                    "vote_id": vote_id,
                    "poll_id": vote.poll,
                    "contestant_id": vote.contestant,
                    "value": vote.value }
                    return result

                except ValueError as e:
                    result = {"error": "There has been an error %s "%e }

    else: #Voter has not yet cast votes for this poll
        try:
            vote = Vote(contestant=contestant, poll=poll, voter=voter, value=value)
            key = vote.put()
            vote_id = str(key.id())
            result            = {
            "vote_id": vote_id,
            "poll_id": vote.poll,
            "contestant_id": vote.contestant,
            "value": vote.value }
            return result

        except ValueError as e:
            result = {"error": "There has been an error %s "%e }

    return result

#thsi removes a vote for a contestant from a given poll
def unvote(voter, contestant, poll, value):
    votes = Vote.query(Vote.poll==poll, Vote.voter==voter, Vote.contestant==contestant).fetch()
    if votes:
        try:
            for v in votes:
                v.key.delete()
            result = {"result": "Vote successfully removed"}
        except ValueError as e:
            result = {"error": "There has been an error %s "%e }

    else: #Voter has not yet cast votes for this poll
        result = {"error": "Voter has not cast a vote in this poll"}

    return result

#this gets the votes that have been made in a poll...the votes info excludes the id of the voter...since its mostly anonymous
def getVotesInPoll(poll_id):
    try:
        votes = Vote.query(Vote.poll == poll_id).fetch()
        if votes: #i.e there have been votes cast in this poll
            poll_results = list()
            contestants = list()
            for vote in votes:
                contestants.append(vote.contestant)

            summary  = Counter(contestants)
            for key, val in summary.items():
                poll_results.append({"contestant_id": key, "votes": val})

            poll_votes = {"poll_id": poll_id, "poll_results": poll_results}
            return poll_votes

        else:
            return {"error": "This poll has no votes yet"}
    except KeyError as e:
        return {"error": "There has been an error: %s"%e }

#this gets the details for a given contestant
def getContestantDetails(contestant_id):
    try:
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
            return {"error": "No contestant found with that ID"}

    except KeyError as e:
        return {"error": "There has been an error: %s"%e }

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

def getPollsByUser(user_id):
    try:
        polls = Poll.query(Poll.ownerID == user_id).fetch()
        user_polls = list()
        if polls:
            for poll in polls:
                user_polls.append({"poll_id": poll.key.id(), "title": poll.title, "description": poll.description})

            return {"user_id": user_id, "user_polls": user_polls}

        else:
            return {"error": "No Polls have been created by user yet"}

    except LookupError as e:
        return {"error": "There has been an error: %s"%e}

def getPollsUserVoted(user_id):
     try:
        votes = Vote.query(Vote.voter == user_id).fetch()
        user_polls = list()
        if votes:
            for vote in votes:
                poll_vote = Poll.get_by_id(vote.poll)
                user_polls.append({"poll_id": poll_vote.key.id(), "title": poll_vote.title, "description": poll_vote.description})

            return {"user_id": user_id, "user_polls": user_polls}

        else:
            return {"error": "No Polls have been created by user yet"}

     except LookupError as e:
        return {"error": "There has been an error: %s"%e}


def getUserVoteInPoll(user_id, poll_id):
    vote = Vote.query(Vote.voter==user_id, Vote.poll==str(poll_id)).fetch()
    if vote:
        #just the first matching guy
        result = {"contestant_voted": vote[0].contestant}
    else:
        return {"error": "User has not voted in the specified poll"}

