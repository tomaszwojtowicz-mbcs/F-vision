app.service(
    'locationService', [
    '$rootScope',
    function ($rootScope, ) {

            // save a reference to the Service instance
            var srv = this;
            
            var listOfRoomLocations = {
                'COM106' : {
                    lat: 52.208137,
                    lng: 0.136958,
                },
                'COM124' : {
                    lat: 52.208137,
                    lng: 0.136958,
                },
                'LAB206' : {
                    lat: 52.203932,
                    lng: 0.134272,
                },
            }
        
            // returns geographical location of a class room
            // to be fed into GMaps API
            srv.getRoomLocation = function ( roomNumber ) {
                return listOfRoomLocations[roomNumber];
            }

            return srv;
    }
  ]
);
