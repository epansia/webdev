(function() {
    angular
        .module("WebAppMaker")
        .controller("LoginController", LoginController)
        .controller("RegisterController", RegisterController)
        .controller("ProfileController", ProfileController);

    function LoginController($location, UserService) {
        var vm = this;
        vm.login = login;

        function login(username, password) {
            UserService
            // .findUserByCredentials(username, password)
                .login(username, password)
                .then(function (user) {
                        $location.url("/profile");
                    },
                    function (error) {
                        vm.error = "Username does not exist.";
                    });
        }
    }

    function RegisterController(UserService, $location, $timeout) {
        var vm = this;
        vm.register = register;

        function register(username, password, vpassword) {
            if (username === undefined || username === null || username === ""
                || password === undefined || password === "") {
                vm.error = "Username and Passwords cannot be empty.";
                return;
            }
            if (password !== vpassword) {
                vm.error = "Password does not match.";
                return;
            }
            UserService
                .findUserByUsername(username)
                .then(
                    function (user) {
                        if (user !== null) {
                            vm.error = "Username already exists.";
                            $timeout(function () {
                                vm.error = null;
                            }, 3000);
                            return;
                        } else {
                            var user = {
                                username: username,
                                password: password,
                                firstName: "",
                                lastName: "",
                                email: ""
                            };
                            // return the promise
                            return UserService
                                .register(user);
                        }
                    })
                .then(
                    function () {
                        $location.url("/profile");
                    });
        }
    }

    function ProfileController($routeParams, $timeout, $location, UserService, loggedin) {
        var vm = this;
        // vm.uid = $routeParams.uid;
        vm.uid = loggedin._id;
        vm.user = loggedin;

        vm.updateUser = updateUser;
        vm.deleteUser = deleteUser;
        vm.logout = logout;

        function deleteUser(user) {
            UserService
                .deleteUser(user._id)
                .then(function () {
                    $location.url('/login');
                }, function () {
                    vm.error = "Unable to remove this user.";
                    $timeout(function () {
                        vm.error = null;
                    }, 3000);
                });
        }

        function updateUser(user) {
            UserService
                .updateUser(user._id, user)
                .then(function () {
                    vm.updated = "Profile changes saved!";
                    $timeout(function () {
                        vm.updated = null;
                    }, 3000);
                });
        }

        function logout() {
            UserService
                .logout()
                .then(function () {
                    $location.url('/login');
                })
        }

        function userError(error) {
            vm.error = "User not found";
        }
    }
})();