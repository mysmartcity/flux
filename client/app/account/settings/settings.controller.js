'use strict';

angular.module('fluxApp').controller('SettingsCtrl', function ($scope, User, Auth) {
        $scope.errors = {};
        $scope.categorie = {};
        $scope.frequency = '';
        $scope.message = '';

        var i, currentUser = Auth.getCurrentUser();

        for (i in currentUser.categories){
            $scope.categorie[currentUser.categories[i]] = true;
        }
        for (i in currentUser.frequencies){
            $scope.frequency = currentUser.frequencies[i];
        }

        $scope.update = function() {
            $scope.message = "";

            var data = [];

            for (var cat in $scope.categorie) {
                if ($scope.categorie[cat] === true) {
                    data.push(cat);
                }
            }
            if ( data.length > 0 ) {
                Auth.categoriesUpdate(data)
                    .success(function () {
                        $scope.message += "Noile categorii au fost salvate! ";
                    })
                    .error(function() {
                        $scope.message += "Noile categorii nu au fost salvate! ";
                    });
            }

            Auth.frequenciesUpdate([$scope.frequency])
                .success(function(){
                    $scope.message += "Frecventa la care doriti sa fiti notificati a fost salvata!";
                })
                .error(function() {
                    $scope.message += "Frecventa nu a putut fi salvata!";
                });
        };

        $scope.changePassword = function(form) {
            $scope.submitted = true;
            if(form.$valid) {
                Auth.changePassword( $scope.user.oldPassword, $scope.user.newPassword )
                    .then( function() {
                        $scope.message = 'Parola a fost schimbata cu succes!<br/>';
                    })
                    .catch( function() {
                        form.password.$setValidity('mongoose', false);
                        $scope.errors.other = 'Parola Incorecta';
                        $scope.message = '';
                    });
            }
        };
    });
