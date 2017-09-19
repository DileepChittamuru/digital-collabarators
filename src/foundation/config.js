/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
(function() {
    var config = function() {
        var configObj = {
            protocol: 'http', // protocol http (or) https
            host: 'localhost', //ip addressor domain name of machine hosting the server
            //"host":"52.26.211.90",//ip addressor domain name of machine hosting the server
            port: '8090', //port of the server
            paths: { //key is string to be used to access and value will be particular method/action on server
                login: '/login',
                register: '/register'
            },
            url: function(path) {
                //constructs url for ajax call using above key-values
                if (configObj.paths.hasOwnProperty(path)) {
                    return configObj.protocol + '://' + configObj.host + ':' + configObj.port + configObj.paths[path];
                } else {
                    return 'invalid';
                }
            },
            debug_mode: true // enable/disable logs true/false
        };
        return configObj;
    };
    var module = angular.module('cobrowse');
    module.factory('config', config);
    module.config(['$httpProvider', function($httpProvider) {
            $httpProvider.defaults.useXDomain = true;
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }
    ]);
}());
