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