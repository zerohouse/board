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