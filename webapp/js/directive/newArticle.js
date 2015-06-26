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
            $scope.save = function () {
                $scope.article.subject = $routeParams.subject;
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