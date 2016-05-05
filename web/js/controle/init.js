/* global startMenu */

window.addEventListener("load", inicia);
Physijs.scripts.worker = "js/libs/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";
var controleFase;

function inicia() {
    new startMenu();
}
