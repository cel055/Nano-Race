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
    public Double velocidade;
    public Double rotacao;
    public Double z;
    public String nave;

    public JogadorComSessao() {
    }

    public JogadorComSessao(Session session, Double velocidade, Double rotacao, String nave) {
        this.session = session;
        this.velocidade = velocidade;
        this.rotacao = rotacao;
        this.nave = nave;
    }

    public JogadorComSessao(Session session, Double velocidade, Double y, Double z, String nave) {
        this.session = session;
        this.velocidade = velocidade;
        this.rotacao = y;
        this.z = z;
        this.nave = nave;
    }
    
    public JsonObjectBuilder criaJson(){
        JsonObjectBuilder json = Json.createObjectBuilder();
        json.add("id", session.getId());
        json.add("velocidade", velocidade);
        json.add("rotacao", rotacao);
//        json.add("z", z);
        json.add("nave", nave);
        return json;
    }
}
