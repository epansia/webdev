(function () {
    angular
        .module("WebAppMaker")
        .controller("AdminController", AdminController);
    
    function AdminController(UserService, $timeout, $window, admin) {
        var vm = this;
        vm.deleteUser = deleteUser;

        UserService
            .findAllUsers()
            .then(function (users) {
                vm.users = users;
            });

        function deleteUser(user) {
            if (user._id === admin._id) {
                vm.error = "You cannot delete yourself!";
                $timeout(function () {
                    vm.updated = null;
                }, 3000);
            } else {
                UserService
                    .deleteUser(user._id)
                    .then(function () {
                        $window.location.reload();
                    }, function () {
                        vm.error = "Unable to remove this user.";
                        $timeout(function () {
                            vm.error = null;
                        }, 3000);
                    });
            }
        }
    }
})();