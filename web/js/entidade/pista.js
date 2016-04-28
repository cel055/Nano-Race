/* global THREE */

var Pista = function () {
    var _self = this;
    this.pista;
    this.pistaN;
    this.fase;
    this.init;
    this.solo;
    this.pistaComum;
    this.carregado = false;
    this.pistaInicioL;

    this.carrega = function () {
        var loader = new THREE.OBJMTLLoader();
        loader.load("modelos/pista.obj", "modelos/pista.mtl",
                function (object) {
                    _self.pista = object;
                    _self.pista.traverse(function (child) {
                        //child.castShadow = true;
                        child.receiveShadow = true;
                    });
                    _self.carregado = true;
                });
        //criando o gerador da pista
        var pistaN = new THREE.OBJMTLLoader();
        pistaN.load("modelos/pistacomum.obj", "modelos/pistacomum.mtl",
                function (object) {
                    _self.pistaComum = object;
                    _self.pistaComum.traverse(function (child) {
                        //child.castShadow = true;
                        child.receiveShadow = true;
                    });
                    _self.carregadoN = true;
                });
        var pistaL = new THREE.OBJMTLLoader();
        pistaL.load("modelos/largada.obj", "modelos/largada.mtl",
                function (object) {
                    _self.pistaLargada = object;
                    _self.pistaLargada.traverse(function (child) {
                        //child.castShadow = true;
                        child.receiveShadow = true;
                    });
                    _self.carregadoL = true;
                });
        var pistaC = new THREE.OBJMTLLoader();
        pistaC.load("modelos/curva.obj", "modelos/curva.mtl",
                function (object) {
                    _self.pistaCurvaN = object;
                    _self.pistaCurvaN.traverse(function (child) {
                        child.receiveShadow = true;
                    });
                    _self.carregadoC = true;
                });
        var pistaS = new THREE.OBJMTLLoader();
        pistaS.load("modelos/jumparea.obj", "modelos/jumparea.mtl",
                function (object) {
                    _self.pistaJump = object;
                    _self.pistaJump.traverse(function (child) {
                        child.receiveShadow = true;
                    });
                    _self.carregadoJ = true;
                });


    };
    this.init = function () {
        var chaoMeshPhisica = new Physijs.createMaterial(new THREE.MeshPhongMaterial({
            ambient: 0x333333,
            shading: THREE.SmoothShading,
            opacity: 0.5,
            transparent: true,
            visible: false,
            anisotropy: 5
        }));
        var chaoMeshPhisica2 = new Physijs.createMaterial(new THREE.MeshPhongMaterial({
            ambient: 0x333333,
            shading: THREE.SmoothShading,
            opacity: 0.5,
            transparent: true,
            visible: false,
            anisotropy: 5
        }));
        var chaoMeshPhisica3 = new Physijs.createMaterial(new THREE.MeshPhongMaterial({
            ambient: 0x000FFF,
            shading: THREE.SmoothShading,
            opacity: 0.5,
            transparent: true,
            visible: false,
            anisotropy: 5
        }));
        var chaoMeshPhisica4 = new Physijs.createMaterial(new THREE.MeshPhongMaterial({
            ambient: 0x000FFF,
            shading: THREE.SmoothShading,
            opacity: 1,
            transparent: true,
            visible: true,
            anisotropy: 5
        }));

        for (var i = 0; i < 100; i++) {
            var pistaPosicaoX = 1325;
            var pistaPosicaoZ = -1640;
            var pistaMeio = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica.clone(), 0);

            var pistaCurva = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica3.clone(), 0);
            if (i > 0 && i < 20) {
                var paredeDireita = new Physijs.BoxMesh(new THREE.BoxGeometry(10, 50, 300), chaoMeshPhisica4.clone(), 0);
                paredeDireita.position.x = 145;
                if(i === 0){
                paredeDireita.position.z = pistaMeio.position.z;    
                paredeDireita.position.x = pistaMeio.position.x;    
                paredeDireita.position.y = pistaMeio.position.y;    
                }
                paredeDireita.scale.z = 1 * 4;
                var paredeEsqueda = new Physijs.BoxMesh(new THREE.BoxGeometry(10, 50, 300), chaoMeshPhisica4.clone(), 0);
                paredeEsqueda.position.x = -145;
                 if(i === 0){
                paredeEsqueda.position.z = pistaMeio.position.z;    
                paredeEsqueda.position.x = pistaMeio.position.x;    
                paredeEsqueda.position.y = pistaMeio.position.y;    
                }
                paredeEsqueda.scale.z = 1 * 4;
                pistaMeio.visible = true;
                pistaMeio.name = "pistaMeio";
                pistaMeio.position.x = pistaPosicaoX;
                pistaMeio.position.z = pistaPosicaoZ + 300 * i;
                pistaMeio.position.y = 0;
                
                _self.pistaComum.scale.x = 150;
                _self.pistaComum.scale.z = 150;
                pistaMeio.add(_self.pistaComum.clone());
                pistaMeio.add(paredeDireita);
                pistaMeio.add(paredeEsqueda);
                /*var pistasMeios = [];
                 pistasMeios.push(pistaMeio);
                 */
                _self.fase.cena.add(pistaMeio);
            }
            switch (i) {
                case 0:
                    var pistaStart = pistaMeio;
                    pistaStart.scale.z = 1.1;
                    pistaStart.visible = true;
                    pistaStart.name = "pistaMeio";
                    pistaStart.position.x = pistaPosicaoX;
                    pistaStart.position.z = pistaPosicaoZ - 15;
                    pistaStart.position.y = 0;
                    _self.pistaLargada.position.z = -9;
                    _self.pistaLargada.scale.x = 150;
                    _self.pistaLargada.scale.z = 175;
                    pistaStart.add(_self.pistaLargada);
                    /*var pistasMeios = [];
                     pistasMeios.push(pistaMeio);
                     */
                    _self.fase.cena.add(pistaMeio);
                    break;
                case 20:
                    var pistaCurve = pistaCurva;
                    //_self.localDaCurva = pistaMeio.position.z;
                    pistaCurve.visible = true;
                    pistaCurve.name = "pistaMeio";
                    pistaCurve.position.x = pistaPosicaoX;
                    pistaCurve.position.z = (pistaPosicaoZ + 300 * i) - 1;
                    //pistaCurve.position.y = 0;
                    pistaCurve.rotation.y = -180 * Math.PI / 180;
                    //_self.pistaCurvaN.position.z = 48;
                    _self.pistaCurvaN.scale.x = 150;
                    _self.pistaCurvaN.scale.z = 150;
                    pistaCurva.add(_self.pistaCurvaN);
                    _self.fase.cena.add(pistaCurve);
                    var curvaParteD = new Physijs.BoxMesh(new THREE.BoxGeometry(450, 1, 350), chaoMeshPhisica3.clone(), 0);
                    curvaParteD.position.x = pistaCurve.position.x + 78;
                    curvaParteD.position.z = pistaCurve.position.z + 140;
                    _self.fase.cena.add(curvaParteD);
                    break;
                case 21:

                    for (var j = 0; j < 10; j++) {
                        var pistaMeioV = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica2.clone(), 0);
                        pistaMeioV.visible = true;
                        pistaMeioV.name = "pistaLateral";
                        // pistaMeioV.position.x = pistaCurve.position.x + 350;
                        pistaMeioV.position.z = pistaCurve.position.z + 150;
                        pistaMeioV.rotation.y = 90 * Math.PI / 180;
                        //variavel que pega o inicio da curva e e posiciona o novo elemento
                        _self.pistaInicioL = pistaCurve.position.x + 445;
                        pistaMeioV.position.x = _self.pistaInicioL + 300 * j;
                        pistaMeioV.add(_self.pistaComum.clone());
                        _self.fase.cena.add(pistaMeioV);
                    }
                    break;
                case 22:
                    var curvaDois = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica3.clone(), 0);
                    curvaDois.visible = true;
                    curvaDois.name = "curvaD";
                    curvaDois.position.z = pistaMeioV.position.z;
                    curvaDois.rotation.y = -90 * Math.PI / 180;
                    curvaDois.position.x = pistaMeioV.position.x + 299;
                    curvaDois.add(_self.pistaCurvaN.clone());
                    var curvaParteD = new Physijs.BoxMesh(new THREE.BoxGeometry(350, 1, 450), chaoMeshPhisica3.clone(), 0);
                    curvaParteD.position.x = curvaDois.position.x + 140;
                    curvaParteD.position.z = curvaDois.position.z - 80;
                    _self.fase.cena.add(curvaDois);
                    _self.fase.cena.add(curvaParteD);
                    break;
                case 23:

                    for (var j = 0; j < 3; j++) {
                        var pistaMeioV = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica2.clone(), 0);
                        pistaMeioV.visible = true;
                        pistaMeioV.name = "pistaLateral";
                        // pistaMeioV.position.x = pistaCurve.position.x + 350;
                        pistaMeioV.position.z = (curvaDois.position.z - 300 * j) - 449;

                        //variavel que pega o inicio da curva e e posiciona o novo elemento
                        _self.pistaInicioL = curvaDois.position.x + 150;
                        pistaMeioV.position.x = _self.pistaInicioL;
                        pistaMeioV.add(_self.pistaComum.clone());
                        _self.fase.cena.add(pistaMeioV);
                    }
                    break;
                case 24:
                    var curvaDois = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica3.clone(), 0);
                    curvaDois.visible = true;
                    curvaDois.name = "curvaD";
                    curvaDois.position.z = pistaMeioV.position.z - 299;
                    //curvaDois.rotation.y = -90 * Math.PI / 180;
                    curvaDois.position.x = pistaMeioV.position.x;
                    curvaDois.add(_self.pistaCurvaN.clone());
                    var curvaParteD = new Physijs.BoxMesh(new THREE.BoxGeometry(450, 1, 350), chaoMeshPhisica3.clone(), 0);
                    curvaParteD.position.x = curvaDois.position.x - 80;
                    curvaParteD.position.z = curvaDois.position.z - 140;
                    _self.fase.cena.add(curvaDois);
                    _self.fase.cena.add(curvaParteD);
                    break;
                case 25:

                    for (var j = 0; j < 2; j++) {
                        var pistaMeioV = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica2.clone(), 0);
                        pistaMeioV.visible = true;
                        pistaMeioV.name = "pistaLateral";
                        // pistaMeioV.position.x = pistaCurve.position.x + 350;
                        pistaMeioV.position.z = curvaDois.position.z - 150;
                        pistaMeioV.rotation.y = 90 * Math.PI / 180;
                        //variavel que pega o inicio da curva e e posiciona o novo elemento
                        _self.pistaInicioL = curvaDois.position.x - 445;
                        pistaMeioV.position.x = _self.pistaInicioL - 300 * j;
                        pistaMeioV.add(_self.pistaComum.clone());
                        _self.fase.cena.add(pistaMeioV);
                    }
                    break;
                case 26:
                    var pistaSalto = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica.clone(), 0);
                    pistaSalto.visible = true;
                    pistaSalto.name = "pistaSalto";
                    _self.pistaJump.scale.x = 150;
                    _self.pistaJump.scale.z = 150;
                    pistaSalto.add(_self.pistaJump);
                    pistaSalto.rotation.z = -10 * Math.PI / 180;
                    _self.pistaJump.rotation.y = 90 * Math.PI / 180;
                    pistaSalto.position.x = pistaMeioV.position.x - 295;
                    pistaSalto.position.z = pistaMeioV.position.z;
                    pistaSalto.position.y = pistaMeioV.position.y + 26;
                    _self.fase.cena.add(pistaSalto);
                    break;
                case 27:
                    for (var j = 0; j < 3; j++) {
                        var pistaMeioV = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica2.clone(), 0);
                        pistaMeioV.visible = true;
                        pistaMeioV.name = "pistaLateral";
                        pistaMeioV.position.x = pistaSalto.position.x + 20;
                        pistaMeioV.position.z = pistaSalto.position.z;
                        pistaMeioV.rotation.y = 90 * Math.PI / 180;
                        //variavel que pega o inicio da curva e e posiciona o novo elemento
                        _self.pistaInicioL = pistaSalto.position.x - 900;
                        pistaMeioV.position.x = _self.pistaInicioL - 300 * j;
                        pistaMeioV.add(_self.pistaComum.clone());
                        _self.fase.cena.add(pistaMeioV);
                    }
                    break;
                case 28:
                    var curvaDois = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica3.clone(), 0);
                    curvaDois.visible = true;
                    curvaDois.name = "curvaD";
                    curvaDois.position.z = pistaMeioV.position.z - 150;
                    curvaDois.rotation.y = -180 * Math.PI / 180;
                    curvaDois.position.x = pistaMeioV.position.x - 449;
                    curvaDois.add(_self.pistaCurvaN.clone());
                    var curvaParteD = new Physijs.BoxMesh(new THREE.BoxGeometry(450, 1, 350), chaoMeshPhisica3.clone(), 0);
                    _self.pistaCurvaN.scale.x = 150;
                    _self.pistaCurvaN.scale.z = 150;
                    curvaParteD.position.x = curvaDois.position.x + 80;
                    curvaParteD.position.z = curvaDois.position.z + 140;
                    _self.fase.cena.add(curvaDois);
                    _self.fase.cena.add(curvaParteD);
                    break;
                case 29:

                    for (var j = 0; j < 15; j++) {
                        var pistaMeioV = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica2.clone(), 0);
                        pistaMeioV.visible = true;
                        pistaMeioV.name = "pistaLateral";
                        // pistaMeioV.position.x = pistaCurve.position.x + 350;
                        pistaMeioV.position.z = (curvaDois.position.z - 300 * j) - 300;

                        //variavel que pega o inicio da curva e e posiciona o novo elemento
                        _self.pistaInicioL = curvaDois.position.x;
                        pistaMeioV.position.x = _self.pistaInicioL;
                        pistaMeioV.add(_self.pistaComum.clone());
                        _self.fase.cena.add(pistaMeioV);
                    }
                    break;
                case 30:
                    var curvaDois = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica3.clone(), 0);
                    curvaDois.visible = true;
                    curvaDois.name = "curvaD";
                    curvaDois.position.z = pistaMeioV.position.z - 449;
                    curvaDois.rotation.y = 90 * Math.PI / 180;
                    curvaDois.position.x = pistaMeioV.position.x + 150;
                    curvaDois.add(_self.pistaCurvaN.clone());
                    var curvaParteD = new Physijs.BoxMesh(new THREE.BoxGeometry(350, 1, 450), chaoMeshPhisica3.clone(), 0);
                    _self.pistaCurvaN.scale.x = 150;
                    _self.pistaCurvaN.scale.z = 150;
                    curvaParteD.position.x = curvaDois.position.x - 140;
                    curvaParteD.position.z = curvaDois.position.z + 80;
                    _self.fase.cena.add(curvaDois);
                    _self.fase.cena.add(curvaParteD);
                    break;
                case 31:

                    for (var j = 0; j < 1; j++) {
                        var pistaMeioV = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica2.clone(), 0);
                        pistaMeioV.visible = true;
                        pistaMeioV.name = "pistaLateral";
                        // pistaMeioV.position.x = pistaCurve.position.x + 350;
                        pistaMeioV.position.z = curvaDois.position.z;
                        pistaMeioV.rotation.y = 90 * Math.PI / 180;
                        //variavel que pega o inicio da curva e e posiciona o novo elemento
                        _self.pistaInicioL = curvaDois.position.x + 300;
                        pistaMeioV.position.x = _self.pistaInicioL + 300 * j;
                        pistaMeioV.add(_self.pistaComum.clone());
                        _self.fase.cena.add(pistaMeioV);
                    }
                    break;
                case 32:
                    var curvaDois = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica3.clone(), 0);
                    curvaDois.visible = true;
                    curvaDois.name = "curvaD";
                    curvaDois.position.z = pistaMeioV.position.z + 150;
                    //curvaDois.rotation.y = -90 * Math.PI / 180;
                    curvaDois.position.x = pistaMeioV.position.x + 450;
                    curvaDois.add(_self.pistaCurvaN.clone());
                    var curvaParteD = new Physijs.BoxMesh(new THREE.BoxGeometry(450, 1, 350), chaoMeshPhisica3.clone(), 0);
                    curvaParteD.position.x = curvaDois.position.x - 80;
                    curvaParteD.position.z = curvaDois.position.z - 140;
                    _self.fase.cena.add(curvaDois);
                    _self.fase.cena.add(curvaParteD);
                    break;
                case 33:
                    for (var j = 0; j < 10; j++) {
                        var pistaMeioV = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica2.clone(), 0);
                        pistaMeioV.visible = true;
                        pistaMeioV.name = "pistaLateral";
                        // pistaMeioV.position.x = pistaCurve.position.x + 350;
                        pistaMeioV.position.z = (curvaDois.position.z + 300 * j) + 300;

                        //variavel que pega o inicio da curva e e posiciona o novo elemento
                        _self.pistaInicioL = curvaDois.position.x;
                        pistaMeioV.position.x = _self.pistaInicioL;
                        pistaMeioV.add(_self.pistaComum.clone());
                        _self.fase.cena.add(pistaMeioV);
                    }
                    break;
                case 34:
                    var curvaDois = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica3.clone(), 0);
                    curvaDois.visible = true;
                    curvaDois.name = "curvaD";
                    curvaDois.position.z = pistaMeioV.position.z + 300;
                    curvaDois.rotation.y = -180 * Math.PI / 180;
                    curvaDois.position.x = pistaMeioV.position.x;
                    curvaDois.add(_self.pistaCurvaN.clone());
                    var curvaParteD = new Physijs.BoxMesh(new THREE.BoxGeometry(450, 1, 350), chaoMeshPhisica3.clone(), 0);
                    _self.pistaCurvaN.scale.x = 150;
                    _self.pistaCurvaN.scale.z = 150;
                    curvaParteD.position.x = curvaDois.position.x + 80;
                    curvaParteD.position.z = curvaDois.position.z + 140;
                    _self.fase.cena.add(curvaDois);
                    _self.fase.cena.add(curvaParteD);
                    break;
                case 35:
                    for (var j = 0; j < 4; j++) {
                        var pistaMeioV = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica2.clone(), 0);
                        pistaMeioV.visible = true;
                        pistaMeioV.name = "pistaLateral";
                        // pistaMeioV.position.x = pistaCurve.position.x + 350;
                        pistaMeioV.position.z = curvaDois.position.z + 150;
                        pistaMeioV.rotation.y = 90 * Math.PI / 180;
                        //variavel que pega o inicio da curva e e posiciona o novo elemento
                        _self.pistaInicioL = curvaDois.position.x + 445;
                        pistaMeioV.position.x = _self.pistaInicioL + 300 * j;
                        pistaMeioV.add(_self.pistaComum.clone());
                        _self.fase.cena.add(pistaMeioV);
                    }
                    break;
                case 36:
                    var curvaDois = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica3.clone(), 0);
                    curvaDois.visible = true;
                    curvaDois.name = "curvaD";
                    curvaDois.position.z = pistaMeioV.position.z;
                    curvaDois.rotation.y = -90 * Math.PI / 180;
                    curvaDois.position.x = pistaMeioV.position.x + 299;
                    curvaDois.add(_self.pistaCurvaN.clone());
                    var curvaParteD = new Physijs.BoxMesh(new THREE.BoxGeometry(350, 1, 450), chaoMeshPhisica3.clone(), 0);
                    curvaParteD.position.x = curvaDois.position.x + 140;
                    curvaParteD.position.z = curvaDois.position.z - 80;
                    _self.fase.cena.add(curvaDois);
                    _self.fase.cena.add(curvaParteD);
                    break;
                case 37:
                    for (var j = 0; j < 15; j++) {
                        var pistaMeioV = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica2.clone(), 0);
                        pistaMeioV.visible = true;
                        pistaMeioV.name = "pistaLateral";
                        // pistaMeioV.position.x = pistaCurve.position.x + 350;
                        pistaMeioV.position.z = (curvaDois.position.z - 300 * j) - 300;

                        //variavel que pega o inicio da curva e e posiciona o novo elemento
                        _self.pistaInicioL = curvaDois.position.x + 150;
                        pistaMeioV.position.x = _self.pistaInicioL;
                        pistaMeioV.add(_self.pistaComum.clone());
                        _self.fase.cena.add(pistaMeioV);
                    }
                    break;
                case 38:
                    var curvaDois = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica3.clone(), 0);
                    curvaDois.visible = true;
                    curvaDois.name = "curvaD";
                    curvaDois.position.z = pistaMeioV.position.z - 299;
                    //curvaDois.rotation.y = -90 * Math.PI / 180;
                    curvaDois.position.x = pistaMeioV.position.x;
                    curvaDois.add(_self.pistaCurvaN.clone());
                    var curvaParteD = new Physijs.BoxMesh(new THREE.BoxGeometry(450, 1, 350), chaoMeshPhisica3.clone(), 0);
                    curvaParteD.position.x = curvaDois.position.x - 81;
                    curvaParteD.position.z = curvaDois.position.z - 140;
                    _self.fase.cena.add(curvaDois);
                    _self.fase.cena.add(curvaParteD);
                    break;
                case 39:

                    for (var j = 0; j < 9; j++) {
                        var pistaMeioV = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica2.clone(), 0);
                        pistaMeioV.visible = true;
                        pistaMeioV.name = "pistaLateral";
                        // pistaMeioV.position.x = pistaCurve.position.x + 350;
                        pistaMeioV.position.z = curvaDois.position.z - 150;
                        pistaMeioV.rotation.y = 90 * Math.PI / 180;
                        //variavel que pega o inicio da curva e e posiciona o novo elemento
                        _self.pistaInicioL = curvaDois.position.x - 450;
                        pistaMeioV.position.x = _self.pistaInicioL - 300 * j;
                        pistaMeioV.add(_self.pistaComum.clone());
                        _self.fase.cena.add(pistaMeioV);
                    }
                    break;
                case 40:
                    var curvaDois = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica3.clone(), 0);
                    curvaDois.visible = true;
                    curvaDois.name = "curvaD";
                    curvaDois.position.z = pistaMeioV.position.z;
                    curvaDois.rotation.y = 90 * Math.PI / 180;
                    curvaDois.position.x = pistaMeioV.position.x - 300;
                    curvaDois.add(_self.pistaCurvaN.clone());
                    var curvaParteD = new Physijs.BoxMesh(new THREE.BoxGeometry(350, 1, 450), chaoMeshPhisica3.clone(), 0);
                    _self.pistaCurvaN.scale.x = 150;
                    _self.pistaCurvaN.scale.z = 150;
                    curvaParteD.position.x = curvaDois.position.x - 140;
                    curvaParteD.position.z = curvaDois.position.z + 90;
                    _self.fase.cena.add(curvaDois);
                    _self.fase.cena.add(curvaParteD);
                    break;
                case 41:
                    for (var j = 0; j < 5; j++) {
                        var pistaMeioV = new Physijs.BoxMesh(new THREE.BoxGeometry(300, 1, 300), chaoMeshPhisica2.clone(), 0);
                        pistaMeioV.visible = true;
                        pistaMeioV.name = "pistaLateral";
                        // pistaMeioV.position.x = pistaCurve.position.x + 350;
                        pistaMeioV.position.z = (curvaDois.position.z + 250 * j) + 450;

                        //variavel que pega o inicio da curva e e posiciona o novo elemento
                        _self.pistaInicioL = curvaDois.position.x - 150;
                        pistaMeioV.position.x = _self.pistaInicioL;
                        pistaMeioV.add(_self.pistaComum.clone());
                        _self.fase.cena.add(pistaMeioV);
                    }
                    break;
            }


        }
    };
};