app.service(
    'profileService', [
    '$rootScope', '$location', '$localStorage', '$http',
    function ($rootScope, $location, $localStorage, $http) {

            var API_ADDRESS = 'http://localhost:3000/api/';

            // save a reference to the Service instance
            var srv = this;

            srv.timetable = [];
            srv.moduleObjects = [];
            srv.getNextAvailableSID = '';

            srv.currentProfile = $localStorage.currentProfile == null ? null : $localStorage.currentProfile;
            srv.timetable = $localStorage.currentProfile == null ? null : $localStorage.currentProfile.timetable;

            srv.getUserProfile = function () {
                url = API_ADDRESS + 'y/' + $localStorage.userID + '?access_token=' + $localStorage.token;

                $http.get(url).then(function (response) {
                    srv.currentProfile = response.data;
                    $localStorage.currentProfile = response.data;

                    console.log('got profile');

                }, function (response) {
                    console.log('failed too get user profile');
                });;
            }

            srv.getTimetable = function () {
                return srv.currentProfile.timetable;
            };

            srv.getNextClass = function () {
                var nextClass = {};
                var currentDate = new Date();

                currentDay = currentDate.getDay() - 1; // our index have Monday at 0, but getDay() returns 1 for Monday
                currentTime = currentDate.getHours() + 1; //current hour is considered gone, will check the next one onwards

                // check if any classes today and the rest of the week(weekdays only)
                if (currentDay < 5) {
                    for (i = currentDay; i < srv.currentProfile.timetable.length; i++) {
                        for (var time in srv.currentProfile.timetable[i]) {
                            if (currentTime <= time) {
                                nextClass = srv.currentProfile.timetable[i][time];
                                break;
                            }
                        }
                    }
                }
                // if havent found any so far, start looking from Monday onwards
                if (Object.keys(nextClass).length == 0) {
                    // iterating all the way to the end, because its safer than to the currentDay, which could be on the weekend
                    // and fall outside of srv.currentProfile.timetable bounds
                    for (i = 0; i < srv.currentProfile.timetable.length; i++) {
                        for (var time in srv.currentProfile.timetable[i]) {
                            nextClass = srv.currentProfile.timetable[i][time];
                            break;
                        }

                        // stop iteratating if found class
                        if (Object.keys(nextClass).length != 0) break;
                    }
                }

                return nextClass;
            };

            srv.getModuleObjects = function () {
                srv.moduleObjects = [];

                srv.currentProfile.modules.forEach(function (module) {
                    url = API_ADDRESS + 'modules/' + module + '?access_token=' + $localStorage.token;

                    $http.get(url).then(function (response) {
                        currentModule = response.data;

                        srv.moduleObjects.push(response.data);

                    }, function (response) {
                        console.log('failed to get module object');
                    });;
                })

                return srv.moduleObjects;
            }

            srv.getModuleObject = function (module_ID_API) {
                return srv.moduleObjects.find(function (module) {
                    return module.id == module_ID_API;
                })
            }

            srv.updateAvatar = function (newAvatar) {
                data = newAvatar;

                // make a call to API to update the user
                url = API_ADDRESS + 'y/' + $localStorage.userID + '?access_token=' + $localStorage.token;

                $http.patch(url, data).then(function (response) {
                    console.log('patched user avatar');

                }, function (response) {
                    console.log('failed to patch user avatar');
                });;

            }

            // update user profile
            srv.updateUserProfile = function (profile) {

                // update currentProfile by merging the existing currentProfile data with the new profile object data
                srv.currentProfile = Object.assign({}, srv.currentProfile, profile);

                data = {
                    "firstName": profile.firstName,
                    "lastName": profile.lastName,
                    "address": {
                        "line1": profile.address.line1,
                        "line2": profile.address.line2,
                        "line3": profile.address.line3,
                        "postCode": profile.address.postCode
                    },
                    password: profile.password,
                    avatar: profile.avatar
                };

                // make a call to API to update the user
                url = API_ADDRESS + 'y/' + $localStorage.userID + '?access_token=' + $localStorage.token;

                $http.patch(url, data).then(function (response) {

                }, function (response) {
                    console.log('failed to patch user data');
                });;
            }

            srv.getCourses = function () {
                return new Promise(resolve => {
                    tmp_url = API_ADDRESS + 'courses/?access_token=' + $localStorage.token;

                    $http.get(tmp_url).then(function (response) {
                        resolve(response.data);
                        //                        return response.data;
                    }, function (response) {
                        console.log('failed to get courses');
                    });;
                })

            };

            srv.getModules = function (course) {
                return new Promise(resolve => {
                    tmp_url = API_ADDRESS + 'modules/?access_token=' + $localStorage.token;

                    $http.get(tmp_url).then(function (response) {
                        resolve(response.data);
                        //                        return response.data;
                    }, function (response) {
                        console.log('failed to get modules');
                    });;
                });
            }

            srv.getStudents = function () {
                return new Promise(resolve => {

                    tmp_url = API_ADDRESS + 'y/?access_token=' + $localStorage.token;

                    $http.get(tmp_url).then(function (response) {
                        students = response.data;

                        // finding the next available SID number
                        var lastSID = -1;
                        students.forEach(function (student) {
                            lastSID = lastSID < student.SID ? student.SID : lastSID;
                        })
                        srv.getNextAvailableSID = lastSID + 1;
                        console.log('got students');

                        resolve(response.data);

                    }, function (response) {
                        console.log('failed to get students');
                    });;
                });
            }

            srv.deleteAccount = function (accountID) {
                return new Promise(resolve => {
                   tmp_url = API_ADDRESS + 'y/' + accountID + '?access_token=' + $localStorage.token;

                    $http.delete(tmp_url).then(function (response) {

                        // count of 0 in the response means that no account have been deleted
                        if (response.data.count == 0) resolve(false);
                        else resolve(true);

                    }, function (response) {
                        resolve(false);
                    });;
                });
            }

            srv.createAccount = function (accountData) {
                return new Promise(resolve => {

                    tmp_url = API_ADDRESS + 'y/?access_token=' + $localStorage.token;

                    $http.post(tmp_url, accountData).then(function (response) {
                        console.log('all good');

                        resolve(true);

                    }, function (response) {
                        console.log('error');
                        resolve(false);
                    });;
                });
            }

            srv.updateAccount = function (accountID, accountData) {
                return new Promise(resolve => {

                    tmp_url = API_ADDRESS + 'y/' + accountID + '?access_token=' + $localStorage.token;

                    $http.patch(tmp_url, data).then(function (response) {
                        resolve(true);
                        
                    }, function (response) {
                        resolve(false);
                    });;
                });
            }

            // return the service public methods so they may be used by other parts of our app
            return srv;

                }
                ]);
