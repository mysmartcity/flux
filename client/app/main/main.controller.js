'use strict';

angular.module('fluxApp')
    .controller('MainCtrl', function ($scope, $http, socket) {
        $http.get('/api/news').success(function(news) {
            $scope.news = news;
//      socket.syncUpdates('thing', $scope.awesomeThings);
        });

        $scope.openNewsURL = function(url) {
            top.location.href = url;
        };

        $scope.$on('$destroy', function () {
            socket.unsyncUpdates('thing');
        });
    });
