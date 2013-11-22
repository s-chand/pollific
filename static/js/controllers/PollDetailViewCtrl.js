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
                person.photoUrl = value.photoUrl;
                $scope.contestants.push(person);
                if ($scope.poll.user_vote.user_voted === true) {
                    if ($scope.poll.user_vote.contestant_voted == value.contestant_id) {
                        person.class = "btn-danger";
                        person.disabled = true;
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
        data.success(function(result) {
            if (result.error) {
                alertify.error("Oh snap! You cannot vote twice");
            }
            angular.forEach($scope.contestants, function(value) {
                value.disabled = false;
                value.class = "btn-success";
            });
            
            $scope.contestants[index].class = "btn-danger";
            $scope.contestants[index].disabled = true;
        });
    };
}

