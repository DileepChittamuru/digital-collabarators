(function() {
    'use strict';

    angular
        .module('cobrowse')
        .controller('homeController', homeController);

    homeController.$inject = ['$scope'];
    
    /* @ngInject */
    function homeController($scope) {
        var self = this;
       console.log("homeController calling")
    }
})();
