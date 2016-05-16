var CarroSocket = function (){
    Carro.apply(this);
    var _self = this;
    this.x = 0;
    this.y = 0;
    this.z = 0;
    this.rotacao = 0;
    
    this.moveCarro = function(){
        _self.geoFisicaCarro.position.x = _self.x;
        _self.geoFisicaCarro.position.y = _self.y;
        _self.geoFisicaCarro.position.z = _self.z;
        _self.geoFisicaCarro.rotation.y = _self.rotacao;
    };
    this.movimentoCarro = function (){
        
    };
};