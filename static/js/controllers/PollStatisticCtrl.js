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
    /*Its is expected that the pollID is passed as a parameter.
     * This data is used to query for poll details
     *
     */
    var pollResult = {};
    var votesbrac = [];
    var query = pollService.getPollById($routeParams.id)
    //process the query promise
    query.success(function(poll) {
        //collect all the poll detail needed for rendering the statistic
        pollResult.title = poll.title;
        pollResult.desc = poll.description;
        pollResult.author = poll.ownerID;
        pollResult.type = poll.type;
        pollResult.status = poll.status;
        pollResult.id = poll.poll_id;
    });

    //query for this poll's statistic
    var statquery = pollService.getVotes($routeParams.id);
    statquery.success(function(stat) {
        //process the stat promise

        //we already have the poll details. we need the contestants info
        pollResult.totalVotesCount = stat.poll_count;
        //loop through the contestants list and process each entry
        var resultCollection = stat.poll_results;
        console.log(resultCollection);
        pollResult.contestants = [];
        angular.forEach(resultCollection, function(value, key) {
            //console.log(value.contestant_id);
            //call the pollService
            var contestantInfo = pollService.getContestant(value.contestant_id);
            contestantInfo.success(function(contestant) {
                //store the contestant entry inthe pollResult object
                pollResult.contestants[key] = contestant;
                if (contestant.contestant_id == stat.poll_results[key].contestant_id) {
                    pollResult.contestants[key].votes = stat.poll_results[key].votes;
                    votesbrac[key] = [pollResult.contestants[key].name,pollResult.contestants[key].votes];
                }
            });
        });
        console.log(pollResult);
        $scope.data2 = pollResult;

        //bring in the charts :) \o/

        $scope.chart = {
            options : {
                chart : {
                    plotBackgroundColor : null,
                    plotBorderWidth : null,
                    plotShadow : false
                }
            },
            tooltip : {
                pointFormat : '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions : {
                pie : {
                    allowPointSelect : true,
                    cursor : 'pointer',
                    dataLabels : {
                        enabled : true,
                        color : '#000000',
                        connectorColor : '#000000',
                        format : '<b>{point.name}</b>: {point.percentage:.1f} %'
                    }
                }
            },
            series : [{
                name : "Votes",
                data : votesbrac,
                type : 'pie'
            }],
            title : {
                text : pollResult.title
            },
            loading : false
        }

    });
}
