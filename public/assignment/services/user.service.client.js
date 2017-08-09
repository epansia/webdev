(function () {
    angular
        .module("WebAppMaker")
        .factory('UserService', UserService);

    function UserService($http) {
        var services = {
            // "createUser": createUser,
            "findUserById": findUserById,
            "findUserByUsername": findUserByUsername,
            "findUserByCredentials": findUserByCredentials,
            "findAllUsers": findAllUsers,
            "updateUser": updateUser,
            "deleteUser": deleteUser,
            "setCurrentUser":setCurrentUser,
            "login":login,
            "logout" : logout,
            "register" : register
        };
        return services;


        function login(username, password) {
            var url = "/api/login";
            var credentials = {
                username: username,
                password: password
            };
            return $http.post(url, credentials)
                .then(function (response) {
                    return response.data;
                });
        }

        function logout() {
            var url = "api/logout";
            return $http.post(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function register(user) {
            var url = "api/register";
            return $http.post(url, user)
                .then(function (response) {
                    return response.data;
                })
        }

        function setCurrentUser(user) {
            $rootScope.currentUser = user;
        }

        function findUserById(userId) {
            var url = "/api/user/" + userId;
            return $http.get(url)
                .then(function (response) {
                    var user = response.data;
                    return user;
                });
        }

        function findUserByUsername(username) {
            var url = "/api/user?username=" + username;
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });

        }

        function findUserByCredentials(username, password) {
            var url = "/api/user?username=" + username + "&password=" + password;
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                });
        }

        function findAllUsers() {
            var url = '/api/alluser';
            return $http.get(url)
                .then(function (response) {
                    return response.data;
                })
        }

        function updateUser(userId, user) {
            var url = "/api/user/" + userId;
            return $http.put(url, user)
                .then(function (response) {
                    return response.data;
                });
        }

        function deleteUser(userId) {
            var url = "/api/user/" + userId;
            return $http.delete(url)
                .then(function (response) {
                    return response.data;
                });
        }
    }

})();