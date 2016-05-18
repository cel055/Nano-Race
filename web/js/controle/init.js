/* global startMenu */

window.addEventListener("load", inicia);
Physijs.scripts.worker = "js/libs/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";
var controleFase;
var eMobile = false;

function inicia() {
    if (window.device) {
        eMobile = true;
        document.addEventListener("deviceready", function () {
            new StartMenu();
        });
    } else if (navigator.userAgent.match(/Android/i)
            || navigator.userAgent.match(/iPhone/i)
            || navigator.userAgent.match(/iPad/i)
            || navigator.userAgent.match(/iPod/i)
            || navigator.userAgent.match(/Windows Phone/i)
            ) {
        eMobile = true;
    }
    new StartMenu();
}
