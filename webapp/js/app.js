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

    .controller('mainController', function ($scope, $route, $routeParams, $location) {
        $scope.$route = $route;
        $scope.$location = $location;
        $scope.$routeParams = $routeParams;
    });

//.service(function ($routeProvider, $locationProvider) {
//    $routeProvider
//        .when('/ng-board/article/:articleId', {
//            templateUrl: 'html/article.html',
//            controller: 'articleController',
//            resolve: {
//                // I will cause a 1 second delay
//                delay: function ($q, $timeout) {
//                    var delay = $q.defer();
//                    $timeout(delay.resolve, 1000);
//                    return delay.promise;
//                }
//            }
//        });
//
//    $locationProvider.html5Mode(true);
//});
