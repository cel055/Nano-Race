/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.nanorace.webSocket;

import javax.json.Json;
import javax.json.JsonObjectBuilder;
import javax.websocket.Session;

/**
 *
 * @author cel05_000
 */
public class JogadorComSessao {
    public Session session;
    public Double x;
    public Double y;
    public Double z;
    public Double rotacao;
    public String nave;

    public JogadorComSessao() {
    }

    public JogadorComSessao(Session session, Double x, Double y, Double z, Double rotacao, String nave) {
        this.session = session;
        this.x = x;
        this.y = y;
        this.z = z;
        this.rotacao = rotacao;
        this.nave = nave;
    }
    
    public JsonObjectBuilder criaJson(){
        JsonObjectBuilder json = Json.createObjectBuilder();
        json.add("id", session.getId());
        json.add("x", x);
        json.add("y", y);
        json.add("z", z);
        json.add("rotacao", rotacao);
        json.add("nave", nave);
        return json;
    }
}
