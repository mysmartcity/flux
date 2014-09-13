'use strict';

angular.module('fluxApp')
  .controller('MainCtrl', function ($scope, $http, socket) {

//    $http.get('/api/news').success(function(awesomeThings) {
      $scope.news = [
          {date: new Date(2014, 9, 12), category: "transport", url: "www.mt.ro/stiri/anunt.html",title: "Ministerul transporturilor",content: "stire ne spune ca ..."},
          {date: new Date(2014, 9, 13), category: "sport", url: "www.mts.ro/stiri/comunicat.html",title: "Anunt sportiv",content: "eveniment in cadrul festivitatii sportive"}
      ];
//      socket.syncUpdates('thing', $scope.awesomeThings);
//    });

    $scope.addThing = function() {
      if($scope.newThing === '') {
        return;
      }
      $http.post('/api/things', { name: $scope.newThing });
      $scope.newThing = '';
    };

    $scope.deleteThing = function(thing) {
      $http.delete('/api/things/' + thing._id);
    };

    $scope.$on('$destroy', function () {
      socket.unsyncUpdates('thing');
    });
  });
