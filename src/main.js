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
        "educationperfect.com": () => { siteFetch('educationperfect', 'initLoop') },
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
async function global() {
    console.log('LearnPlus: Global function (from server) connection time: ' + (Date.now() - timerStart) + 'ms');

    // Fetch deps then sidebar
    var deps = await fileFetch('html/deps.html');
    document.head.innerHTML += deps;

    // Fetch sidebar
    var sidebar = await fileFetch('html/sidebar.html');
    document.body.innerHTML += sidebar;

    // Main css
    var mainCss = await fileFetch('css/main.css');
    document.head.innerHTML += '<style>' + mainCss + '</style>';
    console.log(mainCss);

    $("#learnplus-sidebar-tab").on('click', function() {
        $("#learnplus-sidebar").toggleClass("active");
    });

    document.addEventListener('mousedown', function(e) {
        var object = e.target;
        // Check if object is a child, or is the sidebar. if not, close sidebar
        if (!object.closest("#learnplus-sidebar") && !object.closest("#learnplus-sidebar-tab")) {
            $("#learnplus-sidebar").removeClass("active");
        }
    });
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

/**
 * Fetch a file from server
 */
function fileFetch(name) {
    return new Promise((resolve, reject) => {
        socket.emit('get_file', name, function(data) {
            resolve(data);
        });
    });
}