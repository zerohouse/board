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