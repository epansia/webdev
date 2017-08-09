(function() {
    angular
        .module("WebAppMaker")
        .controller("PageListController", PageListController)
        .controller("NewPageController", NewPageController)
        .controller("EditPageController", EditPageController);

    function PageListController($routeParams, PageService, loggedin) {
        var vm = this;
        vm.uid = loggedin._id;
        vm.wid = $routeParams.wid;
        PageService
            .findPageByWebsiteId(vm.wid)
            .then(renderPages);

        function renderPages(pages) {
            vm.pages = pages;
        }
    }

    function NewPageController($routeParams, $timeout, $location, PageService, loggedin) {
        var vm = this;
        vm.uid = loggedin._id;
        vm.wid = $routeParams.wid;

        vm.createPage = createPage;

        function createPage(pageName, pageTitle) {
            if (pageName === undefined || pageName === null) {
                vm.error = "Page name cannot be empty.";
                $timeout(function () {
                    vm.error = null;
                }, 3000);
                return;
            }

            var page = {
                name: pageName,
                description: pageTitle
            };
            PageService
                .createPage(vm.wid, page)
                .then(function () {
                    $location.url("/website/" + vm.wid + "/page");
                });
        }
    }

    function EditPageController($routeParams, $location, PageService, loggedin) {
        var vm = this;
        vm.uid = loggedin._id;
        vm.wid = $routeParams.wid;
        vm.pid = $routeParams.pid;

        vm.updatePage = updatePage;
        vm.deletePage = deletePage;

        function init() {
            PageService
                .findPageById(vm.pid)
                .then(function (page) {
                    vm.page = page;
                }, function (error) {
                    vm.error = "Cannot find page";
                    $timeout(function () {
                        vm.error = null;
                    }, 3000);
                });
        }
        init();

        function updatePage(newPage) {
            PageService
                .updatePage(vm.pid, newPage)
                .then(function () {
                    $location.url("/website/" + vm.wid + "/page");
                });
        }

        function deletePage(page) {
            PageService.deletePage(page._id)
                .then(
                    function () {
                        $location.url("/website/" + vm.wid + "/page");
                    },
                    function() {
                        vm.error = "Cannot delete this page";
                        $timeout(function () {
                            vm.error = null;
                        }, 3000);
                    });

        }
    }
})();