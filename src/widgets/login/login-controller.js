(function() {
    'use strict';

    angular
        .module('cobrowse')
        .controller('loginController', loginController);

    loginController.$inject = ['$scope', '$state', '$stateParams'];
    /* @ngInject */
    function loginController($scope, $state, $stateParams) {
        var self = this;
        console.log("loginController calling")
        self.loginObj = {};
        self.login = function() {
            $state.go("openAccount", self.loginObj); 
             //$state.transitionTo('openAccount', {a:'1'});
        }
    }
})();
