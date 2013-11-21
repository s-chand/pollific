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
       $scope.pollStatistic.voteCount=result; 
    });
    });
    //call the pollService to get the voteCount
    
}

