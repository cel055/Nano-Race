var CarroIa = function(){
  Carro.apply(this); 
  var _self = this;
  this.movimentoCarro = function(){
      _self.aceleraFrenteCarro();
  }
};