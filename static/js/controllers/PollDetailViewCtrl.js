/**
 * @author Samuel Okoroafor
 * 
 * 
 * PollDetailsController class
 * 
 * Handles all the gymnastics for the pollDetails view
 */

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


