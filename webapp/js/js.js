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


app.directive('article', function () {
    return {
        templateUrl: '/js/directive/article.html',
        restrict: 'E',
        scope: {},
        controller: function ($scope, $req, $routeParams, $user) {

            $scope.delete = function () {
                $req("/api/post", {id: $routeParams.articleId}, "DELETE").success(function (response) {
                    if (!response)
                        return;
                    app.findScope("[ng-controller='boardController']").delete($routeParams.articleId);
                });
            };

            $scope.update = function () {
                $scope.updateState = true;
            };

            $scope.updateDone = function () {
                $req("/api/post", $scope.article, "PUT").success(function (response) {
                    if (!response)
                        return;
                    app.findScope("[ng-controller='boardController']").update($scope.article);
                    $scope.updateState = false;
                });
            };

            $scope.hasRight = function () {
                if ($scope.article == undefined)
                    return false;
                return $user.email == $scope.article.writer;
            };

            $scope.$watch(function () {
                return $routeParams.articleId;
            }, function () {
                $req("/api/post", {id: $routeParams.articleId}).success(function (response) {
                    $scope.article = response[0];
                });
            });
        }
    };
});
Date.prototype.getString = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]); // padding
};

app.directive('newArticle', function () {
    return {
        templateUrl: '/js/directive/newArticle.html',
        restrict: 'E',
        scope: {
            titles: '='
        },
        controller: function ($scope, $req, $routeParams, $user) {
            $scope.user = $user;
            $scope.article = {};
            $scope.article.subject = $routeParams.subject;
            $scope.save = function () {
                $req("/api/post", $scope.article, "POST").success(function (response) {
                    var article = {};
                    angular.copy($scope.article, article);
                    article.date = new Date().getString();
                    article.writer = $user.email;
                    $scope.titles.push(article);
                });
            };
        }
    };
});
app.directive('title', function () {
    return {
        templateUrl: '/js/directive/title.html',
        restrict: 'A',
        scope: {
            title: '='
        },
        controller: function ($scope) {
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

app.service('$user', function ($req) {

    var self = this;

    $req("/api/user").success(function (response) {
        if (response != null) {
            self.logged = true;
            self.email = response.email;
        }
    });

});

app.controller('boardController', function ($scope, $req, $routeParams, $timeout) {
    $timeout(function () {
        $scope.subject = $routeParams.subject;
        $req("/api/post", {subject: $routeParams.subject}).success(function (response) {
            $scope.titles = response;

        });
    });

    $scope.delete = function (id) {
        var index = findIndex(id);
        if (index == undefined)
            return;
        $scope.titles.splice(index, 1);
    };

    $scope.update = function (article) {
        var index = findIndex(article.id);
        if (index == undefined)
            return;
        var title = $scope.titles[index];
        title.title = article.title;
    };

    function findIndex(findId) {
        for (var i = 0; i < $scope.titles.length; i++) {
            if ($scope.titles[i].id == findId)
                return i;
        }
    };


});
app.controller('loginController', function ($scope, $req, $user) {

    $scope.user = $user;

    $scope.login = function () {
        $req("/api/user/login", $user, "POST").success(function (response) {
            if (response) {
                alert('로그인 성공!');
                $user.logged = true;
                return;
            }
            alert('로그인 실패!');
        });
    };

    $scope.logout = function () {
        $req("/api/user/logout").success(function (response) {
            if (response) {
                alert('로그아웃 성공!');
                $user.logged = false;
                return;
            }
            alert('로그아웃 실패!');
        });
    };

    $scope.register = function () {
        $req("/api/user", $user, "POST").success(function (response) {
            if (response) {
                alert('회원가입 성공!');
                return;
            }
            alert('회원가입 실패!');
        });
    };

});