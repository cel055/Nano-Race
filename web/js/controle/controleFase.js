/* global THREE */

var ControleFase = function () {
    var _self = this;
    this.somFundo;
    this.escutadorSomDeFundo;
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

    this.escolhaPista = 1;
    var pista;
    var pistaCarregado = false;

    this.inicia = function (_id) {
        checagem = setInterval(checarCarregamento, 10);
//        _self.carro = new CarroDesktop();
//        _self.carro.fase = _self;
//        _self.carro.carrega('modelos/supernave.obj', 'modelos/supernave.mtl');
        if (_self.escolhaPista == 1) {
            _self.pista = new Pista1();
        } else {
            _self.pista = new Pista2();
        }
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

        _self.escutadorSomDeFundo = new THREE.AudioListener();
        _self.camera.add(_self.escutadorSomDeFundo);
        _self.somFundo = new THREE.Audio(_self.escutadorSomDeFundo);
        _self.somFundo.load('sound-music/sound-track.mp3');
        _self.camera.add(_self.somFundo);

        _self.somFundo.setRefDistance(100);
        _self.somFundo.autoplay = true;
        _self.somFundo.setLoop(true);
        _self.somFundo.setVolume(100);
        
        _self.pista.init();
        colocaCarrosNaCena();
        var inter = setInterval(function () {
            for (var prop in _self.listaJogadores) {
                if (!_self.listaJogadores[prop].carro.fisicaCarregada) {
                    return;
                }
            }
            if (!_self.pista.todasFisicaCarregada) {
                return;
            }
            clearInterval(inter);

//            _self.somFundo.play();
            _self.clock = new THREE.Clock();
            render();
            _self.controls.enabled = true;
        }, 50);
    }

    function startLap(_delta) {
        document.getElementById("contadorLargada").innerHTML = 'YOU READY?';
//        _self.carro.somFundo.play();
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
                for (var prop in _self.listaJogadores) {
                    _self.listaJogadores[prop].carro.sound2.play();
                }
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
        if (socket) {
            socketSend(obj);
        }

    }

    function updateFisica() {
        for (var prop in _self.listaJogadores) {
            _self.listaJogadores[prop].carro.moveCarro();
        }
        if (socket) {
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
        var contCarros = 0;
        for (var prop in _self.listaJogadores) {
            if (_self.runCar === true && !_self.listaJogadores[prop].carro.estaVoando) {
                _self.listaJogadores[prop].carro.movimentoCarro();
            }
            contCarros++;

        }
        if (_self.pista.chegada.length >= contCarros) {
            telaFimDeJogo();
            return;
        }
        _self.cena.simulate();
        requestAnimationFrame(render);
        if (_self.carro.velocidade == 0) {
            document.getElementById('velocimetro').innerHTML = "kmH :  0";
        }


        _self.controls.update();
        _self.renderizador.render(_self.cena, _self.camera);
    }

    function telaFimDeJogo() {
        if (!localStorage.ganhou) {
            localStorage.setItem("ganhou", 0);
        }
        if (_self.carro == _self.pista.chegada[0]) {
            localStorage.ganhou = Number(localStorage.ganhou) + 1;
        }
        if (!localStorage.corridas) {
            localStorage.setItem("corridas", 1);
        } else {
            localStorage.corridas = Number(localStorage.corridas) + 1;
        }
        var div = document.createElement("div");
        div.className = "detalhes";
        div.style.position = "fixed";
        div.style.height = "500px";
        div.style.width = "500px";
        div.style.top = (window.innerHeight / 2 - 250) + "px";
        div.style.left = (window.innerWidth / 2 - 250) + "px";
        var posicao;
        for (var i = 1; i <= _self.pista.chegada.length; i++) {
            if (_self.carro == _self.pista.chegada[i]) {
                posicao = i + 1;
                break;
            }
        }
        var p = document.createElement("p");
        p.innerHTML = "Position: " + posicao + "<br/>";
        div.appendChild(p);

        p = document.createElement("p");
        p.innerHTML = "Victory: " + localStorage.ganhou + "<br/>";
        div.appendChild(p);

        p = document.createElement("p");
        p.innerHTML = "Races: " + localStorage.corridas + "<br/>";
        div.appendChild(p);

        var botaoReiniciar = document.createElement("div");
        botaoReiniciar.className = "detalhes";
        p = document.createElement("p");
        p.innerHTML = "Ok";
        botaoReiniciar.appendChild(p);
        botaoReiniciar.addEventListener("click", function () {
            document.location.reload();
        });
        div.appendChild(botaoReiniciar);
        document.body.appendChild(div);
    }
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
