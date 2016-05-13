var Pista = function () {
    document.body.style.cursor = 'none';
    var posicaoInicialPista = {x: 1325, z: -1640};
    this.posicaoInicialCarro = {x: 1325, z: -1605};
    var SENTIDO_N = 0;
    var SENTIDO_S = 180 * Math.PI / 180;
    var SENTIDO_L = 90 * Math.PI / 180;
    var SENTIDO_O = -90 * Math.PI / 180;
    var sentidoAtual = SENTIDO_N;
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
    var carregadoN = false;
    var carregadoL = false;
    var carregadoC = false;
    var meshParaFisica;
    var ultimaPosicao = {x: 0, z: 0};

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
                    _self.pistaCurvaN.rotation.y = SENTIDO_S;
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

    this.points = function (_posicaoCheck, _nomePista) {
        this.materialChekpoint = new Physijs.createMaterial(new THREE.MeshPhongMaterial({
            ambient: 0x000fff,
            //shading: THREE.SmoothShading,
            opacity: 0.9,
            transparent: true,
            side: THREE.DoubleSide,
            visible: false
                    //anisotropy: 5
        }));
        var checkPoint;
        switch (_nomePista) {
            case "pistaMeio":
                this.valor = _posicaoCheck / 2;
                checkPoint = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), this.materialChekpoint, 0);
                checkPoint.name = "checkPoint";
                checkPoint.position.z = this.pistaMeio.position.z / this.valor;
                checkPoint.position.x = this.pistaMeio.position.x;
                //this.checkPoint.rotation.x = 90;
                checkPoint.position.y = 1.001;
                _self.fase.cena.add(checkPoint);
                _self.listaCheckPoints.push(checkPoint);
                break;
            case "pistaLateral":
                this.valor = parseInt(_posicaoCheck / 3);
                checkPoint = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), this.materialChekpoint, 0);
                checkPoint.name = "checkPoint";
                checkPoint.position.z = this.pistaMeio.position.z;
                checkPoint.position.x = this.pistaMeio.position.x;
                //this.checkPoint.rotation.x = 90;
                checkPoint.position.y = 1.1;
                _self.fase.cena.add(checkPoint);
                _self.listaCheckPoints.push(checkPoint);
                break;
            case "pistaVoltar":
                this.valor = parseInt(_posicaoCheck / 3);
                checkPoint = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), this.materialChekpoint, 0);
                checkPoint.name = "checkPoint";
                checkPoint.position.z = this.pistaMeio.position.z / this.valor;
                checkPoint.position.x = this.pistaMeio.position.x;
                //this.checkPoint.rotation.x = 90;
                checkPoint.position.y = 1.1;
                _self.fase.cena.add(checkPoint);
                _self.listaCheckPoints.push(checkPoint);
                break;
        }
    };

    this.criaPista = function (_x, _y, _z, _posicaoInicialX, _posicaoInicialZ, _nomePista, _nomeMaterial, _tamanhoPista, _direcao, _direcaoY) {
        //1325 / -1640
        if (_nomePista === "pistaMeio") {
            for (var i = 0; i < _tamanhoPista; i++) {
                this.pistaPosicaoX = _posicaoInicialX;
                this.pistaPosicaoZ = _posicaoInicialZ;
                this.pistaMeio = new Physijs.BoxMesh(new THREE.BoxGeometry(_x, _y, _z), _nomeMaterial.clone(), 0);
                this.pistaMeio.visible = true;
                this.pistaMeio.name = _nomePista;
                this.pistaMeio.position.x = this.pistaPosicaoX;
                this.pistaMeio.position.z = this.pistaPosicaoZ + 300 * i;
                this.pistaMeio.position.y = 0;


                if (i > 0) {
                    _self.pistaComum.scale.x = 150;
                    _self.pistaComum.scale.z = 150;
                    this.pistaMeio.add(_self.pistaComum.clone());
                } else {
                    this.pistaMeio.name = "largada";
                    _self.pistaLargada.scale.x = 150;
                    _self.pistaLargada.scale.z = 150;
                    this.pistaMeio.add(_self.pistaLargada);
                }
                _self.fase.cena.add(this.pistaMeio);


            }
            //checkpoints
            this.points(_tamanhoPista, _nomePista);
            this.referenciaX = this.pistaMeio.position.x;
            this.referenciaZ = this.pistaMeio.position.z;
        }
        if (_nomePista === "pistaCurva") {
//            this.pistaCurva = new Physijs.BoxMesh(new THREE.BoxGeometry(_x, _y, _z), matInicio, 0);
            this.pistaCurva = new Physijs.BoxMesh(new THREE.BoxGeometry(_x, _y, _z), _nomeMaterial.clone(), 0);
            _self.localDaCurva = this.pistaMeio.position.z;
            //this.pistaCurva.visible = true;
            var direcao;
            if (_direcao === "direita") {
                direcao = -1;
            } else {
                direcao = 1;
            }
            this.pistaCurva.name = _nomePista;
            this.pistaCurva.position.x = this.referenciaX;
            this.pistaCurva.position.z = this.referenciaZ + 299 * direcao;
            this.pistaCurva.position.y = 0;
            this.pistaCurva.rotation.y = -180 * Math.PI / 180;
            _self.pistaCurvaN.position.z = 0;
            _self.pistaCurvaN.scale.x = 150;
            _self.pistaCurvaN.scale.z = 150;
            this.pistaCurva.add(_self.pistaCurvaN);
            _self.fase.cena.add(this.pistaCurva);
//            this.curvaParteD = new Physijs.BoxMesh(new THREE.BoxGeometry(450, 3, 450), matFim, 0);
            this.curvaParteD = new Physijs.BoxMesh(new THREE.BoxGeometry(450, 1, 450), _nomeMaterial.clone(), 0);
            this.curvaParteD.position.x = this.pistaCurva.position.x + 78;
            this.curvaParteD.position.z = this.pistaCurva.position.z + 140;
            _self.fase.cena.add(this.curvaParteD);
            this.referenciaX = this.pistaCurva.position.x;
            this.referenciaZ = this.pistaCurva.position.z;
        }
        if (_nomePista === "pistaLateral") {
            for (var j = 0; j < _tamanhoPista; j++) {
                var direcao;
                var correcao;

                if (_direcao === "direita") {
                    direcao = -1;
                    correcao = 300;
                } else {
                    direcao = 1;
                    correcao = 0;
                    if (_direcaoY === "baixo") {
                        correcao = 600;
                    }

                }

                this.pistaMeio = new Physijs.BoxMesh(new THREE.BoxGeometry(_x, _y, _z), _nomeMaterial.clone(), 0);
                this.pistaMeio.visible = true;
                this.pistaMeio.name = _nomePista;
                // pistaMeioV.position.x = pistaCurve.position.x + 350;
                this.pistaMeio.position.z = this.referenciaZ + 150 * direcao - correcao;
                this.pistaMeio.rotation.y = 90 * Math.PI / 180;
                //variavel que pega o inicio da curva e e posiciona o novo elemento
                _self.pistaInicioL = this.referenciaX + 449.5 * direcao;


                this.pistaMeio.position.x = _self.pistaInicioL + 300 * j * direcao;
                this.pistaMeio.add(_self.pistaComum.clone());
                _self.fase.cena.add(this.pistaMeio);
            }
            this.points(_tamanhoPista, _nomePista);
            this.referenciaX = this.pistaMeio.position.x;
            this.referenciaZ = this.pistaMeio.position.z;
        }
        if (_nomePista === "curvaDois") {
//            this.pistaCurva = new Physijs.BoxMesh(new THREE.BoxGeometry(_x, _y, _z), matInicio, 0);
            this.pistaCurva = new Physijs.BoxMesh(new THREE.BoxGeometry(_x, _y, _z), _nomeMaterial.clone(), 0);
            var direcao;
            var distancia;
            var ajuste = 0;
            if (_direcao === "direita") {
                direcao = -1;
                distancia = -1;
                if (_direcaoY === "cima") {
                    direcao = -2;
                }
            }
            if (_direcao === "direita" && _direcaoY === "baixo") {
                direcao = -2;
                distancia = -1;
                ajuste = -150;
            } else {
                direcao = 1;
                distancia = 1;
            }
            this.pistaCurva.visible = true;
            this.pistaCurva.name = _nomePista;
            this.pistaCurva.position.z = this.referenciaZ + ajuste;
            this.pistaCurva.rotation.y = -90 * Math.PI / 180 * direcao;
            this.pistaCurva.position.x = this.referenciaX + 300 * distancia + ajuste;
            this.pistaCurva.add(_self.pistaCurvaN.clone());
            this.curvaParteD = new Physijs.BoxMesh(new THREE.BoxGeometry(450, 0, 350), _nomeMaterial.clone(), 0);
//            this.curvaParteD = new Physijs.BoxMesh(new THREE.BoxGeometry(450, 0, 350), matFim, 0);
            this.curvaParteD.position.x = -75;
            this.curvaParteD.position.z = -120;
            this.pistaCurva.add(this.curvaParteD);
            _self.fase.cena.add(this.pistaCurva);

            this.referenciaX = this.pistaCurva.position.x;
            this.referenciaZ = this.pistaCurva.position.z;
        }
        if (_nomePista === "pistaVoltar") {
            for (var j = 0; j < _tamanhoPista; j++) {
                var direcao;
                this.pistaMeio = new Physijs.BoxMesh(new THREE.BoxGeometry(_x, _y, _z), _nomeMaterial.clone(), 0);
                this.pistaMeio.visible = true;
                this.pistaMeio.name = _nomePista;
                if (_direcao === "direita") {
                    this.pistaMeio.position.z = (this.referenciaZ - 300 * j) - 300;
                    this.pistaMeio.position.x = this.referenciaX;
                    if (_direcaoY === "cima") {
                        this.pistaMeio.position.z = (this.referenciaZ + 300 * j) + 450;
                        this.pistaMeio.position.x = this.referenciaX - 450;
                    }
                } else {
                    this.pistaMeio.position.z = (this.referenciaZ - 300 * j) - 449;
                    this.pistaMeio.position.x = this.referenciaX + 150;
                }

                this.pistaMeio.add(_self.pistaComum.clone());
                _self.fase.cena.add(this.pistaMeio);

            }
            this.points(_tamanhoPista, _nomePista);
            this.referenciaX = this.pistaMeio.position.x;
            this.referenciaZ = this.pistaMeio.position.z;
        }
        if (_nomePista === "pistaCurvaVoltar") {
            this.curvaDois = new Physijs.BoxMesh(new THREE.BoxGeometry(_x, _y, _z), _nomeMaterial.clone(), 0);
            this.curvaDois.visible = true;
            this.curvaDois.name = _nomePista;

            var ajusteX = 0;
            var ajusteZ = 0;
            if (_direcao === "esquerda") {
                this.curvaDois.rotation.y = 90 * Math.PI / 180;
                ajusteX = 150;
                ajusteZ = -150;
                if (_direcaoY === "cima") {
                    ajusteX = -300;
                    ajusteZ = 300;
                }
            } else {
                this.curvaDois.rotation.y = 0;

            }
            this.curvaDois.position.z = this.referenciaZ - 299 + ajusteZ;
            this.curvaDois.position.x = this.referenciaX + ajusteX;
            this.curvaDois.add(_self.pistaCurvaN.clone());
            this.curvaParteE = new Physijs.BoxMesh(new THREE.BoxGeometry(450, 1, 350), _nomeMaterial.clone(), 0);
            this.curvaParteE.position.x = -75;
            this.curvaParteE.position.z = -120;
            this.curvaDois.add(this.curvaParteE);
            _self.fase.cena.add(this.curvaDois);
            //_self.fase.cena.add(this.curvaParteD);
        }
    };

    this.init = function () {
        var listener = new THREE.AudioListener();
        _self.fase.camera.add(listener);
        var sound1 = new THREE.Audio(listener);
        sound1.load('sound-music/sound-track.mp3');

        sound1.setRefDistance(1);
        sound1.autoplay = true;
        sound1.setLoop(true);
        sound1.setVolume(1000);
        //_self.fase.cena.add(sound1);

        var mundo = new THREE.Mesh(_self.geometria, _self.material);
        mundo.position.set(1900, 0, 200);
        mundo.scale.set(110, 110, 110);

        _self.fase.cena.add(mundo);
        meshParaFisica = new THREE.MeshPhongMaterial({
            ambient: 0x333333,
            opacity: 0.5,
            transparent: true
        });
        var chaoMeshPhisica = new Physijs.createMaterial(new THREE.MeshPhongMaterial({
            ambient: 0x333333,
            opacity: 0,
            transparent: true
        }));

        this.criaPista(300, 1, 300, 1325, -1640, "pistaMeio", chaoMeshPhisica, 20);
        this.criaPista(300, 1, 300, this.pistaPosicaoX, this.pistaPosicaoZ, "pistaCurva", chaoMeshPhisica, 20);
        this.criaPista(300, 1, 300, this.pistaPosicaoX, this.pistaPosicaoZ, "pistaLateral", chaoMeshPhisica, 10);
        this.criaPista(300, 1, 300, this.pistaPosicaoX, this.pistaPosicaoZ, "curvaDois", chaoMeshPhisica, 10);
        this.criaPista(300, 1, 300, this.pistaPosicaoX, this.pistaPosicaoZ, "pistaVoltar", chaoMeshPhisica, 3);
        this.criaPista(300, 1, 300, this.pistaPosicaoX, this.pistaPosicaoZ, "pistaCurvaVoltar", chaoMeshPhisica, 4);
        this.criaPista(300, 1, 300, this.pistaPosicaoX, this.pistaPosicaoZ, "pistaLateral", chaoMeshPhisica, 5, "direita", "cima");
        this.criaPista(300, 1, 300, this.pistaPosicaoX, this.pistaPosicaoZ, "curvaDois", chaoMeshPhisica, 1, "direita", "baixo");
        this.criaPista(300, 1, 300, this.pistaPosicaoX, this.pistaPosicaoZ, "pistaVoltar", chaoMeshPhisica, 10, "direita");
        this.criaPista(300, 1, 300, this.pistaPosicaoX, this.pistaPosicaoZ, "pistaCurvaVoltar", chaoMeshPhisica, 1, "esquerda");
        this.criaPista(300, 1, 300, this.pistaPosicaoX, this.pistaPosicaoZ, "pistaLateral", chaoMeshPhisica, 4, "esquerda", "baixo");
        this.criaPista(300, 1, 300, this.pistaPosicaoX, this.pistaPosicaoZ, "curvaDois", chaoMeshPhisica, 1);
        this.criaPista(300, 1, 300, this.pistaPosicaoX, this.pistaPosicaoZ, "pistaVoltar", chaoMeshPhisica, 8);
        this.criaPista(300, 1, 300, this.pistaPosicaoX, this.pistaPosicaoZ, "pistaCurvaVoltar", chaoMeshPhisica, 6);
        this.criaPista(300, 1, 300, this.pistaPosicaoX, this.pistaPosicaoZ, "pistaLateral", chaoMeshPhisica, 9, "direita", "cima");
        this.criaPista(300, 1, 300, this.pistaPosicaoX, this.pistaPosicaoZ, "pistaCurvaVoltar", chaoMeshPhisica, 1, "esquerda", "cima");
        this.criaPista(300, 1, 300, this.pistaPosicaoX, this.pistaPosicaoZ, "pistaVoltar", chaoMeshPhisica, 5, 'direita', "cima");

        criaObjDeTodaPista();
        criaLargada();
        criaReta(19);
        criaCurva(SENTIDO_O);
        criaReta(2);
        criaCurva(SENTIDO_S);
        criaReta(20);
        criaCurva(SENTIDO_L);
        criaReta(2);
        criaCurva(SENTIDO_N)
        _self.pista.position.y = 50;
        _self.pista.position.z = posicaoInicialPista.z;
        _self.pista.position.x = posicaoInicialPista.x;
        _self.fase.cena.add(_self.pista);
    };

    function criaObjDeTodaPista() {
        _self.pista = new Physijs.BoxMesh(new THREE.BoxGeometry(0, 0, 0), new Physijs.createMaterial(meshParaFisica.clone(), 0, 0), 0);
    }

    function criaLargada() {
        var p = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), new Physijs.createMaterial(meshParaFisica.clone(), 0, 0), 0);
        p.add(_self.pistaLargada.clone());
        p.position = {x: ultimaPosicao.x, y: 0, z: ultimaPosicao.z};
        _self.pista.add(p);
        mudaPosicaoAtual();
    }

    function criaReta(repeticao) {
        var p;
        for (var i = 0; i < repeticao; i++) {
            p = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), new Physijs.createMaterial(meshParaFisica.clone(), 0, 0), 0);
            p.add(_self.pistaComum.clone());
            p.position.x = ultimaPosicao.x;
            p.position.y = 0;
            p.position.z = ultimaPosicao.z;
            p.rotation.y = sentidoAtual;
            _self.pista.add(p);
            mudaPosicaoAtual();
        }
    }

    function criaCurva(direcao) {
        var inicio = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), new Physijs.createMaterial(meshParaFisica.clone(), 0, 0), 0);
        var fim = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 450), new Physijs.createMaterial(meshParaFisica.clone(), 0, 0), 0);

        inicio.position.x = ultimaPosicao.x;
        inicio.position.y = 0;
        inicio.position.z = ultimaPosicao.z;
        inicio.rotation.y = sentidoAtual;
        mudaPosicaoAtual();

        switch (direcao) {
            case SENTIDO_N:
                if (sentidoAtual == SENTIDO_L) {
                    fim.position.x = 75;
                    fim.position.z = -150;
                    ultimaPosicao.z += 150;
                    ultimaPosicao.x -= 450;
                } else {
                    fim.position.x = -75;
                    fim.position.z = 150;
                    ultimaPosicao.z += 150;
                    ultimaPosicao.x -= 450;
                }
                break;
            case SENTIDO_S:
                if (sentidoAtual == SENTIDO_L) {
                    fim.position.x = -75;
                    fim.position.z = 150;
                    ultimaPosicao.z -= 150;
                    ultimaPosicao.x -= 450;
                } else {
                    fim.position.x = -75;
                    fim.position.z = -150;
                    ultimaPosicao.z -= 450;
                    ultimaPosicao.x -= 150;
                }
                break;
            case SENTIDO_L:
                if (sentidoAtual == SENTIDO_N) {
                    fim.position.x = -75;
                    fim.position.z = 150;
                    ultimaPosicao.z -= 150;
                    ultimaPosicao.x -= 450;
                } else {
                    fim.position.x = -75;
                    fim.position.z = -150;
                    ultimaPosicao.z += 150;
                    ultimaPosicao.x -= 450;
                }
                break;
            case SENTIDO_O:
                if (sentidoAtual == SENTIDO_N) {
                    fim.position.x = 75;
                    fim.position.z = 150;
                    ultimaPosicao.z -= 150;
                    ultimaPosicao.x += 450;
                } else {
                    fim.position.x = 75;
                    fim.position.z = -150;
                    ultimaPosicao.z += 450;
                    ultimaPosicao.x -= 150;
                }
                break;
        }
        sentidoAtual = direcao;
        fim.position.y = 0;
        fim.rotation.y = sentidoAtual;
        inicio.add(fim);

        var clone = _self.pistaCurvaN.clone();
        clone.rotation.y = sentidoAtual;
        inicio.add(clone);
        _self.pista.add(inicio);
    }

    this.criaCheckPointCurva = function () {
        var inicioCurva, fimCurva;
        inicioCurva = new Physijs.BoxMesh(
                new THREE.BoxGeometry(_x, 1, 1),
                new THREE.MeshPhongMaterial({
                    ambient: 0x333333,
                    opacity: 0.9,
                    transparent: true,
                    side: THREE.DoubleSide,
                    visible: false
                }));
    };

    function mudaPosicaoAtual() {
        switch (sentidoAtual) {
            case SENTIDO_N:
                ultimaPosicao.z += 300;
                break;
            case SENTIDO_S:
                ultimaPosicao.z -= 300;
                break;
            case SENTIDO_L:
                ultimaPosicao.x -= 300;
                break;
            case SENTIDO_O:
                ultimaPosicao.x += 300;
                break;
        }

    }

};
