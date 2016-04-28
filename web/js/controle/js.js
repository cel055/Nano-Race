Physijs.scripts.worker = "js/libs/physijs_worker.js";
Physijs.scripts.ammo = "ammo.js";
//instanciando as variaveis
var pista;
var pistaLoader;
var paredeD;
var paredeL;
var checagem;
var geoCubo;
var carro;
var renderizador;
var materiaParedeLateral;
var materialChao;
var cena;
var camera;

//variavel de controle para declarar quando esta carregado o objeto
var carroLoader = false;
var objetoCarregado = false;
var geoFisicaCarro;
var luzCarregado = false;
var materialCarregado = false;
var meshCarregado = false;
var velocidade = 0;
var rotacao = 0;
//controla a distancia;
var distancia = 800;
var gravidade = 0;
window.addEventListener("load", inicia);

function inicia() {
    //carregaObjeto();
    carregarLuz();
    carro = new Carro();
    carro.fase = window;
    carro.carrega();
    pista = new Pista();
    pista.fase = window;
    pista.carrega();
    checagem = setInterval(checarCarregamento, 10);
}

function carregarLuz() {
    luzSpot = new THREE.HemisphereLight(0xf3e2a9, 0x2222ef, 1);

    luzSpot.castShadow = true;
    luzSpot.shadowMapWidth = 1024;
    luzSpot.shadowMapheight = 1024;
    luzSpot.shadowCameraNear = 1;
    luzSpot.shadowCameraFar = 800;
    luzSpot.shadowCameraFov = 100;
    luzSpot.shadowDarkness = 0.5;
    luzSpot.shadowBias = 0;
    luzSpot.shadowCameraRight = distancia;
    luzSpot.shadowCameraLeft = distancia;
    luzSpot.shadowCameraTop = distancia;
    luzSpot.shadowCameraBottoms = distancia;
    luzCarregado = true;
}

function particulas() {
    var particula = new THREE.ParticleSystem(geometry, material)
}

function checarCarregamento() {
    if ( luzCarregado == true && carro.carregado == true && pista.carregado == true) {
        clearInterval(checagem);
        init();

    }
}

function init() {
    cena = new Physijs.Scene();
    cena.setGravity(new THREE.Vector3(0, -100, 0));
    cena.addEventListener("update", function () {
        cena.simulate(undefined, 1);
    });
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderizador = new THREE.WebGLRenderer({clearColor: 0xff8844, clearAlpha: 0.0, alpha: true, antialias: true});
    renderizador.setSize(window.innerWidth, window.innerHeight);
    renderizador.shadowMapEnable = true;
    renderizador.shadowMapSoft = true;
    renderizador.shadowMapType = THREE.PCFShadowMap;
    renderizador.gammaInput = true;
    renderizador.gammaOutput = true;
    renderizador.enableShadow = true;
    document.body.appendChild(renderizador.domElement);

    controls = new THREE.TrackballControls(camera, renderizador.domElement);
    chaoMeshPhisica = new Physijs.createMaterial(new THREE.MeshPhongMaterial({
        ambient: 0x333333,
        shading: THREE.SmoothShading,
        opacity: 0,
        transparent: true,
        anisotropy: 5
    }));
    /*solo = new Physijs.BoxMesh(new THREE.BoxGeometry(10000, 5, 10000), chaoMeshPhisica, 0);
    solo.visible = true;
    solo.name = "chao";
    solo.position.set(0, 0, 0);
    solo.receiveShadow = true;
    pista.scale.x = 300;
    pista.scale.z = 300;
    solo.add(pista); */
    /*---------------------------*/
    //rotacionando o carro
//    carro.rotation.set(0, -180 * Math.PI / 180, 0)

    cena.add(luzSpot);

    //cena.add(solo);
    carro.init();
    pista.init();
    render();
}

function posiCamera() {
    document.getElementById('x').innerHTML = "camera no eixo x:" + camera.position.x;
    document.getElementById('y').innerHTML = "camera no eixo y:" + camera.position.y;
    document.getElementById('z').innerHTML = "camera no eixo z:" + camera.position.z;
    document.getElementById('posX').innerHTML = "carro eixo X:" + carro.geoFisicaCarro.position.x;
    document.getElementById('posZ').innerHTML = "carro eixo Z:" + carro.geoFisicaCarro.position.z;
}

function render() {
    requestAnimationFrame(render);
    if (carro.velocidade == 0) {
        document.getElementById('marcador').innerHTML = "kmH :  0";
    }
    cena.simulate(undefined, 1);
    carro.movimentoCarro();
    posiCamera()
    controls.update();
    renderizador.render(cena, camera);
}