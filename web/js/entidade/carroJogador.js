var CarroJogador = function () {
    Carro.apply(this);
    var _self = this;
    this.somFundo;
    
    this.initJog = function (){
        var listener = new THREE.AudioListener();
        _self.fase.camera.add(listener);
        _self.somFundo = new THREE.Audio(listener);
        _self.somFundo.load('sound-music/sound-track.mp3');
        _self.fase.camera.add(_self.somFundo);

        _self.somFundo.setRefDistance(1);
//        _self.somFundo.autoplay = true;
        _self.somFundo.setLoop(true);
        _self.somFundo.setVolume(100);
    }

    this.colisaoCarro = function (outroObj, velocidadeRelativa, rotacaoRelativa, contato) {
        switch (outroObj.name) {
            case "largada":
                if (_self.checkPointAtual == _self.fase.pista.listaCheckPoints.length - 1) {
                    document.getElementById("voltas").innerHTML = "Laps: " + --_self.volta + "/2";
                    if(_self.volta <= 0 && !_self.acabou){
                        _self.fase.pista.chegada.push(_self);
                        _self.acabou = true;
                    }
                }
                break;
            case "check":
                if (_self.fase.pista.listaCheckPoints[_self.checkPointAtual] == outroObj) {
                    return;
                }
                _self.posicaoCheckPoint = {y: _self.geoFisicaCarro.rotation.y, rotacao: _self.rotacao, rotSeno: _self.rotSeno, rotCoseno: _self.rotCoseno};
                for (var i = 0, size = _self.fase.pista.listaCheckPoints.length; i < size; i++) {
                    if (outroObj == _self.fase.pista.listaCheckPoints[i]) {
                        _self.checkPointAtual = i;
                        return;
                    }
                }
                break;
        }
        _self.estaVoando = false;
    };
}