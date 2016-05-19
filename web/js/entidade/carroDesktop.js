/* global THREEx, Carro */

var CarroDesktop = function () {
    CarroJogador.apply(this);
    var _self = this;
    this.teclado;

    this.init = function (x, z) {
        _self.teclado = new THREEx.KeyboardState();
        _self.initBase(x, z);
        _self.fase.camera.rotation.y = _self.carro.rotation.y;
        _self.fase.camera.rotation.x = _self.carro.rotation.x;
        _self.carro.add(_self.fase.camera);
        _self.fase.camera.position.set(0, 5, -10);
        _self.initJog();
    };

    this.movimentoCarro = function () {
        if (_self.teclado.pressed('down')) {
            _self.aceleraTrasCarro();
        } else if (_self.teclado.pressed('shift')) {
            _self.aceleraFrenteCarro();
        } else {
            _self.desaceleraCarro();
        }

        if (_self.teclado.pressed('right')) {
            _self.viraDireita();
        } else if (_self.teclado.pressed('left')) {
            _self.viraEsquerda();
        }
        document.getElementById('velocimetro').innerHTML = "kmH :  " + parseInt(_self.velocidade);
    };
};
