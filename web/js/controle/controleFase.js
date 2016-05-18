/* global THREE */

var ControleFase = function () {
    var _self = this;
    var checagem;
    this.carro;
    this.pista;
    this.renderizador;
    this.cena;
    this.controls;
    this.camera;
    this.distancia = 800;
    this.gravidade = 10;
    this.posicaoInicial = {x: 1425, z: -1640};
    this.runCar = false;
    var luzSpot;
    var luzCarregado = false;

    var pista;
    var pistaCarregado = false;

    this.inicia = function (_id) {
        checagem = setInterval(checarCarregamento, 10);
//        _self.carro = new CarroDesktop();
//        _self.carro.fase = _self;
//        _self.carro.carrega('modelos/supernave.obj', 'modelos/supernave.mtl');
        _self.pista = new Pista1();
        _self.pista.fase = _self;
        _self.pista.carrega();
        carregarLuz();
        iniciaLocal(_id);
    };

    function iniciaLocal(_id) {
//        for (var i = 0, size = _self.listaJogadores.length; i < size; i++) {
//            _self.listaJogadores[i].carro.fase = _self;
//            _self.carro.carrega('modelos/' + _self.listaJogadores[i].nave + '.obj', 'modelos/' + _self.listaJogadores[i].nave + '.mtl');
//        }

        for (var prop in _self.listaJogadores) {
            _self.listaJogadores[prop].carro.fase = _self;
            _self.listaJogadores[prop].carro.carrega('modelos/' + _self.listaJogadores[prop].nave + '.obj', 'modelos/' + _self.listaJogadores[prop].nave + '.mtl');
        }
        if (eMobile) {
            _self.carro = new CarroMobile();
        } else {
            _self.carro = new CarroDesktop();
        }
        _self.carro.fase = _self;
        _self.carro.id = _id;
        _self.listaJogadores[_id] = {
            id: _id,
            x: _self.posicaoInicial.x,
            y: 10,
            z: _self.posicaoInicial.z - (_self.listaJogadores.length * 25),
            nave: "supernave"
        };
        ;
        _self.listaJogadores[_id].carro = _self.carro;
        _self.carro.carrega('modelos/supernave.obj', 'modelos/supernave.mtl');
    }

    function checarCarregamento() {
//        for (var i = 0, size = _self.listaJogadores.length; i < size; i++) {
//            if (!_self.listaJogadores[i].carro.carregado) {
//                return;
//            }
//        }
        for (var prop in _self.listaJogadores) {
            if (!_self.listaJogadores[prop].carro.carregado) {
                return;
            }
        }
        if (_self.pista.carregado == true && luzCarregado == true && _self.carro.carregado == true) {
            clearInterval(checagem);
            init();
        }
    }

    function carregarLuz() {
        luzSpot = new THREE.AmbientLight(0xffffff);
        luzCarregado = true;
    }

    function init() {
        _self.cena = new Physijs.Scene();
        _self.cena.setGravity(new THREE.Vector3(0, -500, 0));
        _self.cena.addEventListener("update", updateFisica);
        _self.camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 10000);
        _self.renderizador = new THREE.WebGLRenderer({clearColor: 0xff8844, clearAlpha: 0.0, alpha: true, antialias: true});
        _self.renderizador.setSize(window.innerWidth, window.innerHeight);
        _self.renderizador.shadowMapEnable = true;
        _self.renderizador.shadowMapSoft = true;
        _self.renderizador.shadowMapType = THREE.PCFShadowMap;
        _self.renderizador.gammaInput = true;
        _self.renderizador.gammaOutput = true;
//        _self.renderizador.enableShadow = true;
        document.body.appendChild(_self.renderizador.domElement);
        _self.controls = new THREE.TrackballControls(_self.camera, _self.renderizador.domElement);
//        _self.cena.add(criaPista());
        _self.cena.add(luzSpot);
//        _self.carro.init(_self.posicaoInicial.x, _self.posicaoInicial.z);
//        _self.cena.add(_self.carro.geoFisicaCarro);

        _self.pista.init();
        colocaCarrosNaCena();
        _self.clock = new THREE.Clock();
        render();

        _self.controls.enabled = true;
    }
    
    function startLap(_delta) {
        document.getElementById("contadorLargada").innerHTML = 'YOU READY?';
        var contador = document.getElementById("contadorLargada");
        switch (_delta) {
            case 3:
                contador.innerHTML = "YOU READY?<p>3</p>";
                break;
            case 5:
                contador.innerHTML = "YOU READY?<p>2</p>";
                break;
            case 7:
                contador.innerHTML = "YOU READY?<p>1</p>";
                break;
            case 9:
                contador.style.color = 'green';
                contador.innerHTML = 'YOU READY?<p>GO</p>';
                break;
            case 10:
                document.getElementById('largada').style.display = 'none';
                _self.runCar = true;
                break;
        }

    }
    
    function colocaCarrosNaCena() {

        var i = 0;
        for (var prop in _self.listaJogadores) {
            if (_self.listaJogadores[prop].carro.init) {
                _self.listaJogadores[prop].carro.init(_self.posicaoInicial.x -= 20, _self.posicaoInicial.z);
            } else {
                _self.listaJogadores[prop].carro.initBase(_self.posicaoInicial.x -= 20, _self.posicaoInicial.z);
            }
            _self.cena.add(_self.listaJogadores[prop].carro.geoFisicaCarro);
        }
        var obj = {
            comando: "novo",
            x: _self.carro.geoFisicaCarro.position.x,
            y: _self.carro.geoFisicaCarro.position.y,
            z: _self.carro.geoFisicaCarro.position.z,
            rotacao: _self.carro.geoFisicaCarro.rotation.y,
            nave: "supernave"
        };
        if (_self.carro.id !== 'a') {
            socketSend(obj);
        }

    }

    function updateFisica() {
        for (var prop in _self.listaJogadores) {
            _self.listaJogadores[prop].carro.moveCarro();
        }
        if (_self.carro.id !== 'a') {
            var obj = {
                comando: "novaPosicao",
                id: _self.carro.id,
                x: _self.carro.geoFisicaCarro.position.x,
                y: _self.carro.geoFisicaCarro.position.y,
                z: _self.carro.geoFisicaCarro.position.z,
                rotacao: _self.carro.carro.rotation.y,
                nave: "supernave"
            };
            socketSend(obj);
        }
//        _self.carro.moveCarro();
    }

    function render() {

        var delta = _self.clock.getElapsedTime();
        var largada = parseInt(delta);
        startLap(largada);
        _self.cena.simulate();
        requestAnimationFrame(render);
        if (_self.carro.velocidade == 0) {
            document.getElementById('velocimetro').innerHTML = "kmH :  0";
        }

        for (var prop in _self.listaJogadores) {
            if (_self.runCar === true && !_self.listaJogadores[prop].carro.estaVoando) {
                _self.listaJogadores[prop].carro.movimentoCarro();
            }

        }

        _self.controls.update();
        _self.renderizador.render(_self.cena, _self.camera);
    }

//    function posiCamera() {
//        if (_self.teclado.pressed('h')) {
//        document.getElementById('x').innerHTML = "camera no eixo x:" + _self.camera.position.x;
//        document.getElementById('y').innerHTML = "camera no eixo y:" + _self.camera.position.y;
//        document.getElementById('z').innerHTML = "camera no eixo z:" + _self.camera.position.z;
//        document.getElementById('posX').innerHTML = "carro eixo X:" + _self.carro.geoFisicaCarro.position.x;
//        document.getElementById('posY').innerHTML = "carro eixo Y:" + _self.carro.geoFisicaCarro.position.y;
//        document.getElementById('posZ').innerHTML = "carro eixo Z:" + _self.carro.geoFisicaCarro.position.z;
//        }
//     }
};

ControleFase.prototype = Object.create(Object.prototype, {
    constructor: {
        value: "ControleFase"
    },
    listaJogadores: {
        value: new Array()
    },
    colocaNovoCarroNaCena: {
        value: function (jsonJogador) {
            var __self = controleFase;
            jsonJogador.carro = new CarroSocket();
            jsonJogador.carro.fase = __self;
            jsonJogador.carro.carrega('modelos/' + jsonJogador.nave + '.obj', 'modelos/' + jsonJogador.nave + '.mtl');
            var inter = setInterval(function () {
                if (jsonJogador.carro.carregado) {
                    clearInterval(inter);
                    jsonJogador.carro.initBase(__self.posicaoInicial.x, __self.posicaoInicial.z - (__self.listaJogadores.length * 25));
                    __self.cena.add(jsonJogador.carro.geoFisicaCarro);
                }
            }, 10);
        }
    },
    novaPosicao: {
        value: function (dadosJogador) {
            var _c = ControleFase.prototype.listaJogadores[dadosJogador.id].carro;
            if (_c.carregado) {
                _c.x = dadosJogador.x;
                _c.y = dadosJogador.y;
                _c.z = dadosJogador.z;
                _c.rotacao = dadosJogador.rotacao;
            }
        }
    }
});
