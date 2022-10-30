console.log("Got EP");
var generalLoopInterval = 100;

function initLoop() {
    var interval = setInterval(() => {
        replenishSkipButton();

        // Long answer copy+paste enable:
        $(".ProseMirror").attr("contenteditable", "true");

        if (onInfo() && !gameComplete()) {
            // Hide the "Next" button:
            $(".information-controls.ng-isolate-scope").css("display", "none !important");

            if ($("#learnplus-info-skip").is(":checked")) {
                skipInfo();
            }
        }
    }, generalLoopInterval);
}

function replenishSkipButton() {
    if ($("#learnplus-info-skip-wrapper").length == 0) {
        $("#sa-navigation-controls .sa-navigation-controls-content").append('<div id="learnplus-info-skip-wrapper"><input type="checkbox" id="learnplus-info-skip" /><label for="learnplus-info-skip" style="vertical-align: middle;">Skip</label></div>');

        appendCSS(`
            #learnplus-info-skip-wrapper {
                display: flex;
                align-items: center;
                margin-left: 10px;
                justify-content: center;
            }

            #learnplus-info-skip-wrapper > label {
                margin-left: 5px;
            }
        `);
    }
}

// FIXME: Temporary
function appendCSS(css) {
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');

    style.type = 'text/css';
    if (style.styleSheet) {
        style.styleSheet.cssText = css;
    } else {
        style.appendChild(document.createTextNode(css));
    }

    head.appendChild(style);
}

function onInfo() {
    return $(".information.selected").length > 0;
}

function skipInfo() {
    if (!onInfo()) return;
    $(".continue.arrow.action-bar-button.v-group.ng-isolate-scope > button").trigger("click");
}

function gameComplete() {
    var bars = $(".progress-bar.progress-bar-success");

    // Make sure all are width 100%
    for (var i = 0; i < bars.length; i++) {
        if ($(bars[i]).css("width") != "100%") return false;
    }

    return true;
}