(function() {
    var request = function($http, config, $timeout) {
        var postService = function(u_string, params, type, cb) {
            if (typeof params.append == "function") {
                var configHeaders = {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined }
                }
            } else {
                configHeaders = {};
            }
            $http[type](config.url(u_string), params, configHeaders)
                .success(function(data, status) { //data, status, headers, config
                    if (data.statusCode === "200") {
                        cb(data);
                    } else {
                        // if(data.statusMessage === "Please send a valid token!!" ){
                        if (data.statusCode === "404") {
                            alert({ title: "You are already logged in on another browser.", content: "You will be logged out automaticaly. Please login again.", placement: 'top', type: "info", show: true });
                            $timeout(function() {
                                window.location.hash = '/';
                                window.location.reload();
                            }, 3000);
                        } else {
                            cb(data);
                        }
                    }
                })
                .error(function() { //data, status, headers, config
                    cb({ "statusCode": "400", "statusMessage": "Connection could not be established. Please try again." });
                });
        };
        return {
            "postService": postService
        }
    };
    var app = angular.module('cobrowse');
    app.factory("request", ["$http", "config", "$timeout", request]);
}());
