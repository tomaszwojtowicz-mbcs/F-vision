app.controller(
    'NavigationController', [
    '$scope', 'authService', '$location', 'profileService',
    function ($scope, authService, $location, profileService) {

            $scope.$location = $location;

            $scope.menuItems = [{
                title: 'Dashboard',
                link: '/dashboard',
                requiresPrivateAccess: true,
                relevantUserTypes: ["student"],
                }, {
                title: 'Profile',
                link: '/profile',
                requiresPrivateAccess: true,
                relevantUserTypes: ["student"],
                }, {
                title: 'Timetable',
                link: '/timetable',
                requiresPrivateAccess: true,
                relevantUserTypes: ["student"],
                }, {
                title: 'Login',
                link: '/login',
                requiresPublicAccess: true,
                }, {
                title: 'User Management',
                link: '/userManagement',
                requiresPrivateAccess: true,
                relevantUserTypes: ["admin"],
                }, {
                title: 'Logout',
                link: '/logout',
                requiresPrivateAccess: true,
                relevantUserTypes: ["admin", "student"],
                }, {
                title: 'About Us',
                link: '/about',
                requiresPublicAccess: true,
            }];

            // check if user is logged in
            var userIsLoggedIn = function () {
                // if userID is null, then they are logged in, thus returning TRUE
                return authService.userID !== null;
            }

            $scope.isMenuItemVisible = function (item) {
                // show pages like Login and About Us before user logs in
                if (item.requiresPublicAccess && !userIsLoggedIn()) {
                    return true;
                }

                // don't show Login and About us page to logged in users
                if (item.requiresPublicAccess && userIsLoggedIn()) {
                    return false;
                }

                // shows pages relevant to the type of the user
                if (profileService.currentProfile != null) {
                    if (($.inArray(profileService.currentProfile.userType, item.relevantUserTypes) != -1) && userIsLoggedIn()) {
                        return true;
                    }
                }

                return false;
            }

            $scope.$on('$viewContentLoaded', function () {
                $scope.pageLoaded = true;
            });

    }
  ]
);
