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
        //watchId = navigator.accelerometer.watchAcceleration(onSuccess, onError, {frequency: 100});
    if (window.DeviceOrientationEvent) {
  window.addEventListener('deviceorientation', deviceMotionHandler, false);
      }
    };

    function deviceMotionHandler(evento) {
       // var acceleration = evento.acceleration;
        //var rotacao = evento.rotationRate;
        _self.x = evento.alpha;
        _self.y =  evento.beta;
        _self.z = evento.gama;
    }

    this.movimentoCarro = function () {
        if (_self.x > 4) {
            _self.aceleraTrasCarro();
            _self.carro.rotation.x = 0 * Math.PI / 180;
        } else if (_self.x < -1) {
            _self.aceleraFrenteCarro();
            if (_self.y < -4) {
                _self.carro.rotation.x = 0 * Math.PI / 180;
                _self.carro.rotation.z = 0 * Math.PI / 180;
            }
        } else {
            _self.desaceleraCarro();
            _self.carro.rotation.z = 0 * Math.PI / 180;
        }

        if (this.y > 4) {
            _self.viraDireita();
        } else if (false) {
            _self.viraEsquerda();
        }
        document.getElementById('velocimetro').innerHTML = "kmH :  " + parseInt(_self.velocidade);
    };

    function onSuccess(rotation) {
        _self.x = rotation.alpha;
        _self.y =  rotation.beta .y;
        _self.z = acceleration.z;
    }
    function onError() {

    }
};