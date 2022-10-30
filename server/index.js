const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const fs = require('fs');
const http = require('http');

var app = express();
var server = http.createServer(app);
var io = socketIO(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST'],
        credentials: true
    },
    allowEIO3: true,
    transports: ['websocket', 'polling']
});

app.use(express.static(path.join(__dirname, '../client')));

io.on('connection', function(socket) {
    console.log('New user connected');
    socket.on('disconnect', function() {
        console.log('User disconnected');
    });

    socket.on('get_script', (name, callback) => {
        callback(fs.readFileSync(path.relative(__dirname, path.join(__dirname, '../src', name + '.js')), 'utf8'));
    });

    socket.on('get_file', (name, callback) => {
        callback(fs.readFileSync(path.relative(__dirname, path.join(__dirname, '../src', name)), 'utf8'));
    });
});

server.listen(3000, function() {
    console.log('Server started on port 3000');
});