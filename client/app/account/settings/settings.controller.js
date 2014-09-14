'use strict';

angular.module('fluxApp')
    .controller('SettingsCtrl', function ($scope, User, Auth) {
        $scope.errors = {};
        $scope.categorie = {};
        $scope.frequency = 'daily';
        var i, currentUser = Auth.getCurrentUser();

        for (i in currentUser.categories){
            $scope.categorie[currentUser.categories[i]] = true;
        }
        for (i in currentUser.frequencies){
            $scope.frequency = currentUser.frequencies[i];
        }

        $scope.updateCategories = function(categorie) {
            var data = [];

            for (var cat in categorie) {
                if (categorie[cat] === true) {
                    data.push(cat);
                }
            }
            Auth.categoriesUpdate(data).success(function(){
                $('#notify').html("Noile categorii au fost salvate").show().fadeOut(2000);
            });
        };

        $scope.updateFrequency = function() {
            Auth.frequenciesUpdate($scope.frequency).success(function(){
                $('#notify').html("Frecventa la care doriti sa fiti notificati a fost salvata").show().fadeOut(2000);
            });;
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
