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
            _self.carro.rotation.x = 0 * Math.PI / 180;
        } else if (_self.teclado.pressed('shift')) {
            _self.aceleraFrenteCarro();
            if(_self.teclado.pressed('right') === false|| _self.teclado.pressed('left')=== false){
                _self.carro.rotation.x = 0 * Math.PI / 180;
                _self.carro.rotation.z = 0 * Math.PI / 180;
//                var escutador = new THREE.AudioListener();
//                //audio aceleracao
//        _self.fase.camera.add(escutador);
//        _self.sound2 = new THREE.Audio(escutador);
//             _self.sound2.load('sound-music/acelera1.ogg');
//        
//        _self.sound2.setRefDistance( 5 );
//            _self.sound2.autoplay = true;
//            _self.sound2.setLoop(false);
//            _self.sound2.setVolume(500);
//            _self.carro.add(_self.sound2);
            }
        } else {
            _self.desaceleraCarro();
            _self.carro.rotation.z = 0 * Math.PI / 180;
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