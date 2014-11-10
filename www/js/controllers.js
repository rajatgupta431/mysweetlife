
//Group of Controllers

var rootUser = '';
angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope,$http,$ionicModal,$ionicLoading,$ionicPopup,$timeout, $rootScope) {
  
  //Ionic Loader
  $scope.show = function() {
    $ionicLoading.show({
      template: '<button class="button button-stable"><i class="icon ion-loading-c">.</i>\ \ \ \ Keep Calm...</button>'
    });
  };
  $scope.hide = function(){
    $ionicLoading.hide();
  };

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.oModal = modal;
  });
  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.oModal.hide();
  };
  // Open the login modal
  $scope.login = function() {
    $scope.oModal.show();
  };

  //Custom Pop Up!
  $scope.showAlert = function(d) {
    var alertPopup = $ionicPopup.alert({
      title: 'Server Response',
      template: '<h4><b>'+d.status+'</b></h4>'
    });
  };
  $scope.showAlert2 = function(d) {
    var alertPopup = $ionicPopup.alert({
      title: 'Server Response',
      template: '<h4><b>'+d.status+'</b></h4><br><b>'+d.message+'</b>'
    });
    if(d.status==true)
      $scope.closeLogin();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function(d) {
    $scope.show();
    $http.post('http://mysweetlife.herokuapp.com/login', {
      username:d.username,
      password: d.password
    })
    .success(function(data, status, headers, config) {
      $scope.hide();
      if(data.status==true)
        rootUser = data.username;
      $scope.showAlert2(data);
    });
  };

  $scope.doReg = function(d) {
    $scope.show();
    $http.post('http://mysweetlife.herokuapp.com/register', {
      name:d.name,
      username: d.username,
      password: d.password
    })
    .success(function(data, status, headers, config) {
      $scope.hide();
      $scope.showAlert(data);
    });
  };
})

.controller('SearchCtrl', function($scope,$http,$ionicLoading,$ionicModal) {

  //Inbuilt IonicLoading()
  $scope.show = function() {
    $ionicLoading.show({
      template: '<button class="button button-stable"><i class="icon ion-loading-c">.</i>\ \ Loading...</button>',
      noBackdrop : false
    });
  };

  $scope.hide = function(){
    $ionicLoading.hide();
  };

  // Custom Ionic Modal for Loader ->
  /*$ionicModal.fromTemplateUrl('templates/new.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.oModalLoad = modal;
  });

  $scope.closeLoad = function() {
    $scope.oModalLoad.hide();
  };
  $scope.openLoad = function() {
    $scope.oModalLoad.show();
  };
  //Ionic Modal Loader Ends here!
  */
  $scope.searchFood = function(foods) {
    $scope.show();
    $http.get("http://mysweetlife.herokuapp.com/search?item="+foods)
    .success(function(response) {
      if(response.error)
        $scope.names = null;
      else
        $scope.names = response;
      $scope.hide();
    }); 
  };
}) 

.controller('HomeCtrl', function($scope) {

}) 

.controller('TreatmentCtrl', function($scope,$ionicModal,$http,$ionicPopup,$ionicLoading, $rootScope) {

    $scope.showAlert = function(d) {
      var alertPopup = $ionicPopup.alert({
        title: 'Submission Result',
        template: '<h4><b>'+d.status+'</b></h4>'
      });
    };

    $scope.show = function() {
      $ionicLoading.show({
        template: '<button class="button button-stable"><i class="icon ion-loading-c">.</i>\ \ \ \ Keep Calm...</button>'
      });
    };

    $scope.hide = function(){
      $ionicLoading.hide();
    };

    $scope.showConfirm = function(d) {
      var confirmPopup = $ionicPopup.confirm({
        title: '<i class="icon ion-help-circled">&nbsp;</i>Treatment Data&nbsp;<i class="icon ion-help-circled"></i>',
        template: "Entered By : "+d.enteredBy+"<br>Event Type : "+d.eventType+"<br>Glucose Value : "+d.glucoseValue+"<br> Glucose Type : "+d.glucoseType+"<br>Carbs Given : "+d.carbsGiven+"<br>Insulin Given : "+d.insulinGiven+"<br>Notes : "+d.notes
      });

      confirmPopup.then(function(res) {
        if(res) {
          $scope.show();
          $http.post('http://mysweetlife.herokuapp.com/treatment', {
            username : rootUser,
            enteredBy:d.enteredBy,
            eventType:d.eventType,
            glucoseValue:d.glucoseValue,
            glucoseType:d.glucoseType,
            carbsGiven:d.carbsGiven,
            insulinGiven:d.insulinGiven,
            notes:d.notes
          })
          .success(function(data, status, headers, config) {
            $scope.hide();
            $scope.showAlert(data);
          });
        } 
        else {
          $scope.d={};
        }
      });
    };
  

    $ionicModal.fromTemplateUrl('templates/treatlist.html', {
      scope: $scope
    }).then(function(modal) {
      $scope.oModaltreatment = modal;
    });
    
    /*
      $scope.treatmentSubmit = function(d) {
        $http.post('http://mysweetlife.herokuapp.com/treatment', {
          enteredBy:d.enteredBy,
          eventType:d.eventType,
          glucoseValue:d.glucoseValue,
          glucoseType:d.glucoseType,
          carbsGiven:d.carbsGiven,
          insulinGiven:d.insulinGiven,
          notes:d.notes
        })
        .success(function(data, status, headers, config) {
      })
    };
    */

    $scope.showTreatList = function() {
       $scope.show();
      $scope.oModaltreatment.show();
      $scope.treatList();
    };

    $scope.closeTreatList = function() {
       screen.unlockOrientation('Potrait');
       screen.unlockOrientation();
      $scope.oModaltreatment.hide();

    };

    $scope.treatList = function() {
      $http.get('http://mysweetlife.herokuapp.com/treatment?username='+rootUser)
        .success(function(response) {
          $scope.treatments = response.reverse() ;
         var day = moment( $scope.treatments.createdAt);
          $scope.treatments.createdAt= day;
        screen.lockOrientation('landscape');
           $scope.hide();
    })
  };
});
