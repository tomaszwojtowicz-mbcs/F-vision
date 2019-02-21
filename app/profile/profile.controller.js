app.controller(
    'ProfileController', [
    '$scope', 'profileService',
    function ($scope, profileService) {

            // UK postcode regex source: https://regexr.com/35ic5
            $scope.postcodeRegex = /\b(GIR ?0AA|SAN ?TA1|(?:[A-PR-UWYZ](?:\d{0,2}|[A-HK-Y]\d|[A-HK-Y]\d\d|\d[A-HJKSTUW]|[A-HK-Y]\d[ABEHMNPRV-Y])) ?\d[ABD-HJLNP-UW-Z]{2})\b/gim;

            // Password regex source: https://regexr.com/35ic5
            $scope.passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm

            var imgToUpload = '';

            $scope.userProfile = {
                SID: profileService.currentProfile.SID,
                firstName: profileService.currentProfile.firstName,
                lastName: profileService.currentProfile.lastName,
                address: {
                    line1: profileService.currentProfile.address != undefined ? profileService.currentProfile.address['line1'] : "",
                    line2: profileService.currentProfile.address != undefined ? profileService.currentProfile.address['line2'] : "",
                    line3: profileService.currentProfile.address != undefined ? profileService.currentProfile.address['line3'] : "",
                    postCode: profileService.currentProfile.address != undefined ? profileService.currentProfile.address['postCode'] : "",

                },
                avatar: profileService.currentProfile.avatar
            }

            $scope.SetProfileImage = function (imageFile) {

                if (!imageFile) {
                    console.log('nothing to upload')
                    return;
                }

                // grab a handle on the img html tag
                var imgElement = angular.element("#userProfileImageUpload")[0];

                // assign the uploaded file to it
                imgElement.file = imageFile;

                // Using FileReader to display the image content
                var reader = new FileReader();

                reader.onload =
                    (function () {
                        return function (e) {

                            $scope.userProfile.avatar = e.target.result;
                            $scope.$apply();
                        };
                    })(imgElement);

                // load the file => once ready, it will run the above function attached to 'reader.onload'
                reader.readAsDataURL(imageFile);
            };

            angular.element("#userProfileImageUpload").change(function () {

                imgToUpload = this.files[0];

                $scope.SetProfileImage(imgToUpload);
            });

            $scope.Update = function () {

                // ask the profile service to patch the profile to the API
                profileService.updateUserProfile($scope.userProfile);

                button = document.getElementById('update_button');
                showConfirmation(button, true, 'Profile Updated', 1000);
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


                }
                ]
);
