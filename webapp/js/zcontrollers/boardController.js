app.controller('boardController', function ($scope, $req, $routeParams, $timeout) {
    $timeout(function () {
        $scope.subject = $routeParams.subject;
        $req("/api/post", {subject: $routeParams.subject}).success(function (response) {
            if (response == null) {
                $scope.titles = [];
                return;
            }
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