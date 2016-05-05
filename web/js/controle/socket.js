var ip = window.location.hostname, arquivo = "/socketNanoRace";
var socket;

//socket.onclose = function (evento) {
//
//};
//
//socket.onerror = function (evento) {
//
//};

function abriuSocket(evento) {
    console.log("Abriu");
    var obj = {
        comando: "entrou"
    };
    socketSend(obj);
}

function mensagemSocket(evento) {
    var objJson = JSON.parse(evento.data);
    switch (objJson.comando) {
        case "listaInicial":
            for (var i = 0, size = objJson.lista.length; i < size; i++) {
                ControleFase.prototype.listaJogadores[objJson.lista[i].id] = objJson.lista[i];
                ControleFase.prototype.listaJogadores[objJson.lista[i].id].carro = new Carro();
            }
            controleFase.inicia(objJson.id);
            break;
        case "novo":
            if (!ControleFase.prototype.listaJogadores[objJson.jogador.id]) {
                ControleFase.prototype.listaJogadores[objJson.jogador.id] = objJson.jogador;
                ControleFase.prototype.colocaNovoCarroNaCena(ControleFase.prototype.listaJogadores[objJson.jogador.id]);
            } else {
                ControleFase.prototype.novaPosicao(objJson.jogador);
            }
    }
}

function socketSend(obj) {
    socket.send(JSON.stringify(obj));
}