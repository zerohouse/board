app.service('$user', function ($req) {

    var self = this;

    $req("/api/user").success(function (response) {
        if (response != null) {
            self.logged = true;
            self.email = response.email;
        }
    });

});
