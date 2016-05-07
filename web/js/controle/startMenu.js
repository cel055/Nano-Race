/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/* global arquivo, ip, abriuSocket, mensagemSocket */

var StartMenu = function(){
  document.getElementById('start').addEventListener('click', startGame);
  document.getElementById('multiplayer').addEventListener('click', subMenuStart);
  
  function subMenuStart(){
      document.getElementById('iporta').style.display = 'block';
      document.getElementById('botao').addEventListener('click', startGame);
      
  }
  function startGame (){
    var ip = document.getElementById('ip').value;
    var porta = document.getElementById('porta').value;
    document.getElementById('corpoMenu').style.display = 'none';
    controleFase = new ControleFase();
    socket = new WebSocket("ws://" + ip + ":" + porta + "/Nano_Race" + arquivo);
    socket.onopen = abriuSocket;
    socket.onmessage = mensagemSocket;
  }
  
};
