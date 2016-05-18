var Pista2 = function () {
    Pista.apply(this);
    var _self = this;
    
    this.init = function () {
        _self.initBase();
        _self.criaLargada();
        _self.criaReta(1);
        _self.criaCurva(_self.SENTIDO_L);
        _self.criaReta(3);
        _self.criaCurva(_self.SENTIDO_S);
        _self.criaReta(3);
        _self.criaCurva(_self.SENTIDO_L);
        _self.criaReta(3);
        _self.criaCurva(_self.SENTIDO_S);
        _self.criaReta(7);
        _self.criaCurva(_self.SENTIDO_O);
        _self.criaReta(20);
        _self.criaCurva(_self.SENTIDO_N);
        _self.criaReta(1);
        _self.criaCurva(_self.SENTIDO_L);
        _self.criaReta(8);
        _self.criaCurva(_self.SENTIDO_N);
        _self.criaReta(1);
        _self.criaCurva(_self.SENTIDO_O);
        _self.criaReta(1);
        _self.criaCurva(_self.SENTIDO_N);
        _self.criaReta(1);
        _self.criaCurva(_self.SENTIDO_L);
        _self.criaReta(3);
        _self.criaCurva(_self.SENTIDO_N);
        _self.criaReta(1);
    };
};