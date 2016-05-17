var CarroJogador = function () {
    Carro.apply(this);
    var _self = this;

    this.colisaoCarro = function (outroObj, velocidadeRelativa, rotacaoRelativa, contato) {
        switch (outroObj.name) {
            case "largada":
                if (_self.checkPointAtual == _self.fase.pista.listaCheckPoints.length - 1) {
                    document.getElementById("voltas").innerHTML = "Laps: " + --_self.volta + "/2";
                }
                break;
            case "check":
                if (_self.fase.pista.listaCheckPoints[_self.checkPointAtual] == outroObj) {
                    return;
                }
                _self.posicaoCheckPoint = {y:_self.geoFisicaCarro.rotation.y,rotacao:_self.rotacao,rotSeno:_self.rotSeno,rotCoseno:_self.rotCoseno};
                for (var i = 0, size = _self.fase.pista.listaCheckPoints.length; i < size; i++) {
                    if (outroObj == _self.fase.pista.listaCheckPoints[i]) {
                        _self.checkPointAtual = i;
                        return;
                    }
                }
                break;
            default :
                _self.estaVoando = false;

        }
    };
}