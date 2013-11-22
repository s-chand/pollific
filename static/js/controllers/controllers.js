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

/**
 * @author Samuel Okoroafor
 *
 *
 * PollDetailsController class
 *
 * Handles all the gymnastics for the pollDetails view
 */

function PollDetailController($scope, $routeParams, pollService, authService) {
    //a model to control the display text on  the button
    //the idea is to scope features for the buttons such that they can be manipulated all at once
    /**
     *
     * Check the user's login details before setting these values
     */
    $scope.contestants = [];
    var userData = authService.getLoggedInUser();
    userData.success(function(result) {
        $scope.user_id =result.user_id;
    });
    var data = pollService.getPollById($routeParams.id);
    data.success(function(d) {
        $scope.poll = d;
        var data2 = pollService.getContestants($scope.poll.poll_id);
        data2.success(function(result) {
            angular.forEach(result.contestants, function(value) {
                person = {};
                person.class = "btn-success";
                person.disabled = false;
                person.id = value.contestant_id;
                person.information = value.information;
                person.code = value.code;
                person.name = value.name;
                person.display = "vote";
                person.photoUrl = value.photoUrl;
                $scope.contestants.push(person);
                if ($scope.poll.user_vote.user_voted === true) {
                    if ($scope.poll.user_vote.contestant_voted == value.contestant_id) {
                        person.class = "btn-danger";
                        person.disabled = true;
                        person.display = "voted";
                    };
                };
            });
        });
    });

    $scope.poll = data;

    $scope.vote = function(index) {
        c = $scope.contestants[index];
        alertify.success("Voting....");
        var voter = $scope.user_id;
        var voteData = {
            voter : voter,
            contestant : c.id,
            value : "Yes"
        };

        var data = pollService.vote($scope.poll.poll_id, voteData);
        $scope.contestants[index].disabled = true;
        $scope.contestants[index].display = "voted";
        data.success(function(result) {
            if (result.error) {
                alertify.error("Oh snap! You cannot vote twice");
            }
            angular.forEach($scope.contestants, function(value) {
                value.disabled = false;
                value.class = "btn-success";
                $scope.contestants[index].display = "vote";
            });
            
            $scope.contestants[index].class = "btn-danger";
            $scope.contestants[index].disabled = true;
            $scope.contestants[index].display = "voted";
            alertify.success("....voted");
        });
    };
}

/**
 * @author Samuel Okoroafor
 * 
 * PollsList class
 * 
 * 
 * Responsible for the rendering and display of the timeline for polls
 */
//the poll list Controller
function PollListController($scope, pollService) {

    //pass in the service to get the list of mock polls
    //console.log(pollService.getUserId());
    $scope.username="Samuel Okoroafor";
    var data = pollService.getPolls();
    data.success(function(d) {
        $scope.polls = d;
        console.log("smokes");
    });
    console.log(data);
}


/**
 * @author Samuel Okoroafor
 * 
 * 
 * PollStatsController class
 * 
 * Handles the display of statistic for a poll
 */
function PollStatsController($scope, $routeParams, pollService) {
    //Get the Poll statistics
    var data = pollService.getPolls();
    data.success(function(pollss){
 
    console.log(pollss);
    var pollStat = {};
    for (var i = 0; i < pollss.length; i++) {
        if (pollss[i].poll_id == $routeParams.id) {
            console.log(pollss);
            pollStat = pollss[i];
        }
        $scope.pollStatistic = pollStat;
        $scope.pollId=pollStat.poll_id;
        console.log($scope.pollId);
    }
    var data2=pollService.getVotes($scope.pollId);
    data2.success(function(result){
        if(result.error)
        {
            $scope.pollStatistic.voteCount=0;
        }
        else{
            
            //process the statistics
       $scope.pollStatistic.voteCount=result; 
       
       }
    });
    });
    //call the pollService to get the voteCount
    
}

/**
 * @author Samuel Okoroafor
 * 
 * PollsVotedController class
 */


function PollsVotedController($scope, pollService) {
    var data = pollService.getPolls();
    data.success(function(d) {
        $scope.polls = d;
        
    });
}
/**
 * @author Samuel Okoroafor
 * 
 * PollsCreated controller class
 */

function CreatedPollsController($scope, pollService) {
    var data = pollService.getPolls();
    data.success(function(d) {
        $scope.polls = d;
    });
}

angular.module("PollPlus").controller('NavCtrl',function($scope){
    $scope.usn="Samuel Okoroafor";
});