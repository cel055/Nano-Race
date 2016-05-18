var CarroIa = function () {
    Carro.apply(this);
    var _self = this;
    var nariz;
    var correndo = true, fazendoCurva = false, sentidoCurva = 0;
    var contCurva = 0;

    this.init = function (x, z) {
        _self.initBase(x, z);
//        nariz = new Physijs.BoxMesh(new THREE.BoxGeometry(1, 0.1, 1), new Physijs.createMaterial(new THREE.MeshPhongMaterial({
//            ambient: 0x333333,
//            opacity: 0,
//            transparent: true
//        })));
//        nariz.position.z = 50;
//        _self.geoFisicaCarro.add(nariz);
    };



    this.movimentoCarro = function () {
        var posX = _self.fase.pista.listaCurvas[contCurva].position.x - _self.geoFisicaCarro.position.x, posZ = _self.fase.pista.listaCurvas[contCurva].position.z - _self.geoFisicaCarro.position.z;
        var atan = Math.atan2(posX, posZ);

        _self.rotSeno = Math.sin(atan);
        _self.rotCoseno = Math.cos(atan);
        _self.geoFisicaCarro.rotation.y = atan;

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
                    if (--_self.volta <= 0) {
                        alert("se mata");
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
            case "inicioCurvaEsquerda":
                _self.posicaoCheckPoint = {y: _self.geoFisicaCarro.rotation.y, rotacao: _self.rotacao, rotSeno: _self.rotSeno, rotCoseno: _self.rotCoseno};
                sentidoCurva = 0;
                fazendoCurva = true;
                correndo = false;
                contCurva++;
                break;
            case "inicioCurvaDireita":
                _self.posicaoCheckPoint = {y: _self.geoFisicaCarro.rotation.y, rotacao: _self.rotacao, rotSeno: _self.rotSeno, rotCoseno: _self.rotCoseno};
                sentidoCurva = 1;
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
            default :
                _self.estaVoando = false;

        }
    };

    this.moveCarro = function () {
        _self.sound2.setVolume(_self.velocidade * 0.05);
        if (_self.geoFisicaCarro.position.y < -10) {
            _self.estaVoando = true;
            fazendoCurva = false;
            correndo = true;
            _self.geoFisicaCarro.__dirtyRotation = true;
            _self.geoFisicaCarro.__dirtyPosition = true;
            _self.velocidade = 0;
            if (fazendoCurva) {
                contCurva--;
                if(contCurva < 0){
                    contCurva = _self.fase.pista.listaCurvas.length;
                }
                fazendoCurva = false;
                correndo = true;
            }
        }
        if (_self.geoFisicaCarro.position.y < -50) {
            fazendoCurva = false;
            correndo = true;
            _self.geoFisicaCarro.__dirtyRotation = true;
            _self.geoFisicaCarro.__dirtyPosition = true;

            _self.velocidade = 0;
            _self.geoFisicaCarro.setLinearVelocity({x: _self.geoFisicaCarro.getLinearVelocity().x * -1, y: _self.geoFisicaCarro.getLinearVelocity().y * -1, z: _self.geoFisicaCarro.getLinearVelocity().z * -1});

            _self.geoFisicaCarro.position.y = 4;
            _self.geoFisicaCarro.position.x = _self.fase.pista.listaCheckPoints[_self.checkPointAtual].position.x;
            _self.geoFisicaCarro.position.z = _self.fase.pista.listaCheckPoints[_self.checkPointAtual].position.z;

            _self.geoFisicaCarro.rotation.y = _self.posicaoCheckPoint.y;
            _self.geoFisicaCarro.rotation.x = 0;
            _self.geoFisicaCarro.rotation.z = 0;

            _self.rotacao = _self.posicaoCheckPoint.rotacao;
            _self.rotSeno = _self.posicaoCheckPoint.rotSeno;
            _self.rotCoseno = _self.posicaoCheckPoint.rotCoseno;

            _self.geoFisicaCarro.__dirtyRotation = true;
            _self.geoFisicaCarro.__dirtyPosition = true;
            return;
        }
        _self.geoFisicaCarro.rotation.y = _self.rotacao * Math.PI / 180;
        _self.geoFisicaCarro.setLinearVelocity({x: _self.velocidade * _self.rotSeno, y: _self.geoFisicaCarro.getLinearVelocity().y, z: _self.velocidade * _self.rotCoseno});
    };

};
