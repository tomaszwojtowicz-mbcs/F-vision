app.controller(
    'TimetableController', [
    '$scope', '$location', 'profileService',
    function ($scope, $location, profileService) {
            profileService.getModuleObjects();

            $scope.showModuleInfoFlag = true;

            $scope.timetable = angular.copy(profileService.currentProfile.timetable);

            // iterate and mark empty spots, so the html have easier job filtering it
            for (var day in $scope.timetable) {

                dayActive = false;
                for (var hourlySlot in $scope.timetable[day]) {

                    if (Object.values($scope.timetable[day][hourlySlot]).length != 0) {
                        $scope.timetable[day][hourlySlot].active = true;
                        dayActive = true;
                    }
                }

                $scope.timetable[day].active = dayActive;
            }

            $scope.showModuleInfo = function (hourlySlot) {

                $scope.currentModule = profileService.getModuleObject(hourlySlot.module_ID_API);
                // add the paramater needed but missing from what came from profileService
                $scope.currentModule.class_type = hourlySlot.class_type;

                $('html, body').animate({
                    scrollTop: ($('#module-info-cluster').offset().top)
                }, 'fast');

               $scope.$digest;
            }

            // returns a weekday in string format
            $scope.getWeekday = function (index) {
                day = "";

                switch (index) {
                    case 0:
                        day = "Monday";
                        break;
                    case 1:
                        day = "Tuesday";
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
                }

                return day;
            }
    }])
