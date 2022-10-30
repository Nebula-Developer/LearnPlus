const socketDest = 'http://localhost:3000'; // Replace for private server (or global server destination change)

var timerStart = Date.now();
var socket = io.connect("http://127.0.0.1:3000", {
    reconnection: true,
    reconnectionAttempts: Infinity,
    transports: ['websocket', 'polling']
});

socket.on('connect_error', function(err) {
    console.log('Connection error: ' + err);
});

function initMain() {
    socket.emit('get_script', 'main.js', function(data) {
        var init = new Function(data + '; return init;')();
        init(socket);
    });
}

initMain();
