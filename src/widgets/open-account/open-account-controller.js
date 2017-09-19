'use strict';

angular
    .module('cobrowse')
    .controller('openAccountController', openAccountController);

/* @ngInject */
openAccountController.$inject = ['$scope', 'request', '$state','$stateParams', '$location'];

/*
 * @ngdocs method
 * @name openAccountController
 * @desctipon: This controller is used to handle the sign up functionality
 * @requires $scope
 * @requires request
 */
function openAccountController($scope, request,$state, $stateParams, $location) {
    var self = this;
    self.init = function() {
        if($location.$$search.type && $location.$$search.type === 'slave') {
            self.userType = 'slave'
        } else {
            self.userType = 'master';
        }
        self.createConnection();
    }
        
    /*
    *@name: createConnection
    *@description: create a socket connection
    */
    self.createConnection = function(userType) {

        if (!window.WebSocket) {
            console.log('Sorry, but your browser doesn\'t support WebSocket.');
            return;
        }
        // open connection
        connection = new WebSocket('ws://127.0.0.1:1337');
        
        if (connection) {
            console.log("calling on load socket methods");
            self.onLoadSocketMethods(userType);
        }
    }

    /*
     * @name: onLoadSocketMethods
     * @description: These method is used to open socket connection
     */
    self.onLoadSocketMethods = function() {
        // open
        connection.onopen = function() {
            console.log('connection on open');
        };

        // error
        connection.onerror = function(error) {
            console.log('Sorry, but there\'s some problem with your ' + 'connection or the server is down.');
        };

        // incoming messages
        connection.onmessage = function(message) {
            console.log('calling method :onmessage')
            self.onMessageConnection(message);
        };
    }

    /*
    * @name: onOpenConnection
    * @description: These method is used to send data to server
    */
    self.onOpenConnection = function(focusValue) {
        console.log("calling method: onOpenConnection");
            self.stopSend = true;
            var msg = {
                type: "utf8",
                obj: $scope.openAccObj,
                focus: focusValue,
                date: Date.now()
            };
            if (connection && self.stopSend) {
                console.log("watching", $scope.openAccObj);
                    console.log("calling method: send")
                    connection.send(JSON.stringify(msg));
                self.stopSend = false;
            }
    }

    /*
    * @name: onMessageConnection
    * @description: These method is used to get respose from server
    */
    self.onMessageConnection = function(message) {
        console.log("calling method: onMessageConnection", message);
        try {
            var json = JSON.parse(message.data);
        } catch (e) {
            console.log('Invalid JSON: ', message.data);
            return;
        }
        console.log("response", JSON.parse(json.obj.text).focus)
        $scope.$apply(function() {
            if (json.obj && json.obj.text) {
                var robj = JSON.parse(json.obj.text).obj;
                $scope.openAccObj = angular.copy(robj);
               // document.getElementByName(JSON.parse(json.obj.text).focus).focus();
                $scope.focusElement = JSON.parse(json.obj.text).focus;
             //   document.getElementById($scope.focusElement).focus();
                console.log("$scope.openAccObj", $scope.openAccObj);
                self.stopSend = false;
            }
        });
    }

    /*
    * intializations & declarations
    */
    self.openAccUrl = 'http://localhost:3000/#/openAccount?sessionId=ZGlsZWVwOTUwMg&type=slave';
    $scope.openAccObj = {};
    var connection = '';
    var slaveCreated = false;
    self.init();
}
