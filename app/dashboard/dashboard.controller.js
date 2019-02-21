app.controller(
    'DashboardController', [
    '$scope', 'profileService', 'locationService', '$http',
    function ($scope, profileService, locationService, $http) {

            $scope.userProfile = profileService.currentProfile;
            $scope.nextClass = profileService.getNextClass();
            $scope.modules = profileService.getModuleObjects();
        
            $scope.weekday = getWeekday(3);
        
//            $scope.weekday = getWeekday(new Date().getDay() - 1);

            var timetable = profileService.getTimetable();

            // Code handling Google Maps 
            MAPS_API_KEY = 'AIzaSyCLRmxBxFyABgKGbC-7cEO6JiWcgNHZsYc';
            var myLatLng = locationService.getRoomLocation($scope.nextClass.room);

            function loadScript(src, callback) {
                var script = document.createElement("script");
                script.type = "text/javascript";
                if (callback) script.onload = callback;
                document.getElementsByTagName("head")[0].appendChild(script);
                script.src = src;
            };

            loadScript('https://maps.googleapis.com/maps/api/js?key=' + MAPS_API_KEY + '&callback=initialise');

            window.initialise = function () {
                var mapOptions = {
                    zoom: 18,
                    center: myLatLng,
                    mapTypeId: google.maps.MapTypeId.ROADMAP,
                    mapTypeControl: false,
                };

                map = new google.maps.Map(document.getElementById('map_canvas'),
                    mapOptions);
                var marker = new google.maps.Marker({
                    position: myLatLng,
                    map: map,
                    animation: google.maps.Animation.DROP,
                });
            };
            // end of the Google Maps related code

            // returns a weekday in string format
            function getWeekday(index) {
                var day = "";
console.log(index);
                
                switch (index) {
                    case 0:
                        day = "Monday";
                        break;
                    case 1:
                        day = "Tuesday";
                        console.log('here');
                        break;
                    case 2:
                        day = "Wednesday";
                        break;
                    case 3:
                        day = "Thursday";
                        break;
                    case 4:
                        day = "Friday";
                        break;
                    default:
                        console.log('here');
                }
console.log(day);
                return day;
            }

            // returns bootstrap css class based on the deadline date
            $scope.getClassForDeadline = function (deadline) {
                today = new Date();

                // the deadline did not came as a proper date object, so lets make one
                deadline = new Date(deadline);

                oneWeekFromToday = new Date();
                twoWeeksFromToday = new Date();
                oneMonthFromToday = new Date();

                oneWeekFromToday.setDate(today.getDate() + 7);
                twoWeeksFromToday.setDate(today.getDate() + 14);
                oneMonthFromToday.setDate(today.getDate() + 30);

                if (deadline < today) {
                    return "deadline card bg-secondary"
                } else if (deadline < oneWeekFromToday) {
                    return "deadline card deadline bg-danger"
                } else if (deadline < twoWeeksFromToday) {
                    return "deadline card bg-warning"
                } else {
                    return "deadline card bg-success"
                }
            }

}]);
