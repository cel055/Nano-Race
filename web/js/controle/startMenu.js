/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

var startMenu = function(){
  document.getElementById('start').addEventListener('click', startGame);
  function startGame (){
      document.getElementById('corpoMenu').style.display = 'none';
      new ControleFase().inicia();
  }
  
};
