angular.module("PollPlus").services.factory('UserService', [
function() {
    var sdo = {
        isLogged : false,
        username : '',
        login_url : '',
        logout_url : '',
        
        login: function(){
            isLogged: true;
        }
    };
    return sdo;
}]);
