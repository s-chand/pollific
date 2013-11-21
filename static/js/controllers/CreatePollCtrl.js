/**
 * @author Samuel Okoroafor
 *
 * CreatePollController class
 *
 * Handles all the data gymnastics for the create poll view
 */

function CreatePollController($scope, pollService, authService) {
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
        $scope.code = "";
        console.log($scope.contestants);
    };
    $scope.can_create = "";
    $scope.$watch('contestants', function(newVal, oldVal) {
        $scope.can_create = newVal.length >= 2 ? "disabled" : "";
        $scope.add_button_class = newVal.length >= 2 ? "btn-danger" : "btn-success";
    }, true);
    $scope.createPoll = function() {

        var conts = $scope.contestants;
        var title = $scope.title;
        var pollInfo = $scope.pollInfo;
        var poll = {};
        var userData = authService.getLoggedInUser();
        userData.success(function(result) {
            if (result.user_id && result.logout_url) {
                poll.ownerID = result.user_id;
                poll.title = title;
                poll.description = pollInfo;
                //poll.ownerID = "samuelOkoroafor";
                poll.contestants = conts;
                poll.type = $scope.type;
                poll.status = "published";
                //var result = pollService.postPoll(poll);
                //$scope.polls.splice(1, 0, poll);
                console.log(poll);
                var result = pollService.postPoll(poll);
                result.success(function(output) {
                    alertify.success("Poll Created Successfully!");
                    sclass = "alert alert-block alert-success";
                    $scope.result = "";
                    console.log(output);
                    $scope.result = 'Poll created successfully';
                });
            }
        });
        //$scope.createResult.class="alert alert-success";
        $scope.clear();

    };
    $scope.remove = function(index) {
        $scope.contestants.splice(index, 1);

    }
    $scope.clear = function() {
        $scope.title = "";
        $scope.pollInfo = "";
        $scope.code = "";
        $scope.contestants = [];
    }
}

