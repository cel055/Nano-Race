window.addEventListener("load", inicia);
Physijs.scripts.worker = "js/libs/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";

function inicia() {
    new ControleFase().inicia();
}
