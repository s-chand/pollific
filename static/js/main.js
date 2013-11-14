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
//the poll list Controller
function PollListController($scope, pollService) {
	//pass in the service to get the list of mock polls
	//console.log(pollService.getUserId());
	var data = pollService.getPolls();
	data.success(function(d) {
		$scope.polls = d;
		console.log("smokes");
	});
	console.log(data);
}

function CreatePollController($scope, pollService) {
	//{"desc": "This is the content of my first poll", "title": "First Poll", "id": 5275456790069248}
	//Poll details
	//Call service to get Poll ID

	//var userId = pollService.getUserId();
	//$scope.polls = pollService.getPolls();
	$scope.contestants = [];
	$scope.pollTypes = pTypes;
	$scope.addContestant = function() {
		$scope.contestants.splice(1, 0, {
			name : $scope.fullname,
			information : $scope.info,
			code : $scope.code,
			photoURL : "/static/img/python.png",
		});
		$scope.fullname = "";
		$scope.info = "";
	};
	$scope.createPoll = function() {

		/* var object = {user: userId, title: title, desc: pollInfo};
		 var pollID = pollService.postPoll(object);
		 //Use the retrieved pollID to post contestants
		 for(var i=0;i<$scope.contestants.length;i++)
		 {
		 $scope.contestants[i].id=pollID;
		 }
		 var response = pollService.postContestants(pollID,$scope.contestants);
		 console.log("Final Post result: " + response);*/

		var conts = $scope.contestants;
		var title = $scope.title;
		var pollInfo = $scope.pollInfo;
		var poll = {};
		poll.title = title;
		poll.description = pollInfo;
		poll.ownerID = "samuelOkoroafor";
		poll.contestants = conts;
		poll.type = $scope.type;
		poll.status = "published";
		//var result = pollService.postPoll(poll);
		//$scope.polls.splice(1, 0, poll);
		console.log(poll);
		var result = pollService.postPoll(poll);
		result.success(function(output) {
			console.log("output");
			console.log(output);
		});
		$scope.result = "";
		$scope.result = 'Poll created successfully';
		//$scope.createResult.class="alert alert-success";
		$scope.clear();

	};
	$scope.remove = function(index) {
		$scope.contestants.splice(index, 1);

	}
	$scope.clear = function() {
		$scope.title = "";
		$scope.pollInfo = "";
		$scope.contestants = [];
	}
}

function PollDetailController($scope, $routeParams, pollService) {
	//a model to control the display text on  the button
	$scope.action = "Vote";

	var data = pollService.getPollById($routeParams.id); //get the details for the poll in question
	data.success(function(d) { //if the operation was successful use it to create the poll object for the scope
		$scope.poll = d;
		var data2 = pollService.getContestants($scope.poll.poll_id);// gets the list of contestants for this particular polls
		data2.success(function(result) { //if the get request succeeds, add them to the list of contestants
			$scope.poll.contestants = result.contestants;
			
		});
	});

	$scope.poll = data;

	$scope.vote = function() {
		var result = confirm("Are you sure?");
		if (result == true) {
			alert("Vote casted!");
		}
	}
}

function PollStatsController($scope, $routeParams, pollService) {
	//Get the Poll statistics
	var pollss = pollService.getPolls();
	var pollStat = {};
	for (var i = 0; i < pollss.length; i++) {
		if (pollss[i].id == $routeParams.id) {
			pollStat = pollss[i];
		}
		$scope.pollStatistic = pollStat;
	}
}

function PollsVotedController($scope, pollService) {
	$scope.polls = pollService.getPolls();
}

function CreatedPollsController($scope, pollService) {
	$scope.polls = pollService.getPolls();
}
