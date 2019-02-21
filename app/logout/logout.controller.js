app.controller(
    'LogoutController',
    [
        'authService', '$location',
        function (authService, $location) {
            
            // perform logout
            authService.logout();
            
            // redirect to login
            $location.path('/login');
            
        }
    ]
);