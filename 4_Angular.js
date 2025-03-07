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
