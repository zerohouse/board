app.controller('loginController', function ($scope, $req, $user, $regex) {

    $scope.user = $user;

    $scope.login = function () {
        if (!$regex('user')) {
            alert('조건이 안맞음');
            return;
        }
        $req("/api/user/login", $user, "POST").success(function (response) {
            if (response) {
                alert('로그인 성공!');
                $user.logged = true;
                return;
            }
            alert('로그인 실패!');
        });
    };

    $scope.logout = function () {
        $req("/api/user/logout").success(function (response) {
            if (response) {
                alert('로그아웃 성공!');
                $user.logged = false;
                return;
            }
            alert('로그아웃 실패!');
        });
    };

    $scope.register = function () {
        $req("/api/user", $user, "POST").success(function (response) {
            if (response) {
                alert('회원가입 성공!');
                return;
            }
            alert('회원가입 실패!');
        });
    };


});