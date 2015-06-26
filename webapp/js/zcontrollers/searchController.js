app.controller('searchController', function ($scope, $req, $location, $routeParams) {

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