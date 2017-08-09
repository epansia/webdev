(function(){
    angular
        .module("WebAppMaker")
        .config(configuration);

    function configuration($routeProvider) {
        $routeProvider

            .when('/register', {
                templateUrl : "views/user/templates/register.view.client.html",
                controller: "RegisterController",
                controllerAs: "model"
            })
            .when('/login', {
                templateUrl : "views/user/templates/login.view.client.html",
                controller: "LoginController",
                controllerAs: "model"
            })
            .when('/profile', {
                templateUrl : "views/user/templates/profile.view.client.html",
                controller: "ProfileController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/admin', {
                templateUrl : "views/admin/templates/admin.view.client.html",
                controller: "AdminController",
                controllerAs: "model",
                resolve: {
                    admin: checkAdmin
                }
            })
            .when('/website', {
                templateUrl : "views/website/templates/website-list.view.client.html",
                controller: "WebsiteListController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/new', {
                templateUrl : "views/website/templates/website-new.view.client.html",
                controller: "NewWebsiteController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid', {
                templateUrl : "views/website/templates/website-edit.view.client.html",
                controller: "EditWebsiteController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid/page', {
                templateUrl : "views/page/templates/page-list.view.client.html",
                controller: "PageListController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid/page/new', {
                templateUrl : "views/page/templates/page-new.view.client.html",
                controller: "NewPageController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid/page/:pid', {
                templateUrl : "views/page/templates/page-edit.view.client.html",
                controller: "EditPageController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid/page/:pid/widget', {
                templateUrl : "views/widget/templates/widget-list.view.client.html",
                controller: "WidgetListController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid/page/:pid/widget/new', {
                templateUrl : "views/widget/templates/widget-chooser.view.client.html",
                controller: "NewWidgetController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid/page/:pid/widget/search/', {
                templateUrl : "views/widget/templates/widget-flickr-search.view.client.html",
                controller: "FlickrImageSearchController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid/page/:pid/widget/create/:wtype', {
                templateUrl : "views/widget/templates/widget-new.view.client.html",
                controller: "CreateWidgetController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when('/website/:wid/page/:pid/widget/:wgid', {
                templateUrl : "views/widget/templates/widget-edit.view.client.html",
                controller: "EditWidgetController",
                controllerAs: "model",
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .when("/home", {
                templateUrl : "./views/home/templates/home.html",
                controller: "HomepageController",
                controllerAs: "model",
                resolve: {
                    currentUser: checkCurrentUser
                }
            })
            .otherwise({
                redirectTo : "/home"
            });
    }

    // security
    var checkLoggedin = function($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();
        $http
            .get('/api/loggedin')
            .then(function(response) {
                var user = response.data;
                if (user !== '0') {
                    deferred.resolve(user);
                } else {
                    deferred.reject();
                    $location.url('/login');
                }
            });
        return deferred.promise;
    };

    var checkCurrentUser = function ($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();

        $http
            .get('/api/loggedin')
            .then(function(response) {
                var user = response.data;
                if (user === '0') {
                    user = null;
                }
                deferred.resolve(user);

            });
        return deferred.promise;
    };

    var checkAdmin = function ($q, $timeout, $http, $location, $rootScope) {
        var deferred = $q.defer();

        $http
            .get('/api/loggedin')
            .then(function(response) {
                // console.log(user.data);
                var user = response.data;
                if (user !== '0') {
                    if (user.roles.indexOf('ADMIN') > -1) {
                        deferred.resolve(user);
                    }
                } else {
                    $location.url('/home');
                }

            });
        return deferred.promise;
    };

})();