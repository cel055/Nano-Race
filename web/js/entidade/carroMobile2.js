var CarroMobile = function () {
    CarroJogador.apply(this);
    var _self = this;
    var viraDireita = false;
    var viraEsquerda = false;
    var acelera = false;
    var freia = false;
    
    this.init = function (x, z) {
        _self.initBase(x, z);
        _self.fase.camera.rotation.y = _self.carro.rotation.y;
        _self.fase.camera.rotation.x = _self.carro.rotation.x;
        _self.carro.add(_self.fase.camera);
        _self.fase.camera.position.set(0, 4, -7);
        _self.initJog();
        
        criaBotaoAcelera();
        
        criaBotaoFreio();
        
        window.addEventListener('deviceorientation', deviceMotionHandler, false);
    };
    
    function criaBotaoAcelera(){
        var botao = document.createElement("div");
        botao.style.borderRadius = "50%";
        botao.style.position = "fixed";
        botao.style.bottom = "5px";
        botao.style.height = "50px";
        botao.style.width = "50px";
        botao.style.zIndex = "1000";
        botao.style.backgroundColor = "rgba(26, 125, 98, 0.75)";
        botao.style.textAlign = "center";
        botao.style.right = "5px";
//        botaoFreia.appendChild(document.createTextNode("F"));
        botao.addEventListener("touchstart",function (evento){
            evento.stopPropagation();
            acelera = true;
        });
        botao.addEventListener("touchend",function (evento){
            evento.stopPropagation();
            acelera = false;
        });
        document.body.appendChild(botao);
        return botao;
    }
    
    function criaBotaoFreio(){
        var botao = document.createElement("div");
        botao.style.borderRadius = "50%";
        botao.style.position = "fixed";
        botao.style.bottom = "5px";
        botao.style.height = "50px";
        botao.style.width = "50px";
        botao.style.zIndex = "1000";
        botao.style.backgroundColor = "rgba(26, 125, 98, 0.75)";
        botao.style.textAlign = "center";
        botao.style.left = "5px";
//        botaoFreia.appendChild(document.createTextNode("F"));
        botao.addEventListener("touchstart",function (evento){
            evento.stopPropagation();
            freia = true;
        });
        botao.addEventListener("touchend",function (evento){
            evento.stopPropagation();
            freia = false;
        });
        document.body.appendChild(botao);
        return botao;
    }

    function deviceMotionHandler(evento) {
//        if(evento.gamma > -30){
//            acelera = true;
//        }else if(evento.gamma < -50){
//            freia = true;
//        }else{
//            acelera = false;
//            freia = false;
//        }
        
        if(evento.beta > 10){
            viraDireita = true;
        }else if(evento.beta < -10){
            viraEsquerda = true;
        }else{
            viraDireita = false;
            viraEsquerda = false;
        }
    }

    this.movimentoCarro = function () {
        if(freia){
            _self.aceleraTrasCarro();
        }else if(acelera){
            _self.aceleraFrenteCarro();
        }else{
            _self.desaceleraCarro();
        }
        
        if(viraDireita){
            _self.viraDireita();
        }else if(viraEsquerda){
            _self.viraEsquerda();
        }
        document.getElementById('velocimetro').innerHTML = "kmH :  " + parseInt(_self.velocidade);
    };
};