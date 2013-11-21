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

