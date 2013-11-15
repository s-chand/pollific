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
    var pollss = pollService.getPolls();
    var pollStat = {};
    for (var i = 0; i < pollss.length; i++) {
        if (pollss[i].id == $routeParams.id) {
            pollStat = pollss[i];
        }
        $scope.pollStatistic = pollStat;
    }
}

