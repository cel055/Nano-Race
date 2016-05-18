var Pista1 = function (){
    Pista.apply(this);
    var _self = this;
    
    this.init = function (){
        _self.initBase();
        _self.criaLargada();
        _self.criaReta(19);
        _self.criaCurva(_self.SENTIDO_O);
        _self.criaReta(10);
        _self.criaCurva(_self.SENTIDO_S);
        _self.criaReta(3);
        _self.criaCurva(_self.SENTIDO_L);
        _self.criaReta(5);
        _self.criaCurva(_self.SENTIDO_S);
        _self.criaReta(10);
        _self.criaCurva(_self.SENTIDO_O);
        _self.criaReta(4);
        _self.criaCurva(_self.SENTIDO_S);
        _self.criaReta(8);
        _self.criaCurva(_self.SENTIDO_L);
        _self.criaReta(9);
        _self.criaCurva(_self.SENTIDO_N);
        _self.criaReta(5);
    };
};