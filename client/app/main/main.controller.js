'use strict';

angular.module('fluxApp')
    .controller('MainCtrl', function ($scope, $http) {
        $http.get('/api/news').success(function(news) {
            var unicodeReplace = function(text) {
                text = text.replace(/\\u0163/g, "\u0163");
                text = text.replace(/\\u0103/g, "\u0103");
                text = text.replace(/\\u015f/g, "\u015f");
                text = text.replace(/\\u00ee/g, "\u00ee");
                text = text.replace(/\\u00e2/g, "\u00e2");
                text = text.replace(/\\u00a0/g, "\u00a0");
                text = text.replace(/\\u021b/g, "\u021b");
                text = text.replace(/\\u201d/g, "\u201d");
                text = text.replace(/\\u201e/g, "\u201e");
                text = text.replace(/\\u2013/g, "\u2013");
                return text;
            };

            for (var i = 0 ; i < news.length; i++ ) {
                news[i].title = unicodeReplace( news[i].title );
                news[i].content = unicodeReplace( news[i].content );
            }
            $scope.news = news;

        });

        $scope.openNewsURL = function(url) {
            top.location.href = url;
        };
//        $scope.$on('$destroy', function () {
//            socket.unsyncUpdates('thing');
//        });
    });
