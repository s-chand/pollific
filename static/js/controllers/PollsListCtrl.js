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
    var data = pollService.getPolls();
    data.success(function(d) {
        $scope.polls = d;
        console.log("smokes");
    });
    console.log(data);
}


