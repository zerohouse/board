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
