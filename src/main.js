var socket;
var href = window.location.href; // https://www.youtube.com/watch?v=QH2-TGUlwu4
var page = href.split('/')[2]; // www.youtube.com

function initLearnPlus(socketRes) {
    socket = socketRes;
    // Set init to nothing so we don't run it again

    // on load
    globalLearnPlus();
    attemptURL();
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
async function globalLearnPlus() {
    console.log('LearnPlus: Global function (from server) connection time: ' + (Date.now() - timerStart) + 'ms');

    
    // Fetch sidebar
    var sidebar = await fileFetch('html/sidebar.html');
    document.body.innerHTML += sidebar;
    console.log(sidebar)

    // Kit Code: <script src="https://kit.fontawesome.com/46f5a2289b.js" crossorigin="anonymous"></script>
    $('body').append(`<script src="https://kit.fontawesome.com/46f5a2289b.js" crossorigin="anonymous"></script>`);


    // Main css
    var mainCss = await fileFetch('css/main.css');
    document.head.innerHTML += '<style>' + mainCss + '</style>';

    $("#learnplus-sidebar-tab").on('click', function() {
        $("#learnplus-sidebar").toggleClass("active");
    });

    $(".learnplus-sidebar-content-item").on('click', function() {
        var pageId = $(this).attr('learnplus-page-call');
        
        var page = $(".learnplus-sidebar-page[learnplus-page-id='" + pageId + "']");
        
        if (page.hasClass('active')) {
            page.removeClass('active');
            $(this).removeClass('active');
            return;
        }
        
        $(".learnplus-sidebar-page.active").removeClass('active');
        page.addClass('active');
        $(".learnplus-sidebar-content-item.active").removeClass('active');
        $(this).addClass('active');
    });

    window.addEventListener('mousedown', function(e) {
        var object = e.target;
        // Check if object is a child, or is the sidebar. if not, close sidebar
        if ((!object.closest("#learnplus-sidebar") && !object.closest("#learnplus-sidebar-tab")) || !object) {
            if ($(".learnplus-sidebar-page.active").length > 0) return;
            $("#learnplus-sidebar").removeClass("active");
        }

        console.log(object)
    });

    // learnplus-frac-numerator and learnplus-frac-denominator on input
    $('body').on('input', '#learnplus-frac-numerator, #learnplus-frac-denominator', function() {
        var gcd = function gcd(a,b){
            return b ? gcd(b, a%b) : a;
        };
        
        var numerator = parseInt($('#learnplus-frac-numerator').val());
        var denominator = parseInt($('#learnplus-frac-denominator').val());

        if (isNaN(numerator) || isNaN(denominator)) return;

        var gcd = gcd(numerator, denominator);
        numerator /= gcd;
        denominator /= gcd;

        $('#learnplus-fraction-simplify-output').text(numerator + ' / ' + denominator);
    });

    $("#learnplus-base-calc").on('input', function() {
        var input = $(this).val();
        if (input.length == 0) {
            $("#learnplus-base-calc-output").text('0');
            return;
        }

        input = input.replaceAll('pi', Math.PI);
        input = input.replaceAll('e', Math.E);
        input = input.replaceAll('phi', (1 + Math.sqrt(5)) / 2);

        // Find sin/cos/tan(num) and replace with real val
        var sinRegex = /(sin|cos|tan|sqrt|abs|round)\((.*?)\)/g;
        var sinMatch = sinRegex.exec(input);
        while (sinMatch != null) {
            var sinVal = Math[sinMatch[1]](sinMatch[2]);
            input = input.replace(sinMatch[0], sinVal);
            sinMatch = sinRegex.exec(input);
        }

        // Check if contains words
        if (/[a-zA-Z]/.test(input)) {
            $("#learnplus-base-calc-output").text('0 (invalid)');
            return;
        }

        var output = eval(input);
        $("#learnplus-base-calc-output").text(output);
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