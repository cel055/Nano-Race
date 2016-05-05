window.addEventListener("load", inicia);
Physijs.scripts.worker = "js/libs/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";
var controleFase;

function inicia() {
    controleFase = new ControleFase();
    socket = new WebSocket("ws://" + ip + ":8084/Nano_Race" + arquivo);
    socket.onopen = abriuSocket;
    socket.onmessage = mensagemSocket;
}
