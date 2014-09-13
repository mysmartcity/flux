'use strict';

angular.module('fluxApp')
    .controller('SettingsCtrl', function ($scope, User, Auth) {
        $scope.errors = {};

        $scope.updateCategories = function(categorie) {
            console.log("categories updated")
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