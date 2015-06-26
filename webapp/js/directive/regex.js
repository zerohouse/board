app.directive('regex', function ($compile) {
    return {
        restrict: 'A',
        scope: {},
        link: function (scope, element, attrs) {
            var message = angular.element("<div class='message' ng-show='!matched'>" + attrs.message + '</div>');
            $compile(message)(scope);

            element[0].parentNode.insertBefore(message[0], element[0].nextSibling);
            var regex = new RegExp(attrs.regex);
            var parent = scope.$parent;
            parent.$watch(attrs.ngModel, function () {
                if (parent.$eval(attrs.ngModel) == undefined || parent.$eval(attrs.ngModel) == "" || regex.test(parent.$eval(attrs.ngModel))) {
                    element.removeClass('waring');
                    scope.matched = true;
                    return;
                }
                element.addClass('waring');
                scope.matched = false;
            });
        }
    }
});