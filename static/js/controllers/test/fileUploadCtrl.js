angular.module('test', ['angularFileUpload'])

var testUploadCtrl = ['$scope', '$upload', '$http', '$log', function($scope, $upload, $http, $log){    
    refresh_upload_url = function(){
        $http.get('/upload').success(function(data){
            $scope.upload_url = data;
        });
    }
    refresh_upload_url();
    $scope.onFileSelect = function($files) {
    //$files: an array of files selected, each file has name, size, and type.        
    for (var i = 0; i < $files.length; i++) {
      var $file = $files[i];
        
      $scope.upload = $upload.upload({
        url: $scope.upload_url,  
        withCredential: true,
        data: {myObj: $scope.myModelObj},
        file: $file,
        /* set file formData name for 'Content-Desposition' header. Default: 'file' */
        //fileFormDataName: myFile,
        /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
        //formDataAppender: function(formData, key, val){} 
      }).progress(function(evt) {
        console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
      }).success(function(data, status, headers, config) {
          refresh_upload_url();
          $scope.imgUrl = data;
      })
      .error(function(){
          refresh_upload_url();
      });
//      .then(success, error, progress); 
    }
  };
}];