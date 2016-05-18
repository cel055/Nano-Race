var CarroIa = function () {
    Carro.apply(this);
    var _self = this;
    var correndo = true, fazendoCurva = false;
    var contCurva = 0;

    this.init = function (x, z) {
        _self.initBase(x, z);
//        _self.carro.add(_self.fase.camera);
//        _self.fase.camera.position.set(0, 8.5, -10);
    };



    this.movimentoCarro = function () {
        var posX = _self.fase.pista.listaCurvas[contCurva].position.x - _self.geoFisicaCarro.position.x, posZ = _self.fase.pista.listaCurvas[contCurva].position.z - _self.geoFisicaCarro.position.z;
        var atan = Math.atan2(posX, posZ);

        _self.rotSeno = Math.sin(atan);
        _self.rotCoseno = Math.cos(atan);
        _self.geoFisicaCarro.rotation.y = atan;

        if (_self.volta <= 0) {
            if (_self.velocidade > 100) {
                _self.aceleraTrasCarro();
            } else {
                _self.desaceleraCarro();
            }
            return;
        }
        if (correndo && Math.random() < 0.6 && _self.velocidade < 1500) {
            _self.aceleraFrenteCarro();
        } else if (fazendoCurva) {
            _self.desaceleraCarro();
//            _self.aceleraTrasCarro();
        }
    };

    this.colisaoCarro = function (outroObj, velocidadeRelativa, rotacaoRelativa, contato) {
        switch (outroObj.name) {
            case "largada":
                if (_self.checkPointAtual == _self.fase.pista.listaCheckPoints.length - 1) {
                    --_self.volta;
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
            case "inicioCurvaEsquerda":
                _self.posicaoCheckPoint = {y: _self.geoFisicaCarro.rotation.y, rotacao: _self.rotacao, rotSeno: _self.rotSeno, rotCoseno: _self.rotCoseno};
                fazendoCurva = true;
                correndo = false;
                contCurva++;
                break;
            case "inicioCurvaDireita":
                _self.posicaoCheckPoint = {y: _self.geoFisicaCarro.rotation.y, rotacao: _self.rotacao, rotSeno: _self.rotSeno, rotCoseno: _self.rotCoseno};
                fazendoCurva = true;
                correndo = false;
                contCurva++;
                break;
            case "fimCurva":
                _self.posicaoCheckPoint = {y: _self.geoFisicaCarro.rotation.y, rotacao: _self.rotacao, rotSeno: _self.rotSeno, rotCoseno: _self.rotCoseno};
                fazendoCurva = false;
                correndo = true;
                contCurva++;
                if (contCurva == _self.fase.pista.listaCurvas.length) {
                    contCurva = 0;
                }
//                _self.geoFisicaCarro.rotation.y = outroObj.rotation.y;
                break;
        }
        _self.estaVoando = false;
    };

    this.moveCarro = function () {
        _self.geoFisicaCarro.__dirtyRotation = true;
        _self.geoFisicaCarro.rotation.y = 0;
        _self.geoFisicaCarro.rotation.z = 0;
        _self.geoFisicaCarro.rotation.x = 0;
        _self.sound2.setVolume(_self.velocidade * 0.05);
        if (_self.geoFisicaCarro.position.y < -50) {
            _self.estaVoando = true;
            fazendoCurva = false;
            correndo = true;
            _self.geoFisicaCarro.__dirtyPosition = true;
            _self.velocidade = 0;
            if (fazendoCurva) {
                contCurva--;
                if (contCurva < 0) {
                    contCurva = _self.fase.pista.listaCurvas.length;
                }
                fazendoCurva = false;
                correndo = true;
            }
        }
        if (_self.geoFisicaCarro.position.y < -100) {
            fazendoCurva = false;
            correndo = true;
            _self.geoFisicaCarro.__dirtyPosition = true;

            _self.velocidade = 0;
            _self.geoFisicaCarro.setLinearVelocity({x: 0, y: 0, z: 0});

            _self.geoFisicaCarro.position.y = 4;
            _self.geoFisicaCarro.position.x = _self.fase.pista.listaCheckPoints[_self.checkPointAtual].position.x;
            _self.geoFisicaCarro.position.z = _self.fase.pista.listaCheckPoints[_self.checkPointAtual].position.z;

            _self.rotacao = _self.posicaoCheckPoint.rotacao;
            _self.rotSeno = _self.posicaoCheckPoint.rotSeno;
            _self.rotCoseno = _self.posicaoCheckPoint.rotCoseno;

            _self.geoFisicaCarro.__dirtyRotation = true;
            _self.geoFisicaCarro.__dirtyPosition = true;
            _self.estaVoando = false;
            return;
        }
        _self.geoFisicaCarro.rotation.y = _self.rotacao * Math.PI / 180;
        _self.geoFisicaCarro.setLinearVelocity({x: _self.velocidade * _self.rotSeno, y: _self.geoFisicaCarro.getLinearVelocity().y, z: _self.velocidade * _self.rotCoseno});
    };

};
