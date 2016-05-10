var CarroMobile = function () {
    Carro.apply(this);
    var _self = this;
    this.x;
    this.y;
    this.z;
    this.watchId;
    this.init = function (x, z) {
        _self.initBase(x, z);
        _self.fase.camera.rotation.y = _self.carro.rotation.y;
        _self.fase.camera.rotation.x = _self.carro.rotation.x;
        _self.geoFisicaCarro.add(_self.fase.camera);
        _self.fase.camera.position.set(0, 8.5, -18);
        watchId = navigator.accelerometer.watchAcceleration(onSuccess, onError, {frequency: 100});
    };
    
    this.movimentoCarro = function () {
        if (true) {
            _self.aceleraTrasCarro();
            _self.carro.rotation.x = 0 * Math.PI / 180;
        } else if (true) {
            _self.aceleraFrenteCarro();
            if (true || _self.teclado.pressed('left') === false) {
                _self.carro.rotation.x = 0 * Math.PI / 180;
                _self.carro.rotation.z = 0 * Math.PI / 180;
            }
        } else {
            _self.desaceleraCarro();
            _self.carro.rotation.z = 0 * Math.PI / 180;
        }

        if (true) {
            _self.viraDireita();
        } else if (true) {
            _self.viraEsquerda();
        }
        document.getElementById('velocimetro').innerHTML = "kmH :  " + parseInt(_self.velocidade);
    };
    
    function onSuccess(acceleration) {
        _self.x = acceleration.x;
        _self.y = acceleration.y;
        _self.z = acceleration.z;
    }
    function onError() {

    }
}