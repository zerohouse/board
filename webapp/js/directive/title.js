app.directive('title', function () {
    return {
        templateUrl: '/js/directive/title.html',
        restrict: 'A',
        scope: {
            title: '='
        },
        controller: function ($scope) {
        }
    };
});