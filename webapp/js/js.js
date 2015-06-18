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

app.directive('article', function () {

    return {
        templateUrl: 'js/directive/articleTemplate.html',
        restrict: 'A',
        scope: {
            article: '='
        },
        controller: function ($scope) {

            $scope.modify = function () {
                $scope.article.mod = true;
            };
            $scope.done = function () {
                $scope.article.mod = false;
            };
        }
    };

});
app.factory('$req', function ($http) {
    var req = function (url, data, method) {
        if (method == undefined)
            method = "GET";
        if (data != undefined) {
            url += "?";
            url += parse(data);
        }

        function parse(obj) {
            var str = [];
            for (var p in obj) {
                if (p == 'equals')
                    continue;
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        }

        var http = $http({
            method: method,
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        var temp = http.success;
        http.success = function (call) {
            temp(function (response) {
                call(response);
            });
        };

        return http;
    };

    return req;
});

app.service('$article', function () {
    var list = this.list = [];

    function Article(head, body) {
        this.head = head;
        this.body = body;
    }

    Article.prototype.equals = function (obj) {
        if (obj == this)
            return true;
        if (obj.id == this.id)
            return true;
        return false;
    };

    Article.prototype.remove = function () {
        list.splice(list.indexOf(this), 1);
    };

    this.newArticle = function () {
        var article = new Article();
        article.mod = true;
        list.push(article);
    };

});
app.service('userAjax', function ($req) {
    this.login = function (user) {
        $req("/api/user/login", user, "POST").success(function (response) {
            return response;
        });
    };
});

app.controller('boardController', function ($scope, $article) {
    $scope.article = $article;

});
app.controller('imageController', function () {

});

app.controller('loginController', function (userAjax, $scope) {

    $scope.user = {};

    userAjax.login($scope.user);

});