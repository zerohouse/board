app.controller('loginController', function (userAjax, $scope) {

    $scope.user = {};

    userAjax.login($scope.user);

});