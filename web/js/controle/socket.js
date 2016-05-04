var ip = window.location.hostname, arquivo = "/socketNanoRace";
var socket = new WebSocket("ws://" + ip + ":8084/Nano_Race" + arquivo);

socket.onopen = function (evento){
    console.log("Abriu");
    var obj = {
        comando:"entrou"
    };
    socketSend(obj);
};

socket.onclose = function (evento){
    
};

socket.onerror = function (evento){
    
};

socket.onmessage = function (evento){
    var objJson = JSON.parse(evento.data);
    switch (objJson.comando){
        case "listaInicial":
            for(var i = 0, size = objJson.lista.length; i < size; i++){
                ControleFase.prototype.listaJogadores[objJson.lista[i].id] = objJson.lista[i];
                ControleFase.prototype.listaJogadores[objJson.lista[i].id].carro = new Carro();                
            }
            break;
        case "novo":
            ControleFase.prototype.novaPosicao(objJson.jogador);
    }
};

function socketSend(obj){
    socket.send(JSON.stringify(obj));
}