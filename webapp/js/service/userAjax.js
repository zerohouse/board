app.service('userAjax', function ($req) {
    this.login = function (user) {
        console.log(user);
        $req("/api/user/login", user, "POST").success(function (response) {

        });
    };
});
