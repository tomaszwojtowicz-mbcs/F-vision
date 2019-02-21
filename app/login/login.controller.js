angular
    .module('f-vision')
    .controller('LoginController', ['$scope', '$state', 'authService', 'profileService', '$location', function ($scope, $state, authService, profileService, $location) {

        button = document.getElementById('login_btn');

        $scope.username = '';
        $scope.password = '';

        $scope.ProcessLogin = function () {

            //just in case the previous user did not logout
            authService.logout();

//            async function makeAPICall() {
//                result = authService.login($scope.username, $scope.password)
//            }
//
//            makeAPICall().then(() => {
//
//                showConfirmation(button, true, 'Logging in', 2000);
//
//                // show different starting page for each userType
//                switch (profileService.currentProfile.userType) {
//
//                    case "student":
//
//                        $scope.$apply(function () {
//                            $location.path('/dashboard');
//                        });
//                        break;
//
//                    case "admin":
//
//                        $scope.$apply(function () {
//                            $location.path('/userManagement');
//                        });
//                        break;
//                }
//
//            }, function (err) {
//                showConfirmation(button, false, 'Failed to log in!', 3000);
//            });
//
//            //            });








                        authService.login(this.username, this.password).then(function (response) {
            
                            showConfirmation(button, true, 'Logging in', 2000);
            
                            // Simplistic mitigation for delay in getting the reponse back from the API
                            setTimeout(function () {
            
                                // show different starting page for each userType
                                switch (profileService.currentProfile.userType) {
            
                                    case "student":
            
                                        authService.defaultAuthenticatedRoute = '/dashboard';
                                        $scope.$apply(function () {
                                            $location.path('/dashboard');
                                        });
                                        break;
            
                                    case "admin":
            
                                        authService.defaultAuthenticatedRoute = '/userManagement';
                                        $scope.$apply(function () {
                                            $location.path('/userManagement');
                                        });
                                        break;
                                }
                            }, 1000); // wait 1 second before attemping to obtain user profile from the service
            
                        }, function (err) {
                            showConfirmation(button, false, 'Failed to log in!', 3000);
                        });
        };

        function showConfirmation(button, success, confirmationText, delay) {
            defaultText = button.value;

            tmpClass = success ? 'btn-success font-weight-bold' : 'btn-danger font-weight-bold';

            $(button).removeClass('btn-primary');
            $(button).addClass(tmpClass);
            $(button).attr('disabled', true);
            // for some reason doing the same with jqery did not work!
            button.value = confirmationText;

            setTimeout(function () {
                $(button).removeClass(tmpClass);
                $(button).addClass('btn-primary');
                button.value = defaultText;
                $(button).attr('disabled', false);

                editingExistingFlag = false;
                addingNewFlag = false;
                // UI did not update without reloading - weird
                $scope.$digest();
            }, delay);
        }
    }]);
