app.factory('$req', function ($http) {
    var req = function (url, data, method) {
        if (method == undefined)
            method = "GET";
        if (data != undefined) {
            url += "?";
            url += parse(data);
        }

        function parse(obj) {
            var str = [];
            for (var p in obj) {
                if (p == 'equals')
                    continue;
                str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
            }
            return str.join("&");
        }

        var http = $http({
            method: method,
            url: url,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        var temp = http.success;
        http.success = function (call) {
            temp(function (response) {
                call(response);
            });
        };

        return http;
    };

    return req;
});
