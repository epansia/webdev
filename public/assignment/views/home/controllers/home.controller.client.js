(function () {
    angular
        .module("WebAppMaker")
        .controller("HomepageController", HomepageController);

    function HomepageController(currentUser) {
        var vm = this;
        vm.currentUser = currentUser;
    }
})();