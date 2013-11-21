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
    //the idea is to scope features for the buttons such that they can be manipulated all at once
    /**
     *
     * Check the user's login details before setting these values 
     */
    $scope.action = "Vote";
    $scope.actionReverse="Unvote";
    $scope.isEnabled="false";
    $scope.status='';
    $scope.btnClass="btn btn-success btn-block";
    //btn btn-large btn-success btn-block
    
    var data = pollService.getPollById($routeParams.id); //get the details for the poll in question
    data.success(function(d) { //if the operation was successful use it to create the poll object for the scope
        $scope.poll = d;
        var data2 = pollService.getContestants($scope.poll.poll_id);// gets the list of contestants for this particular polls
        data2.success(function(result) { //if the get request succeeds, add them to the list of contestants
            $scope.poll.contestants = result.contestants;
            
        });
    });

    $scope.poll = data;

    $scope.vote = function(contestantId,pollId,index) {
       alertify.success("Voting....");
       console.log(index);
       //Logic: User clicks vote
       //Change button to unvote and disable other buttons
       var voter="samuel.i.okoroafor@gmail.com";
       var voteData={voter:voter,contestant:contestantId,value:"Yes"};
       
       //call the pollService and cast the vote
       var data=pollService.vote(pollId,voteData);
       data.success(function(result){
          console.log(result); 
          if(result.error)
          {
              alertify.error("Oh snap! You cannot vote twice");
          }
       });
       $scope.btnClass="btn btn-danger btn-block";
       $scope.action=$scope.actionReverse;
       $scope.status='true';
       console.log(pollId);
    }
}


