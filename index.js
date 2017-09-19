"use strict";
var express = require('express');
var app = express();

app.use('/', express.static(__dirname + '/'));
app.listen(3000);

// Port where we'll run the websocket server
var webSocketsServerPort = 1337;

// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');

/**
 * Helper function for escaping input strings
 */

// list of currently connected clients (users)
var clients = [];


function htmlEntities(str) {
    return String(str)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;')
        .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/**
 *
 * HTTP server
 */
var server = http.createServer(function(request, response) {
    // Not important for us. We're writing WebSocket server,
    // not HTTP server
});

server.listen(webSocketsServerPort, function() {
    console.log((new Date()) + " Server is listening on port " + webSocketsServerPort);
});



/**
 * WebSocket server
 */
var wsServer = new webSocketServer({
    httpServer: server
});

/* This callback function is called every time someone
 *  tries to connect to the WebSocket server
 */
wsServer.on('request', function(request) {
    console.log((new Date()) + ' Connection from origin ' + request.origin + '.');

    var connection = request.accept(null, request.origin);

    var index = clients.push(connection) - 1;

    console.log((new Date()) + ' Connection accepted.');

    // user sent some message
    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            // we want to keep history of all sent messages
            console.log("message.utf8Data===", typeof message.utf8Data);

            var obj = {
                time: (new Date()).getTime(),
                text: message.utf8Data
            };

            // broadcast message to all connected clients
            for (var i = 0; i < clients.length; i++) {
                clients[i].sendUTF(JSON.stringify({ obj }));
            }
        }
    });

    // user disconnected
    connection.on('close', function(connection) {
        console.log((new Date()) + " Peer " + connection.remoteAddress + " disconnected.");
        // remove user from the list of connected clients
        clients.splice(index, 1);
    });
});
