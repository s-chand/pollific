/**
 * Created by LRB on 10/28/13.
 */

var pollplusModule = angular.module("PollPlus", []);
var baseURL = "/api";

var polls = [{
	"id" : 1,
	"title" : "Cloud Hackathon",
	"description" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	"type" : "public",
	"status" : "published",
	"ownerID" : "098876654453678",
	"voteCount" : 76,
	"contestants" : [{
		"name" : "Kola Jamay",
		"information" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		"photoURL" : "/static/img/python.png",
		"code" : "4"
	}, {
		"name" : "Ijaware Tom",
		"information" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
		"photoURL" : "/static/img/python.png",
		"code" : "5"
	}, {
		"name" : "Tobay Tom",
		"information" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
		"photoURL" : "/static/img/python.png",
		"code" : "5"
	}]
}, {
	"id" : 2,
	"title" : "MTN GApps challenge",
	"description" : "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	"type" : "public",
	"status" : "published",
	"ownerID" : "098876654453678",
	"voteCount" : 86,
	"contestants" : [{
		"name" : "Okoro Tugbaski",
		"information" : "Sharp guy",
		"photoURL" : "/static/img/python.png",
		"code" : "4"
	}, {
		"name" : "Babanriga",
		"information" : "Badoo",
		"photoURL" : "/static/img/python.png",
		"code" : "5"
	}]
}];

var pollData = [];
//var deferred=$q.defer();
var pTypes = ['private', 'public'];
pollplusModule.config(function($httpProvider) {
	$httpProvider.defaults.useXDomain = true;
	delete $httpProvider.defaults.headers.common['X-Requested-With'];
});

//Configure the route config
function routeConfig($routeProvider) {
	//The first should be like a timeline of trending Polls
	$routeProvider.when('/', {
		controller : PollListController,
		templateUrl : '/static/tmpl/listUserPolls.html'
	}).
	//next is for creating polls
	when('/createPoll', {
		controller : CreatePollController,
		templateUrl : '/static/tmpl/createPoll.html'
	}).//next is for getting poll statistics of a poll
	when('/poll/:id', {
		controller : PollStatsController,
		templateUrl : '/static/tmpl/pollStats.html'
	}).
	//this controls the polls a user voted in
	when('/pollsVoted', {
		controller : PollsVotedController,
		templateUrl : '/static/tmpl/pollsVoted.html'
	}).
	//Viewing the polls created by a user
	when('/createdPolls', {
		controller : CreatedPollsController,
		templateUrl : '/static/tmpl/createdPolls.html'
	}).
	//this is for viewing a particular poll
	when('/view/:id', {
		controller : PollDetailController,
		templateUrl : '/static/tmpl/pollDetail.html'
	}).otherwise({
		redirectTo : '/'
	});

}

//wire up the config
pollplusModule.config(routeConfig);

//create the pollservice
pollplusModule.factory('pollService', function($http) {
	//access the pollservice and fetch data
	return {
		getPolls : function() {//mock poll objects
			//return polls;
			var url = baseURL + "/polls/";
			return $http.get(url);

		},
		getPollById : function(id) {
			var url = baseURL + "/polls/" + id;
			return $http.get(url);
		},
		//send the json object from the poll
		postPoll : function(data) {
			var url = baseURL + "/polls/";
			/* $http.post(url, data).success(function (result) {
			 console.log("Got this data for the poll ID: " + result);
			 return result;
			 }).error(function (result) {
			 console.log("Error: "+result);
			 });*/
			return $http.post(url, data);

		},
		getContestants : function(pollid) {
			var url = baseURL + '/polls/' + pollid + '/contestants';
			return $http.get(url);

		},
		getContestant : function(contestant_id) {
			var url = baseURL + '/contestants/' + contestant_id;
			return $http.get(url);
		},
		vote : function() {
			// body...

		},
		getUserId : function() {
			var url = '/gateway';
			$http.get(url).success(function(data) {
				console.log("SUCCESS: " + data);
				return data;

			}).error(function(data) {
				console.log("ERROR: " + data);
			})
		}
	}
});


