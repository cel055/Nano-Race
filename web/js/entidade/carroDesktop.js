var CarroDesktop = function () {
    Carro.apply(this);
    var _self = this;
    this.teclado;

    this.init = function (x, z) {
        _self.teclado = new THREEx.KeyboardState();
        _self.initBase(x, z);
        _self.geoFisicaCarro.add(_self.fase.camera);
        _self.fase.camera.position.set(0, 8.5, -18);
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
//        if (_self.teclado.pressed('h')) {
//            var divDebug = document.getElementById('debugar');
//            if (divDebug.style.display && divDebug.style.display == 'none') {
//                divDebug.style.display = 'block';
//            }else{
//                divDebug.style.display = 'none';
//            }
        //}
//        _self.moveCarro();
        document.getElementById('marcador').innerHTML = "kmH :  " + parseInt(_self.velocidade);
    };
};