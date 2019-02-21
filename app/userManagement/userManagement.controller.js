app.controller(
    'UserManagementController', [
    '$scope', 'authService', '$location', '$localStorage', '$http', 'profileService',
    function ($scope, authService, $location, $localStorage, $http, profileService) {

            var addingNewFlag = false;
            var editingExistingFlag = false;

            async function getData() {
                $scope.courses = await profileService.getCourses();
                $scope.modules = await profileService.getModules();
                $scope.students = await profileService.getStudents();
            }

            // get up-to-date user data
            getData().then(() => {

                $scope.nextSID = profileService.getNextAvailableSID;
                $scope.filteredStudentList = !$scope.searchQuery ? $scope.students : $scope.filteredStudentList;

                $scope.$digest();
            });

            $scope.openStudentDetailsForm = function (studentObject) {
                $('html, body').animate({
                    scrollTop: ($('#submit-buttons-cluster').offset().top)
                }, 'fast');

                if (studentObject == null) {
                    addingNewFlag = true;
                    editingExistingFlag = false;

                    $scope.userProfile = {};

                    $scope.userProfile.SID = $scope.nextSID;

                    $scope.getNewPassword();

                } else {
                    editingExistingFlag = true;
                    addingNewFlag = false;

                    // clear leftover 'selected' flags from modules
                    $scope.modules.forEach(function (module) {
                        module.selected = false;
                    })

                    // some processing is needed, as studentObject.course is just an ID
                    // while the select element needs a complete object
                    //
                    // will work on the clone, otherwise the processing below will mess
                    // with the original studenObject, resulting in second atempt to find course failing
                    $scope.userProfile = Object.create(studentObject);

                    $scope.userProfile.course = $scope.courses.find(function (course) {
                        return course.id == studentObject.course;
                    })


                    $scope.modules.forEach(function (module) {
                        if ($.inArray(module.id, $scope.userProfile.modules) != -1) {
                            module.selected = true;
                        }
                    })
                }
            }

            $scope.getNewPassword = function () {
                $scope.userProfile.password = Math.random().toString(36).slice(2);
            };


            function Create() {

                selectedModulesIds = [];
                selectedModules = [];

                // get modules selected by checkboxes
                $scope.modules.forEach(function (module) {
                    if (module.selected) {
                        selectedModulesIds.push(module.id);
                        selectedModules.push(module);
                    }
                });

                // work out timetable for each selected module
                tmp_timetable = getTimetable(selectedModules);

                data = {
                    "SID": $scope.userProfile.SID,
                    "course": $scope.userProfile.course.id,
                    "modules": selectedModulesIds,
                    "timetable": tmp_timetable,
                    "firstName": $scope.userProfile.firstName,
                    "lastName": $scope.userProfile.lastName,
                    "email": $scope.userProfile.email,
                    "emailVerified": false,
                    "password": $scope.userProfile.password
                }

                async function makeAPICall() {
                    result = profileService.createAccount(data);
                }

                makeAPICall().then(() => {

                    $scope.$digest();

                    console.log(result);

                    button = document.getElementById('create-button');
                    showConfirmation(button, 'Account Created', 1000);

                    $scope.profile.$setPristine(true);

                    getData().then(() => {

                        $scope.nextSID = profileService.getNextAvailableSID;
                        $scope.filteredStudentList = !$scope.searchQuery ? $scope.students : $scope.filteredStudentList;

                        $scope.$digest();
                    });
                });
            }

            function Update() {
                selectedModulesIds = [];
                selectedModules = [];

                $scope.modules.forEach(function (module) {
                    if (module.selected) {
                        selectedModulesIds.push(module.id);
                        selectedModules.push(module);
                    }
                });

                // work out timetable for each selected module
                tmp_timetable = getTimetable(selectedModules);

                data = {
                    "course": $scope.userProfile.course.id,
                    "modules": selectedModulesIds,
                    "timetable": tmp_timetable,
                    "firstName": $scope.userProfile.firstName,
                    "lastName": $scope.userProfile.lastName,
                    "email": $scope.userProfile.email,
                }


                async function makeAPICall() {
                    result = profileService.updateAccount($scope.userProfile.id, data);
                }

                makeAPICall().then(() => {

                    button = document.getElementById('update-button');
                    showConfirmation(button, 'Account Updated', 1000);

                    // set the form to pristine so its ready for new imputs
                    $scope.profile.$setPristine(true);

                    // get up-to-date user data
                    getData().then(() => {

                        $scope.nextSID = profileService.getNextAvailableSID;
                        $scope.filteredStudentList = !$scope.searchQuery ? $scope.students : $scope.filteredStudentList;

                        $scope.$digest();
                    });
                });
            }

            $scope.deleteUser = function () {

                $('#delete-user-dialog').modal('hide');

                async function makeAPICall() {
                    result = profileService.deleteAccount($scope.userProfile.id);
                }

                makeAPICall().then(() => {

                    button = document.getElementById('delete-button');
                    showConfirmation(button, 'Account Deleted', 1000);

                    // set the form to pristine so its ready for new imputs
                    $scope.profile.$setPristine(true);

                    // get up-to-date user data
                    getData().then(() => {

                        $scope.nextSID = profileService.getNextAvailableSID;
                        $scope.filteredStudentList = !$scope.searchQuery ? $scope.students : $scope.filteredStudentList;

                        $scope.$digest();
                    });
                });
            }

            function getTimetable(selectedModules) {
                tmp_timetable = [{
                        9: {},
                        10: {},
                        11: {},
                        12: {},
                        13: {},
                        14: {},
                        15: {},
                        16: {},
                        17: {}
                    },
                    {
                        9: {},
                        10: {},
                        11: {},
                        12: {},
                        13: {},
                        14: {},
                        15: {},
                        16: {},
                        17: {}
                    },
                    {
                        9: {},
                        10: {},
                        11: {},
                        12: {},
                        13: {},
                        14: {},
                        15: {},
                        16: {},
                        17: {}
                    },
                    {
                        9: {},
                        10: {},
                        11: {},
                        12: {},
                        13: {},
                        14: {},
                        15: {},
                        16: {},
                        17: {}
                    },
                    {
                        9: {},
                        10: {},
                        11: {},
                        12: {},
                        13: {},
                        14: {},
                        15: {},
                        16: {},
                        17: {}
                    }];

                selectedModules.forEach(function (module) {
                    // LECTURE
                    tmp_timetable[module['timetable']['lecture']['day']][module['timetable']['lecture']['time']] = {
                        'time': module['timetable']['lecture']['time'],
                        'duration': module['timetable']['lecture']['duration'],
                        'room': module['timetable']['lecture']['room'],
                        'module_name': module.name,
                        'class_type': 'lecture',
                        'module_ID': module.ID,
                        'module_ID_API': module.id,
                    };

                    // PRACTICAL
                    // Select random practical class option
                    randomClassIndex = Math.floor((Math.random() * Object.keys(module['timetable']['practical']).length));

                    tmp_timetable[module['timetable']['practical'][randomClassIndex]['day']][module['timetable']['practical'][randomClassIndex]['time']] = {
                        'time': module['timetable']['practical'][randomClassIndex]['time'],
                        'duration': module['timetable']['practical'][randomClassIndex]['duration'],
                        'room': module['timetable']['practical'][randomClassIndex]['room'],
                        'module_name': module.name,
                        'class_type': 'practical',
                        'module_ID': module.ID,
                        'module_ID_API': module.id,
                    };

                });

                return tmp_timetable;
            };

            $scope.addingNew = function () {
                return addingNewFlag;
            }

            $scope.editingExisting = function () {
                return editingExistingFlag;
            }

            $scope.ProcessAccount = function () {

                switch (addingNewFlag) {
                    case true:
                        Create();
                        break;

                    case false:
                        Update();
                        break;
                }
            }

            function showConfirmation(button, confirmationText, delay) {
                defaultText = button.value;

                $(button).removeClass('btn-primary');
                $(button).addClass('btn-success font-weight-bold');
                $(button).attr('disabled', true);
                // for some reason doing the same with jqery did not work!
                button.value = confirmationText;

                setTimeout(function () {
                    $(button).removeClass('btn-success font-weight-bold');
                    $(button).addClass('btn-primary');
                    button.value = defaultText;
                    $(button).attr('disabled', false);

                    editingExistingFlag = false;
                    addingNewFlag = false;
                    // UI did not update without reloading - weird
                    $scope.$digest();
                }, delay);
            }

            $scope.fiterStudents = function () {
                $scope.filteredStudentList = $scope.students;
                $scope.filteredStudentList = $scope.filteredStudentList.filter(function (student) {

                    fullName = student.firstName + " " + student.lastName;
                    fullName = fullName.toLowerCase();

                    if (fullName.indexOf($scope.searchQuery.toLowerCase()) > -1) {
                        return true;
                    }

                    if (student.SID.toString().indexOf($scope.searchQuery) > -1) {
                        return true;
                    }

                    return false;
                });
            }

}])
