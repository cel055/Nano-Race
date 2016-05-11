var CarroIa = function(){
  Carro.apply(this); 
  var _self = this;
  this.movimentoCarro = function(){
      _self.aceleraFrenteCarro();
  };
  
  this.colisaoCarro = function (outroObj, velocidadeRelativa, rotacaoRelativa, contato){
     if (outroObj.name === "checkPoint") {
            for (var i = 0, size = _self.fase.pista.listaCheckPoints.length; i < size; i++) {
                if (outroObj == _self.fase.pista.listaCheckPoints[i]) {
                    if (_self.checkPointAtual == size - 1 && i == 0) {
                        document.getElementById("voltas").innerHTML = "voltas: " + --volta + "/2";
                    }
                    _self.checkPointAtual = i;
                    return;
                }
            }
        } 
  };
};