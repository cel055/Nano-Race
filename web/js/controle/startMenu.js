/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global arquivo, ip, abriuSocket, mensagemSocket */

var StartMenu = function () {
    var entrar = false;
    document.getElementById('start').addEventListener('click', startGame);
    document.getElementById('multiplayer').addEventListener('click', subMenuStart);

    function subMenuStart() {
        if(entrar === false){
        document.getElementById('iporta').style.display = 'block';
        document.getElementById('botao').addEventListener('click', startGameMultiplayer);
         entrar = true;
        } else {
            document.getElementById('iporta').style.display = 'none';
            entrar = false;
        }
            

    }
    function startGameMultiplayer() {

        var ip = document.getElementById('ip').value;
        var porta = document.getElementById('porta').value;
        if (ip === '' && porta === '') {
            ip = location.hostname;
            porta = location.port;
        }
        document.getElementById('corpoMenu').style.display = 'none';
        controleFase = new ControleFase();
        socket = new WebSocket("ws://" + ip + ":" + porta + "/Nano_Race" + arquivo);
        socket.onopen = abriuSocket;
        socket.onmessage = mensagemSocket;
    }
    function startGame() {
        document.getElementById('corpoMenu').style.display = 'none';

       controleFase = new ControleFase();

        for (var i = 0; i <2; i++) {
            ControleFase.prototype.listaJogadores[i] = {};
            ControleFase.prototype.listaJogadores[i].id = i;
            ControleFase.prototype.listaJogadores[i].nave = "supernave";
            ControleFase.prototype.listaJogadores[i].carro = new CarroIa();
        }
        
        controleFase.inicia('a');
    }
};
