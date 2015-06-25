app.directive('article', function () {
    return {
        templateUrl: '/js/directive/article.html',
        restrict: 'E',
        scope: {},
        controller: function ($scope, $req, $routeParams, $user) {

            $scope.user = $user;

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
                $scope.newReply = {postId: $routeParams.articleId};
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


            $scope.writeReply = function () {
                $req("/api/reply", $scope.newReply, "POST").success(function (response) {
                    $scope.replies.push(response);
                });
            };

            $scope.deleteReply = function (id) {
                $req("/api/reply", {id: id}, "DELETE").success(function (response) {
                });
            };
        }
    };
});