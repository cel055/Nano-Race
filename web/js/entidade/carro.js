var Carro = function () {
    var _self = this;
    this.fase;
    this.carro;
    this.velocidade = 0;
    this.rotacao = 0;
    this.fase;
    this.carregado = false;
    this.geoFisicaCarro;
    this.gravidade = -10;
    this.rotSeno = 0;
    this.rotCoseno = 0;
    this.forcaColisao = {x:0,y:0,z:0};
    this.velX = 0;
    this.velZ = 0;

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
//        if (outroObj.name === "solo") {
//            console.error("colidiu!!!");
//        }
//        if (outroObj.name === "pistaMeio") {
//            console.error("colidiu!!!");
//        }
//        if (outroObj.name === "pistaLateral") {
//            console.error("colidiu pista lateral!!!");
//        }
    };

    this.aceleraFrenteCarro = function () {
//        _self.velX = _self.geoFisicaCarro.getLinearVelocity().x;
//        _self.velZ = _self.geoFisicaCarro.getLinearVelocity().z;
//        if(_self.velX == 0){
//            _self.velX = 1.1 * _self.rotSeno;
//        }else{
//            _self.velX *= 1.1 * _self.rotSeno;
//        }
//        if(_self.velZ == 0){
//            _self.velZ = 1.1 * _self.rotCoseno;
//        }else{
//            _self.velZ *= 1.1 * _self.rotCoseno;
//        }
        if (_self.velocidade < 2000) {
            if (_self.velocidade > 1000) {
                _self.velocidade += Math.abs(500 / (_self.velocidade / 5));
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
//        _self.velX = _self.geoFisicaCarro.getLinearVelocity().x;
//        _self.velZ = _self.geoFisicaCarro.getLinearVelocity().z;
//        if(_self.velX < 0){
//            _self.velX *= 1.1 * _self.rotSeno;
//        }else{
//            _self.velX *= 1.1 * _self.rotSeno;
//        }
//        if(_self.velZ < 0){
//            _self.velZ *= 1.1 * _self.rotCoseno;
//        }else{
//            _self.velZ *= 1.1 * _self.rotCoseno;
//        }
        if (_self.velocidade > -800) {
            if (_self.velocidade < 0) {
                _self.velocidade -= Math.abs(500 / (_self.velocidade / 10));
            } else if (_self.velocidade > 0) {
                _self.velocidade -= Math.abs(500 / (_self.velocidade / 15));
            } else {
                _self.velocidade = -10;
            }
        } else {
            _self.velocidade = -800;
        }
    };

    this.desaceleraCarro = function () {
        if (_self.velocidade > 100 || _self.velocidade < -100) {
            _self.velocidade *= 0.99;
        } else if (_self.velocidade > 1 || _self.velocidade < -1) {
            _self.velocidade *= 0.93;
        } else {
            _self.velocidade = 0;
        }
//        if (_self.velX > 100 || _self.velX < -100) {
//            _self.velX *= 0.99;
//        } else if (_self.velX > 1 || _self.velX < -1) {
//            _self.velX *= 0.93;
//        } else {
//            _self.velX = 0;
//        }
//        if (_self.velZ > 100 || _self.velZ < -100) {
//            _self.velZ *= 0.99;
//        } else if (_self.velZ > 1 || _self.velZ < -1) {
//            _self.velZ *= 0.93;
//        } else {
//            _self.velZ = 0;
//        }
    };

    this.viraDireita = function () {
//        _self.geoFisicaCarro.translate({x:_self.geoFisicaCarro.rotation.x,y:_self.geoFisicaCarro.rotation.y + 5,z:_self.geoFisicaCarro.rotation.z});
//        _self.geoFisicaCarro.translateOnAxis("Y", {x:_self.geoFisicaCarro.rotation.x,y:_self.geoFisicaCarro.rotation.y + 5,z:_self.geoFisicaCarro.rotation.z});
        _self.rotacao -= 2.5;
        _self.rotSeno = Math.sin(_self.rotacao * Math.PI / 180);
        _self.rotCoseno = Math.cos(_self.rotacao * Math.PI / 180);
    };

    this.viraEsquerda = function () {
        _self.rotacao += 2.5;
        _self.rotSeno = Math.sin(_self.rotacao * Math.PI / 180);
        _self.rotCoseno = Math.cos(_self.rotacao * Math.PI / 180);
    };

    this.moveCarro = function () {
//        if (_self.rotSeno < 0) {
//            _self.geoFisicaCarro.rotation.x = -0.05;
//        } else {
//            _self.geoFisicaCarro.rotation.x = 0.05;
//        }
//        if (_self.rotCoseno < 0) {
//            _self.geoFisicaCarro.rotation.z = -0.05;
//        } else {
//            _self.geoFisicaCarro.rotation.z = 0.05;
//        }
        _self.geoFisicaCarro.rotation.y = _self.rotacao * Math.PI / 180;
        _self.geoFisicaCarro.setLinearVelocity({x: _self.velocidade * _self.rotSeno, y: _self.geoFisicaCarro.getLinearVelocity().y, z: _self.velocidade * _self.rotCoseno});
//        _self.geoFisicaCarro.setLinearVelocity({x: _self.velX, y: _self.geoFisicaCarro.getLinearVelocity().y, z: _self.velZ});
    };
};