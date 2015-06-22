Object.prototype.equals = function (obj) {
    if (this == obj)
        return true;
};

Date.prototype.getString = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]); // padding
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

Array.prototype.addAll = function (array) {
    for (var i = 0; i < array.length; i++) {
        this.push(array[i]);
    }
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


            $scope.refresh = function () {
                if ($routeParams.articleId == undefined)
                    return;
                $scope.info = {};
                $scope.info.postId = $routeParams.articleId;
                $scope.info.end = false;
                $scope.info.page = 0;
                $scope.info.depth = 0;
                $scope.replies = [];
                if ($scope.info.size == undefined)
                    $scope.info.size = 5;
                $scope.getReplies();
            };


            $scope.getReplies = function () {
                if ($scope.info.end) {
                    alert("리플이 없습니다.");
                    return;
                }
                $scope.info.start = $scope.info.page * $scope.info.size;
                $req("/api/reply", $scope.info).success(function (response) {
                    if (response == null) {
                        $scope.info.end = true;
                        return;
                    }
                    $scope.info.page++;
                    $scope.replies.addAll(response);
                });
            };

            $scope.refresh();

            $scope.$watch(function () {
                return $routeParams.articleId;
            }, function () {
                if ($routeParams.articleId == undefined) return;
                $req("/api/post", {id: $routeParams.articleId}).success(function (response) {
                    if (response == null) {
                        $scope.article = undefined;
                        return;
                    }
                    $scope.article = response;
                });
                $scope.refresh();
            });
        }
    };
});
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
                    article.writer = $user.email;
                    article.id = response;
                    if ($scope.titles == undefined)
                        $scope.titles = [];
                    $scope.titles.push(article);
                });
            };
        }
    };
});
app.directive('textarea', function () {
    return {
        restrict: 'E',
        link: function (scope, element, attributes) {
            var minHeight = element[0].offsetHeight,
                paddingLeft = element.css('paddingLeft'),
                paddingRight = element.css('paddingRight');

            var $shadow = angular.element('<div></div>').css({
                position: 'absolute',
                top: 0,
                opacity: 0,
                width: element[0].offsetWidth - parseInt(paddingLeft || 0) - parseInt(paddingRight || 0),
                fontSize: element.css('fontSize'),
                fontFamily: element.css('fontFamily'),
                lineHeight: element.css('lineHeight'),
                resize: 'none'
            });
            angular.element(document.body).append($shadow);

            var update = function () {
                var times = function (string, number) {
                    for (var i = 0, r = ''; i < number; i++) {
                        r += string;
                    }
                    return r;
                };

                var val = element.val().replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/&/g, '&amp;')
                    .replace(/\n$/, '<br/>&nbsp;')
                    .replace(/\n/g, '<br/>')
                    .replace(/\s{2,}/g, function (space) {
                        return times('&nbsp;', space.length - 1) + ' '
                    });
                $shadow.html(val);

                element.css('height', Math.max($shadow[0].offsetHeight + 10 /* the "threshold" */, minHeight) + 'px');
            };

            element.bind('keyup keydown keypress change', update);
            update();
        }
    }
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


    $scope.$watch(function () {
        return $routeParams.subject;
    }, function () {
        $scope.refresh();
    });

    $scope.getPosts = function () {
        if ($scope.info.end) {
            alert("포스트가 없습니다.");
            return;
        }
        $scope.info.start = $scope.info.page * $scope.info.size;
        $req("/api/post/list", $scope.info).success(function (response) {
            if (response == null) {
                $scope.info.end = true;
                return;
            }
            $scope.info.page++;
            $scope.titles.addAll(response);
        });
    };


    $scope.refresh = function () {
        if ($routeParams.subject == undefined)
            return;
        $scope.info = {};
        $scope.info.subject = $routeParams.subject;
        $scope.info.end = false;
        $scope.info.page = 0;
        $scope.titles = [];
        if ($scope.info.size == undefined)
            $scope.info.size = 5;
        $scope.getPosts();
    };

    $scope.refresh();

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
/**
 * Created by dev on 2015-06-21.
 */
app.controller('headerController', function ($scope, $routeParams) {
    $scope.$watch(function () {
        return $routeParams.subject;
    }, function () {
        $scope.subject = $routeParams.subject;
    });
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
app.controller('searchController', function ($scope, $req, $location) {

    $scope.results = [];

    $scope.$watch('keyword', function () {
        if ($scope.keyword == "") {
            $scope.results = [];
            return;
        }
        if ($scope.keyword == undefined) {
            return;
        }
        $req('/api/search', {keyword: $scope.keyword}).success(function (response) {
            if (response == null) {
                $scope.results = [];
                return;
            }
            $scope.results = response;
        });
    });

    function Result(subject, count) {
        this.subject = subject;
        this.count = count;
    }

    $scope.$watch(function () {
        return $scope.results;
    }, function () {
        if ($scope.keyword == undefined || $scope.keyword == "")
            return;
        $scope.select = 0;
        for (var i = 0; i < $scope.results.length; i++) {
            if ($scope.results[i].subject == $scope.keyword)
                return;
        }
        $scope.results.push(new Result($scope.keyword, 0));
    });

    $scope.isSelected = function (each) {
        return $scope.results.indexOf(each) == $scope.select;
    };

    $scope.sel = function (each) {
        $scope.select = $scope.results.indexOf(each);
    };

    $scope.movePage = function (result) {
        $location.path(result.subject);
        $scope.keyword = "";
    };

    $scope.move = function (e) {
        if ($scope.results.length == 0)
            return;
        switch (e.keyCode) {
            case 13:
                if ($scope.results[$scope.select] == undefined)
                    return;
                $scope.movePage($scope.results[$scope.select]);
                return;
            case 38:
                if ($scope.select == 0) {
                    $scope.select = $scope.results.length - 1;
                    return;
                }
                $scope.select--;
                return;
            case 40:
                if ($scope.select == $scope.results.length - 1) {
                    $scope.select = 0;
                    return;
                }
                $scope.select++;
                return;
        }
    };

});