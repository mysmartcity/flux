'use strict';

angular.module('fluxApp')
    .controller('SettingsCtrl', function ($scope, User, Auth) {
        $scope.errors = {};

        $scope.updateCategories = function(categorie) {
            var data = [];

            for (var cat in categorie) {
                if (categorie[cat] === true) {
                    data.push(cat);
                }
            }
            Auth.categoriesUpdate(cat);
        };

        $scope.updateFrequency = function(frequencies) {
            var data = [];

            console.log(frequencies)

            for (var cat in frequencies) {
                if (frequencies[cat] === "true") {
                    data.push(cat);
                }
            }

            Auth.frequenciesUpdate(data);
        };

        $scope.changePassword = function(form) {
            $scope.submitted = true;
            if(form.$valid) {
                Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
                    .then( function() {
                        $scope.message = 'Password successfully changed.';
                    })
                    .catch( function() {
                        form.password.$setValidity('mongoose', false);
                        $scope.errors.other = 'Incorrect password';
                        $scope.message = '';
                    });
            }
        };
    });
