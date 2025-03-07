to do list

var app = angular.module("todoApp", []);

app.controller("TodoController", function ($scope) {
    $scope.tasks = [];
    
    $scope.newTask = function () {
        if ($scope.tasks.push({ name: $scope.taskName, completed: false })) {
            $scope.taskName = "";
        }
    };

    $scope.removeTask = function (index) {
        $scope.tasks.splice(index, 1);
    };

    $scope.filterTasks = function (status) {
        if (status === "all") {
            return $scope.tasks;
        } else if (status === "active") {
            return $scope.tasks.filter(task => !task.completed);
        } else if (status === "completed") {
            return $scope.tasks.filter(task => task.completed);
        }
    };

    $scope.viewTasks = function () {
        return $scope.tasks;
    };
});


error handling app 

var app = angular.module("errorHandlingApp", []);

app.factory("errorInterceptor", function ($q) {
    return {
        responseError: function (rejection) {
            if (rejection.status === 404) {
                alert("Error 404: Resource Not Found!");
            } else if (rejection.status === 500) {
                alert("Error 500: Internal Server Error!");
            } else {
                alert("An Unexpected Error Occurred!");
            }
            return $q.reject(rejection);
        }
    };
});

app.config(function ($httpProvider) {
    $httpProvider.interceptors.push("errorInterceptor");
});

app.controller("MainController", function ($scope, $http) {
    $scope.data = [];
    $scope.error = false;
    $scope.errorMessage = "";

    $scope.fetchData = function () {
        $http.get("https://jsonplaceholder.typicode.com/posts")
            .then(function (response) {
                $scope.data = response.data;
                $scope.error = false;
            })
            .catch(function () {
                $scope.error = true;
                $scope.errorMessage = "Failed to fetch data. Please try again later!";
            });
    };
});
