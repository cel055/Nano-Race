/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global arquivo, ip, abriuSocket, mensagemSocket */

var StartMenu = function(){
  document.getElementById('start').addEventListener('click', startGame);
  function startGame (){
    document.getElementById('corpoMenu').style.display = 'none';
    controleFase = new ControleFase();
    socket = new WebSocket("ws://" + ip + ":8084/Nano_Race" + arquivo);
    socket.onopen = abriuSocket;
    socket.onmessage = mensagemSocket;
  }
  
};
