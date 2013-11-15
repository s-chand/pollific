/**
 * @author Samuel Okoroafor
 * 
 * CreatePollController class
 * 
 * Handles all the data gymnastics for the create poll view
 */

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
        $scope.code="";
        console.log($scope.contestants);
        if ($scope.contestants.length >= 2) {
            $scope.can_create = "disabled";
        };
    };
    $scope.can_create = "";
    $scope.createPoll = function() {

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

