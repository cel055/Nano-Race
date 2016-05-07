var Carro = function () {
    var _self = this;
    var volta = 2;
    this.id;
    this.fase;
    this.checkPointAtual = 0;
    this.carro;
    this.velocidade = 0;
    this.rotacao = 0;
    this.fase;
    this.carregado = false;
    this.geoFisicaCarro;
    this.rotSeno = 0;
    this.rotCoseno = 0;
    this.escutador;
    this.sound2;

    this.carrega = function (obj, mtl) {


        var loader = new THREE.OBJMTLLoader();
        loader.load(obj, mtl,
                function (object) {
                    _self.carro = object;
                    _self.carro.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                    _self.carregado = true;
                    _self.carro.scale.x *= 5;
                    _self.carro.scale.y *= 5;
                    _self.carro.scale.z *= 5;
                });
    };

    this.initBase = function (x, z) {
        _self.escutador = new THREE.AudioListener();
        //audio aceleracao
        _self.fase.camera.add(_self.escutador);
        _self.sound2 = new THREE.Audio(_self.escutador);
        _self.sound2.load('sound-music/acelera1.ogg');
        _self.carro.add(_self.sound2);
        _self.sound2.setLoop(false);
        
        var materialFisicaCarro = new Physijs.createMaterial(new THREE.MeshPhongMaterial({
            shading: THREE.SmoothShading,
            opacity: 0.5,
            color: 0xFFFFFF,
            transparent: true,
            visible: false
        }));
        _self.geoFisicaCarro = new Physijs.BoxMesh(new THREE.BoxGeometry(6, 2, 6), materialFisicaCarro, 100);
        _self.geoFisicaCarro.visible = true;
        _self.geoFisicaCarro.name = "carro";
        _self.geoFisicaCarro.position.set(x, 10, z);
        _self.geoFisicaCarro.add(_self.carro);
        //_self.geoFisicaCarro.receiveShadow = true;
        _self.geoFisicaCarro.setCcdMotionThreshold(7);
        _self.geoFisicaCarro.setCcdSweptSphereRadius(0.2);
        _self.geoFisicaCarro.__dirtyRotation = true;
        _self.geoFisicaCarro.__dirtyPosition = true;

        _self.geoFisicaCarro.addEventListener('collision', _self.colisaoCarro);
        _self.rotSeno = Math.sin(_self.rotacao * Math.PI / 180);
        _self.rotCoseno = Math.cos(_self.rotacao * Math.PI / 180);
    };

    this.colisaoCarro = function (outroObj, velocidadeRelativa, rotacaoRelativa, contato) {
        if (outroObj.name === "checkPoint") {
            _self.checkPointAtual++;
            if (_self.fase.pista.listaCheckPoints.length <= _self.checkPointAtual) {
                _self.checkPointAtual = 0;
                volta--;
                document.getElementById('nvoltas').innerHTML = volta + "/2";
            }
        }
    };

    this.aceleraFrenteCarro = function () {
        if (_self.velocidade < 2000) {
            if (_self.velocidade > 1000) {
                _self.velocidade += Math.abs(500 / (_self.velocidade / 5));
                console.log(_self.velocidade * 0.2);
                _self.sound2.play();
            } else if (_self.velocidade > 0) {
                _self.velocidade += Math.abs(500 / (_self.velocidade / 10));
            } else if (_self.velocidade < 0) {
                _self.velocidade += Math.abs(500 / (_self.velocidade / 10));
            } else {
                _self.velocidade = 10;
            }
        } else {
            _self.velocidade = 2000;
        }

        
        

    };

    this.aceleraTrasCarro = function () {
        if (_self.velocidade > -800) {
            if (_self.velocidade < 0) {
                _self.velocidade -= Math.abs(500 / (_self.velocidade / 10));
            } else if (_self.velocidade > 0) {
                _self.velocidade -= Math.abs(500 / (_self.velocidade / 20));
            } else {
                _self.velocidade = -10;
            }
        } else {
            _self.velocidade = -800;
        }
    };

    this.desaceleraCarro = function () {
        _self.carro.rotation.x = 10 * Math.PI / 180;
        if (_self.velocidade > 100 || _self.velocidade < -100) {
            _self.velocidade *= 0.99;
        } else if (_self.velocidade > 1 || _self.velocidade < -1) {
            _self.velocidade *= 0.93;
        } else {
            _self.velocidade = 0;
        }
    };

    this.viraDireita = function () {
        _self.rotacao -= 2.5;
        _self.rotSeno = Math.sin(_self.rotacao * Math.PI / 180);
        _self.rotCoseno = Math.cos(_self.rotacao * Math.PI / 180);
        _self.carro.rotation.z = 5 * Math.PI / 180;
    };

    this.viraEsquerda = function () {
        _self.rotacao += 2.5;
        _self.rotSeno = Math.sin(_self.rotacao * Math.PI / 180);
        _self.rotCoseno = Math.cos(_self.rotacao * Math.PI / 180);
        _self.carro.rotation.z = -5 * Math.PI / 180;
    };

    this.moveCarro = function () {
                _self.sound2.setVolume(_self.velocidade * 0.05);
//        _self.geoFisicaCarro.__dirtyRotation = true;
        if (_self.geoFisicaCarro.position.y < -2) {
            _self.geoFisicaCarro.__dirtyPosition = true;
            _self.velocidade = 0;
            _self.geoFisicaCarro.setLinearVelocity({x: _self.geoFisicaCarro.getLinearVelocity().x * -1, y: _self.geoFisicaCarro.getLinearVelocity().y * -1, z: _self.geoFisicaCarro.getLinearVelocity().z * -1});
            _self.geoFisicaCarro.position.y = 5;
            _self.geoFisicaCarro.position.x = _self.fase.pista.listaCheckPoints[_self.checkPointAtual].position.x;
            _self.geoFisicaCarro.position.z = _self.fase.pista.listaCheckPoints[_self.checkPointAtual].position.z;
            return;
        }
        _self.geoFisicaCarro.rotation.y = _self.rotacao * Math.PI / 180;
        _self.geoFisicaCarro.setLinearVelocity({x: _self.velocidade * _self.rotSeno, y: _self.geoFisicaCarro.getLinearVelocity().y, z: _self.velocidade * _self.rotCoseno});
    };
};