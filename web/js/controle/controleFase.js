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

    var luzSpot;
    var luzCarregado = false;

    var pista;
    var pistaCarregado = false;

    this.inicia = function () {
        checagem = setInterval(checarCarregamento, 10);
        _self.carro = new CarroDesktop();
        _self.carro.fase = _self;
        _self.carro.carrega('modelos/supernave.obj', 'modelos/supernave.mtl');
        _self.pista = new Pista();
        _self.pista.fase = _self;
        _self.pista.carrega();
        carregarLuz();
    };

    function checarCarregamento() {
        if (_self.pista.carregado == true && _self.pista.carregadoN == true && _self.pista.carregadoL == true && _self.pista.carregadoC == true && luzCarregado == true && _self.carro.carregado == true && _self.pista.carregadoJ) {
            clearInterval(checagem);
            init();
        }
    }

    function carregarLuz() {
        luzSpot = new THREE.AmbientLight(0x404040);
//        luzSpot.castShadow = true;
//        luzSpot.shadowMapWidth = 1024;
//        luzSpot.shadowMapheight = 1024;
//        luzSpot.shadowCameraNear = 1;
//        luzSpot.shadowCameraFar = 800;
//        luzSpot.shadowCameraFov = 100;
//        luzSpot.shadowDarkness = 0.5;
//        luzSpot.shadowBias = 0;
//        luzSpot.shadowCameraRight = _self.distancia;
//        luzSpot.shadowCameraLeft = _self.distancia;
//        luzSpot.shadowCameraTop = _self.distancia;
//        luzSpot.shadowCameraBottoms = _self.distancia;
        luzCarregado = true;
    }

    function init() {
        _self.cena = new Physijs.Scene();
        _self.cena.setGravity(new THREE.Vector3(0, -200, 0));
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
        _self.carro.init();
        _self.pista.init();
        render();
    }

    function updateFisica() {
//        _self.carro.moveCarro();
    }

    function render() {
        _self.cena.simulate(undefined, 1);
        requestAnimationFrame(render);
        if (_self.carro.velocidade == 0) {
            document.getElementById('marcador').innerHTML = "kmH :  0";
        }
        _self.carro.movimentoCarro();
//        _self.carro.movimentoCarro();
//        _self.carro.moveCarro();
         posiCamera();
        _self.controls.update();
        _self.renderizador.render(_self.cena, _self.camera);
    }

    function posiCamera() {
//        if (_self.teclado.pressed('h')) {
        document.getElementById('x').innerHTML = "camera no eixo x:" + _self.camera.position.x;
        document.getElementById('y').innerHTML = "camera no eixo y:" + _self.camera.position.y;
        document.getElementById('z').innerHTML = "camera no eixo z:" + _self.camera.position.z;
        document.getElementById('posX').innerHTML = "carro eixo X:" + _self.carro.geoFisicaCarro.position.x;
        document.getElementById('posY').innerHTML = "carro eixo Y:" + _self.carro.geoFisicaCarro.position.y;
        document.getElementById('posZ').innerHTML = "carro eixo Z:" + _self.carro.geoFisicaCarro.position.z;
//        }
     }
};