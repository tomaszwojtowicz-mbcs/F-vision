app.service(
    'authService', [
    '$rootScope', '$location', '$localStorage', '$http', 'profileService',
    function ($rootScope, $location, $localStorage, $http, profileService) {

            var API_ADDRESS = 'http://localhost:3000/api/';
        
            // save a reference to the Service instance
            var srv = this;

            srv.token = $localStorage.token == null ? null : $localStorage.token;
            srv.userID = $localStorage.userID == null ? null : $localStorage.userID;

            // logout helper
            srv.logout = function () {
                // remove the current user information
                srv.userID = null;
                srv.token = null;

                // remove current user from local storage
                $localStorage.userID = null;
                $localStorage.token = null;
                $localStorage.currentProfile = null;
                profileService.currentProfile = null;
            };

            srv.login = function (username, password) {

                data = {
                    "email": username,
                    "password": password
                };

                console.log(data);
                return new Promise(resolve => {
                    $http.post(API_ADDRESS + 'y/login', data).then(function (response) {

                        srv.token = response.data.id;
                        $localStorage.token = response.data.id;

                        srv.userID = response.data.userId;
                        $localStorage.userID = response.data.userId;

                        profileService.getUserProfile();
                        resolve(response.data)

                    }, function (error) {
                        console.log('failed to log in', error);
                        resolve(error.data)
                    });;
                });
            }

            // return the service public methods so they may be used by other parts of our app
            return srv;
    }
  ]
);
