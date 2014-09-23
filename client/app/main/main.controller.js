'use strict';

angular.module('fluxApp')
    .controller('MainCtrl', function ($scope, $http, socket) {
        $http.get('/api/news').success(function(news) {
            $scope.news = news;
        });

        $scope.openNewsURL = function(url) {
            console.log(url)
            top.location.href = url;
        };
//        $scope.$on('$destroy', function () {
//            socket.unsyncUpdates('thing');
//        });
    });
