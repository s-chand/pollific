/**
 * @author tomiwa
 */'use strict';


angular.module('pollific', [])
.config(['$routeProvider',
    function($routeProvider) {
        $routeProvider.when('/', {
            templateUrl : 'static/tmpl/index.html',
            controller : 'MainCtrl'
        }).when('/polls', {
            templateUrl : 'static/tmpl/polls.html',
            controller : 'PollsCtrl'
        }).otherwise({
            redirectTo : '/'
        });
    }])
.factory('polls', ['$http', function($http){
    var baseUrl = "/api/polls";
    return {
        get : function(poll_id) {
            return $http.get(baseUrl + '/' + poll_id);
        },
        save : function(poll) {
            var url = poll.id ? baseUrl + '/' + poll_id : baseUrl;
            return $http.post(url, poll);
        },
        query : function() {
            return $http.get(baseUrl + '/');
        }
    };
}]);

var MainCtrl = function($scope, polls) {
    $scope.polls = polls.query();
    $scope.greetings = "Hello World, You are the last dragon";
};

var PollsCtrl = function($scope) {
    $scope.greetings = "Hello World, You are now in Pollific";
};
