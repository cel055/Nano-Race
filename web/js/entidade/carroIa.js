var CarroIa = function () {
    Carro.apply(this);
    var _self = this;
    var numVoltas = 0;

    var correndo = true, fazendoCurva = false, sentidoCurva = 0;

    this.movimentoCarro = function () {
        if (correndo && _self.velocidade < 1000) {
            _self.aceleraFrenteCarro();
        } else if(fazendoCurva){
            _self.aceleraTrasCarro();
            if (sentidoCurva == 0) {
                _self.viraEsquerda();
            } else {
                _self.viraDireita();
            }
        }
    };

    this.colisaoCarro = function (outroObj, velocidadeRelativa, rotacaoRelativa, contato) {
        switch (outroObj.name) {
            case "largada":
                numVoltas++;
                if(numVoltas >= 2){
                    alert("se mata");
                }
                break;
            case "check":
                if (_self.fase.pista.listaCheckPoints[_self.checkPointAtual] == outroObj) {
                    return;
                }
                for (var i = 0, size = _self.fase.pista.listaCheckPoints.length; i < size; i++) {
                    if (outroObj == _self.fase.pista.listaCheckPoints[i]) {
                        _self.checkPointAtual = i;
                        return;
                    }
                }
                break;
            case "inicioCurvaEsquerda":
                sentidoCurva = 0;
                fazendoCurva = true;
                correndo = false;
                break;
            case "inicioCurvaDireita":
                sentidoCurva = 1;
                fazendoCurva = true;
                correndo = false;
                break;
            case "fimCurva":
                fazendoCurva = false;
                correndo = true;
                _self.geoFisicaCarro.rotation.y = outroObj.rotation.y;
                break;
            default :

        }
    };


};