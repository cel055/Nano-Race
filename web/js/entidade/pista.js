var Pista = function () {
    document.body.style.cursor = 'none';
    this.todosOsChecks = [];
    this.chegada = [];
    var posicaoInicialPista = {x: 1325, z: -1640};
    this.posicaoInicialCarro = {x: 1325, z: -1605};
    this.SENTIDO_N = 0;
    this.SENTIDO_S = 180 * Math.PI / 180;
    this.SENTIDO_L = 90 * Math.PI / 180;
    this.SENTIDO_O = -90 * Math.PI / 180;
    var sentidoAtual = this.SENTIDO_N;
    var _self = this;
    this.pista;
    this.carregado = false;
    this.fase;
    this.init;
    this.solo;
    this.pistaComum;
    this.carregado = false;
    this.pistaInicioL;
    this.esferaMundo;
    this.posiCarroX = 1325;
    this.posiCarroZ = -1605;
    this.listaCheckPoints = [];
    this.listaCurvas = [];
    var carregadoN = false;
    var carregadoL = false;
    var carregadoC = false;
    var meshParaFisica;
    var ultimaPosicao = {x: posicaoInicialPista.x, z: posicaoInicialPista.z};
    var numElementosFisica = 0;
    var confirmaCarregamentoFisica = 0;
    this.todasFisicaCarregada = false;

    this.carrega = function () {
        var intervalo = setInterval(function () {
            if (carregadoN && carregadoL && carregadoC) {
                clearInterval(intervalo);
                _self.carregado = true;
            }
        }, 50);
        var pistaN = new THREE.OBJMTLLoader();
        pistaN.load(
                "modelos/pistacomum.obj",
                "modelos/pistacomum.mtl",
                function (object) {
                    _self.pistaComum = object;
                    _self.pistaComum.traverse(
                            function (child) {
                                //child.castShadow = true;
                                child.receiveShadow = true;
                            }
                    );
                    _self.pistaComum.scale.x = 150;
                    _self.pistaComum.scale.z = 150;
                    carregadoN = true;
                }
        );
        var pistaL = new THREE.OBJMTLLoader();
        pistaL.load(
                "modelos/largada.obj",
                "modelos/largada.mtl",
                function (object) {
                    _self.pistaLargada = object;
                    _self.pistaLargada.traverse(
                            function (child) {
                                //child.castShadow = true;
                                child.receiveShadow = true;
                            }
                    );
                    _self.pistaLargada.scale.x = 150;
                    _self.pistaLargada.scale.z = 150;
                    carregadoL = true;
                }
        );
        var pistaC = new THREE.OBJMTLLoader();
        pistaC.load(
                "modelos/curva.obj",
                "modelos/curva.mtl",
                function (object) {
                    _self.pistaCurvaN = object;
                    _self.pistaCurvaN.traverse(
                            function (child) {
                                child.receiveShadow = true;
                            }
                    );
                    _self.pistaCurvaN.rotation.y = _self.SENTIDO_S;
                    _self.pistaCurvaN.scale.x = 150;
                    _self.pistaCurvaN.scale.z = 150;
                    carregadoC = true;
                }
        );
        //  criando o mundo ao redor
        _self.geometria = new THREE.SphereGeometry(50, 40, 40);
        _self.imagem = new THREE.ImageUtils.loadTexture('imagens/fundospecial.png');
        _self.imagem.minFilter = THREE.LinearFilter;
        _self.material = new THREE.MeshPhongMaterial({
            overdraw: true,
            map: _self.imagem,
            side: THREE.DoubleSide,
            color: 0xcccccc,
            specular: 0x111111,
            visible: true
        });

    };

    this.initBase = function () {
        var mundo = new THREE.Mesh(_self.geometria, _self.material);
        mundo.position.set(posicaoInicialPista.x, 0, posicaoInicialPista.z);
        mundo.scale.set(150, 150, 150);

        _self.fase.cena.add(mundo);
        meshParaFisica = new THREE.MeshPhongMaterial({
            ambient: 0x333333,
            opacity: 0,
            transparent: true
        });
    };

    this.criaLargada = function () {
        var p = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 301), new Physijs.createMaterial(meshParaFisica.clone(), 0, 0), 0);
        var check = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 30), new Physijs.createMaterial(meshParaFisica.clone(), 0, 0), 0);
        numElementosFisica += 2;
        check.name = "largada";
        check.position.y = 0.1;
        check.position.x = ultimaPosicao.x;
        check.position.z = ultimaPosicao.z;
        check.rotation.y = sentidoAtual;
        p.add(_self.pistaLargada.clone());
        p.position.y = 0;
        p.position.x = ultimaPosicao.x;
        p.position.z = ultimaPosicao.z;
        _self.fase.cena.add(check);
        _self.fase.cena.add(p);
        mudaPosicaoAtual();
        p.addEventListener( 'ready', fisicaCarregada);
        check.addEventListener( 'ready', fisicaCarregada);
    };

    this.criaReta = function (repeticao) {
        var p;
        for (var i = 0; i < repeticao; i++) {
            p = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 301), new Physijs.createMaterial(meshParaFisica.clone(), 0, 0), 0);
            p.add(_self.pistaComum.clone());
            p.position.x = ultimaPosicao.x;
            p.position.y = 0;
            p.position.z = ultimaPosicao.z;
            p.rotation.y = sentidoAtual;
            p.name = "reta";
            if (i % 2 != 0) {
                criaCheckPoint();
            }
            _self.fase.cena.add(p);
            p.addEventListener( 'ready', fisicaCarregada);
            mudaPosicaoAtual();
        }
    };

    this.criaCurva = function (direcao) {
        var inicio = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 301), new Physijs.createMaterial(meshParaFisica.clone(), 0, 0), 0);
        var fim = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 451), new Physijs.createMaterial(meshParaFisica.clone(), 0, 0), 0);
        var checkInicio = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 30), new Physijs.createMaterial(meshParaFisica.clone(), 0, 0), 0);
        var checkFim = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 30), new Physijs.createMaterial(meshParaFisica.clone(), 0, 0), 0);
        _self.listaCurvas.push(checkInicio);
        _self.listaCurvas.push(checkFim);
        var clone = _self.pistaCurvaN.clone();

        inicio.position.x = ultimaPosicao.x;
        inicio.position.y = 0;
        inicio.position.z = ultimaPosicao.z;
        inicio.rotation.y = sentidoAtual;

        mudaPosicaoAtual();

        checkInicio.name = "inicioCurva";

        switch (direcao) {
            case _self.SENTIDO_N:
                checkInicio.position.z = ultimaPosicao.z;
                if (sentidoAtual == _self.SENTIDO_L) {
                    checkInicio.name += "Esquerda";
                    checkInicio.position.x = ultimaPosicao.x + 600;
                    fim.position.x = -75;
                    ultimaPosicao.x += 150;
                    clone.rotation.y = _self.SENTIDO_S;
                } else {
                    checkInicio.name += "Direita";
                    checkInicio.position.x = ultimaPosicao.x - 600;
                    fim.position.x = 75;
                    ultimaPosicao.x -= 150;
                    clone.position.x = 150;
                    clone.position.z = -150;
                    clone.rotation.y = _self.SENTIDO_L;
                }
                fim.position.z = -150;
                fim.rotation.y = _self.SENTIDO_L;
                ultimaPosicao.z += 450;
                checkFim.position.x = ultimaPosicao.x;
                checkFim.position.z = ultimaPosicao.z - 200;
                break;
            case _self.SENTIDO_S:
                checkInicio.position.z = ultimaPosicao.z;
                if (sentidoAtual == _self.SENTIDO_L) {
                    checkInicio.name += "Direita";
                    checkInicio.position.x = ultimaPosicao.x + 600;
                    fim.position.x = 75;
                    fim.rotation.y = _self.SENTIDO_L;
                    ultimaPosicao.x += 150;
                    clone.rotation.y = _self.SENTIDO_L;
                    clone.position.x = 150;
                    clone.position.z = -150;
                } else {
                    checkInicio.name += "Esquerda";
                    checkInicio.position.x = ultimaPosicao.x - 600;
                    fim.position.x = -75;
                    fim.rotation.y = _self.SENTIDO_O;
                    ultimaPosicao.x -= 150;
                    clone.rotation.y = _self.SENTIDO_S;
                }
                fim.position.z = -150;
                ultimaPosicao.z -= 450;
                checkFim.position.x = ultimaPosicao.x;
                checkFim.position.z = ultimaPosicao.z + 200;
                break;
            case _self.SENTIDO_L:
                checkInicio.position.x = ultimaPosicao.x;
                if (sentidoAtual == _self.SENTIDO_N) {
                    checkInicio.name += "Direita";
                    checkInicio.position.z = ultimaPosicao.z - 600;
                    fim.position.x = -75;
                    fim.rotation.y = _self.SENTIDO_O;
                    ultimaPosicao.z -= 150;
                    clone.rotation.y = _self.SENTIDO_O;
                    clone.position.x = -150;
                    clone.position.z = 150;
                } else {
                    checkInicio.name += "Esquerda";
                    checkInicio.position.z = ultimaPosicao.z + 600;
                    fim.position.x = 75;
                    fim.rotation.y = _self.SENTIDO_L;
                    ultimaPosicao.z += 150;
                    clone.rotation.y = _self.SENTIDO_N;
                }
                fim.position.z = 150;
                ultimaPosicao.x -= 450;
                checkFim.position.x = ultimaPosicao.x + 200;
                checkFim.position.z = ultimaPosicao.z;
                break;
            case _self.SENTIDO_O:
                checkInicio.position.x = ultimaPosicao.x;
                if (sentidoAtual == _self.SENTIDO_N) {
                    checkInicio.name += "Esquerda";
                    checkInicio.position.z = ultimaPosicao.z - 600;
                    fim.position.x = 75;
                    fim.rotation.y = _self.SENTIDO_O;
                    ultimaPosicao.z -= 150;
                    clone.rotation.y = _self.SENTIDO_N;
                } else {
                    checkInicio.name += "Direita";
                    checkInicio.position.z = ultimaPosicao.z + 600;
                    fim.position.x = -75;
                    fim.rotation.y = _self.SENTIDO_L;
                    ultimaPosicao.z += 150;
                    clone.rotation.y = _self.SENTIDO_O;
                    clone.position.x = -150;
                    clone.position.z = 150;
                }
                fim.position.z = 150;
                ultimaPosicao.x += 450;
                checkFim.position.x = ultimaPosicao.x - 200;
                checkFim.position.z = ultimaPosicao.z;
                break;
        }

        checkInicio.position.y = 0.1;
        checkInicio.rotation.y = sentidoAtual;
        _self.fase.cena.add(checkInicio);

        sentidoAtual = direcao;
        fim.position.y = 0;
        inicio.add(fim);

        checkFim.position.y = 0.1;
        checkFim.rotation.y = sentidoAtual;
        checkFim.name = "fimCurva";
        _self.todosOsChecks.push(checkInicio);
        _self.todosOsChecks.push(checkFim);
        _self.fase.cena.add(checkFim);

        inicio.add(clone);
        numElementosFisica += 4;
        _self.fase.cena.add(inicio);
        inicio.addEventListener( 'ready', fisicaCarregada);
        fim.addEventListener( 'ready', fisicaCarregada);
        checkInicio.addEventListener( 'ready', fisicaCarregada);
        checkFim.addEventListener( 'ready', fisicaCarregada);
    };

    function criaCheckPoint() {
        var check = new Physijs.BoxMesh(new THREE.BoxGeometry(30, 1, 300), new Physijs.createMaterial(meshParaFisica.clone(), 0, 0), 0);
        numElementosFisica++;
        check.name = "check";
        check.position.y = 0.1;
        check.position.x = ultimaPosicao.x;
        check.position.z = ultimaPosicao.z;
        switch (sentidoAtual) {
            case _self.SENTIDO_O:
                check.rotation.y = _self.SENTIDO_N;
                break;
            case _self.SENTIDO_L:
                check.rotation.y = _self.SENTIDO_S;
                break;
            case _self.SENTIDO_S:
                check.rotation.y = _self.SENTIDO_L;
                break;
            case _self.SENTIDO_N:
                check.rotation.y = _self.SENTIDO_O;
                break;
        }
        _self.listaCheckPoints.push(check);
        _self.todosOsChecks.push(check);
        _self.fase.cena.add(check);
        check.addEventListener( 'ready', fisicaCarregada);
    }

    function mudaPosicaoAtual() {
        switch (sentidoAtual) {
            case _self.SENTIDO_N:
                ultimaPosicao.z += 300;
                break;
            case _self.SENTIDO_S:
                ultimaPosicao.z -= 300;
                break;
            case _self.SENTIDO_L:
                ultimaPosicao.x -= 300;
                break;
            case _self.SENTIDO_O:
                ultimaPosicao.x += 300;
                break;
        }

    }
    
    function fisicaCarregada(){
        confirmaCarregamentoFisica++;
        if(confirmaCarregamentoFisica == numElementosFisica){
            _self.todasFisicaCarregada = true;
        }
    }
};
