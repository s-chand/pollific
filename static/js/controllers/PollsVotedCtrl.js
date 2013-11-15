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
