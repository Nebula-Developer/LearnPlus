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
            
        }
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
    console.log('Connection time: ' + (Date.now() - timerStart) + 'ms');
}