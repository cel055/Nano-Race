window.addEventListener("load", carregar);

function carregar() {
    Physijs.scripts.workers = "physijs_worker.js";
    Physijs.scripts.ammo = "ammo.js";
    //instanciando variaveis do jogo
    var carro;
    var geoCubo;
    var paredeD;
    var paredeL;
    var checagem;
    var geoCubo;
    var materialParede;
    var parede;
    var texturaParede;
    var texturaChao;
    var materialChao;
    var materialFisicaCarro;
    var materialFisicaChao;
    var geoFisicaCarregado;
    var luzSpot;
    var renderizador;
    var camera;
    var cena;
    

    //instanciando variaveis de carregamento
    var carroLoader = false;
    var carroCarregado = false;
    var objetoCarregado = false;
    var luzCarregado = false;
    var materialCarregado = false;
    var meshCarregado = false;
    //variaveis de controle
    var velocidade = 0;
    var rotacao = 0;
    var distancia = 800;

    //instanciando as funções
    carregarObjeto();
    carregarMaterial();
    carregarMesh();
    carregarLuz();
    carregarFisicaMesh();

    //carregando o objeto
    function carregarObjeto() {
        //criando geometria basica
        geoCubo = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);

        carroLoader = new THREE.OBJMTLLoader();
        //carro.load(url, mtlurl, onLoad, onProgress, onError)
        carroLoader.load('modelos/volks.obj', 'modelos/volks.mtl',
                function (object) {
                    carro = object;
                    carroCarregado = true;
                    carro.traverse(function (child) {
                        if (child instanceof THREE.Mesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                        }
                    });
                });
        objetoCarregado = true;
    }

    //função de carregando o material
    function carregarMaterial() {
        /*-- material das paredes --*/
        texturaParede = new THREE.ImageUtils.loadTexture("imagens/parede.png");
        materialParede = new THREE.MeshPhongMaterial({
            map: parede,
            shading: 0.5,
            side: THREE.DoubleSide,
            transparent: true,
            depthWrite: true
        });
        //materialParede.map.repeat.set(0,1,5);
        /*------------------------*/
        /*-- Material do chao --*/
        texturaChao = new THREE.ImageUtils.loadTexture("imagens/chao.png");
        materialChao = new THREE.MeshPhongMaterial({
            map: texturaChao,
            overdraw: 0.5,
            normalScale: THREE.FlatShading,
            side: THREE.DoubleSide,
            opacity: 1,
            transparent: true,
        });
        //materialChao.map.repeat.set(1,20,20);
        /*-----------------------*/
        /*-- Material de física do carro --*/
        materialFisicaCarro = new Physijs.createMaterial(new THREE.MeshPhongMaterial({
            //ambient: 0xffffff,
            shading: THREE.FlatShading,
            opacity: 0,
            transparent: true,
            depthWrite: true,
            skinning: true


        }), 0, 0.10);
        /*----------------------*/
        /*-- materia disca do chao --*/
        /*materialFisicaChao = new Physijs.createMaterial(new THREE.MeshPhongMaterial( {
         ambient: 0x333333,
         shading: THREE.SmoothShading, 
         opacity: 0.0,
         transparent: true
         })0,0.1);*/
        /*---------------------*/

        materialCarregado = true;
    }
    //carregando os meshs
    function carregarMesh() {
        chaoMesh = new THREE.Mesh(geoCubo, materialChao);
        chaoMesh.receiveShadow = true;

        //paredeDireita	 = new THREE.Mesh(geoCubo, materialchao);
        //paredeEsquerda	 = new THREE.Mesh(geoCubo, materialchao);

        meshCarregado = true;
    }
    //criando a luz do jogo
    function carregarLuz() {
        luzSpot = new THREE.HemisphereLight(0xf3e2a9, 0x2222ef, 1);
        luzSpot.castShadow = true;
        luzSpot.shadowMapWidth = 1024;
        luzSpot.shadowMapHeight = 1024;
        luzSpot.shadowCameraNear = 1;
        luzSpot.shadowCameraFar = 800;
        luzSpot.shadowCameraFov = 100;
        luzSpot.shadowDarkness = 0.5;
        //luzSpot.ShadowBias			= 0;
        luzSpot.shadoCameraRight = distancia;
        luzSpot.shadoCameraleft = distancia;
        luzSpot.shadowCameraTop = distancia
        luzSpot.
                luzCarregado = true;
    }
    checagem = setInterval(checarCarregamento, 10);
    function checarCarregamento() {
        if (objetoCarregado == true && luzCarregado == true && materialCarregado == true && carroCarregado == true && meshCarregado == true && geoFisicaCarregado == true) {
            clearInterval(checagem);
            init();
        }
    }
    //adicionando fisica nos mesh
    function carregarFisicaMesh() {
        // THREE.BoxGeometry(geometry, material, massa)
        if (carroCarregado == true) {

            carro.position.set(0, 0, 0.5);
            geoFisicaCarro = new Physijs.BoxMesh(new THREE.BoxGeometry(2, 2, 6), materialFisicaCarro, 500);
            geoFisicaCarro.visible = true;
            geoFisicaCarro.name = "carro";
            geoFisicaCarro.position.set(0, 12.5, -450);
            geoFisicaCarro.add(camera);
            carro.rotation.set(0, -180 * Math.PI / 180, 0);
            geoFisicaCarro.add(carro);
        }
        //posicionando a camera no carro
        camera.position.set(0, 3, 7.2);

        //adicionando fisica ao chao
        geoFisicaChao = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 10000), materialFisicaChao, 0);
        geoFisicaChao.visible = true;
        geoFisicaChao.name = "chao";
        geoFisicaChao.position.set(0, 0, 0);
        geoFisicaChao.receiveShadow = true;
        chaoMesh.scale.set(300, 1, 10000);
        geoFisicaChao.add(chaoMesh);

        geoFisicaCarregado = true;

    }
    //adicionnando as colisoes 
    function colisoesAtivas() {
        geoFisicaCarro.addEventListener("collision", function () {
            if (other_object == geoFisicaChao) {
                //console.log('colidiu!!!');
            }
        });
    }
    //controlando o carro
    function controles() {
        //botão do acelerador
        if (teclado.pressed("shift")) {
            if (velocidade >= 0 && velocidade <= 1000) {
                velocidade += 1;

            }
        }
    }
    function init() {
        cena = new Physijs.Scene();
        cena.setGravity(new THREE.Vector3(0, 100, 0));
        cena.addEventListener("update", function () {
            cena.simulate(undefined, 1);
        });
        camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)

        renderizador.render(cena, camera);
        renderizador.setSize(window.innerWidth, window.innerHeight);
        renderizador.shadowMapEnable = true;
        renderizador.shadowMapSoft = true;
        renderizador.shadoMapType = THREE.PCFShadowMap;
        renderizador.gamaInput = true;
        renderizador.gamaOutput = true;
        renderizador.enableShadow = true;
        document.body.appendChild(renderizador.domElement);

        controls = new TrackballControls(camera, renderizador.domElement);
        teclado = new THREEx.KeyboardState();
        colisoesAtivas();

        cena.add(geoFisicaCarro);
        cena.add(luzSpot);

    }
    function render() {
        requestAnimationFrame(render);
        cena.simulate(undefined, 1);
        controles();
        controls.update;
        renderizador.render(cena, camera);

        //adicionando objetos a cenas
    }
    render();
    
}