Date.prototype.getString = function () {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth() + 1).toString(); // getMonth() is zero-based
    var dd = this.getDate().toString();
    return yyyy + (mm[1] ? mm : "0" + mm[0]) + (dd[1] ? dd : "0" + dd[0]); // padding
};

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
                    article.date = new Date().getString();
                    article.writer = $user.email;
                    article.id = response;
                    $scope.titles.push(article);
                });
            };
        }
    };
});