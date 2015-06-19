Object.prototype.equals = function (obj) {
    if (this == obj)
        return true;
};

Array.prototype.contains = function (obj) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == obj)
            return true;
        if (obj instanceof Object)
            if (obj.equals(this[i]))
                return true;
    }
    return false;
};

var app = angular.module('board', ['ngRoute'])

    .controller('mainController', function ($scope, $route, $routeParams, $location, $timeout) {
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
    })
    .config(function ($routeProvider, $locationProvider) {
        $routeProvider
            .when('/:subject', {})
            .when('/:subject/:articleId', {});

        // configure html5 to get links working on jsfiddle
        $locationProvider.html5Mode({
            enabled: true,
            requireBase: false
        });
    });

app.findScope = function (selector) {
    return angular.element(document.querySelector(selector)).scope();
};
