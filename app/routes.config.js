app.config(
    [
        '$routeProvider',
        function($routeProvider) {
            $routeProvider
                .when(
                    '/dashboard', {
                        templateUrl: 'app/dashboard/dashboard.view.html',
                        controller: 'DashboardController',
                    }
                )
                .when(
                    '/login', {
                        templateUrl: 'app/login/login.view.html',
                        controller: 'LoginController',
                    }
                )
                .when(
                    '/logout', {
                        template: '&nbsp;', // needs a space
                        controller: 'LogoutController'
                    }
                )
                .when(
                    '/userManagement', {
                        templateUrl: 'app/userManagement/userManagement.view.html',
                        controller: 'UserManagementController',
                    }
                )
                .when(
                    '/profile', {
                        templateUrl: 'app/profile/profile.view.html',
                        controller: 'ProfileController',
                    }
                )
                .when(
                    '/about', {
                        templateUrl: 'app/about/about.view.html',
                        controller: 'AboutController',
                    }
                )
               .when(
                    '/timetable', {
                        templateUrl: 'app/timetable/timetable.view.html',
                        controller: 'TimetableController',
                    }
                )
                .otherwise({
                    redirectTo: '/about'
                });
        }
    ]
);