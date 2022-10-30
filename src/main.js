var socket;
var href = window.location.href; // https://www.youtube.com/watch?v=QH2-TGUlwu4
var page = href.split('/')[2]; // www.youtube.com

function init(socketRes) {
    socket = socketRes;

    (async () => {
        var intervalConnectionCheck = setInterval(() => {
            if (socket.connected) {
                clearInterval(intervalConnectionCheck);
                global();
                attemptURL();
            }
        }, 50);
    })();
}

/**
 * Check if the current page is a supported page for custom page features
 */
function attemptURL() {
    const pages = {
        "instructure.com": () => {

        },
        "educationperfect.com": () => { siteFetch('educationperfect.js', 'initLoop') },
    };

    for (var key in pages) {
        if (page.includes(key)) {
            pages[key]();
        }
    }
}

/**
 * Global features (requires <all_urls>/"*:\/\/*\/*" permission)
 */
function global() {
    console.log('LearnPlus: Global function (from server) connection time: ' + (Date.now() - timerStart) + 'ms');
}

/**
 * Fetch a site JS from server
 */
function siteFetch(name, funcName = undefined) {
    socket.emit('get_script', name, function(data) {
        if (funcName) {
            var func = new Function(data + '; return ' + funcName + ';')();
            func();
        }
        else new Function(data)();
    });
}