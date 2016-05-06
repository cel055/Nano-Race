/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package br.com.nanorace.webSocket;

import java.io.IOException;
import java.io.StringReader;
import java.util.HashMap;
import java.util.Map;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
import javax.json.JsonObjectBuilder;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

/**
 *
 * @author Senac PLC
 */
@ServerEndpoint(value = "/socketNanoRace")
public class WebSocket {

    private static final Map<String, JogadorComSessao> usuariosLogados = new HashMap<>();

    @OnOpen
    public void abrir(Session session) {
        System.out.println("Abriu");
    }

    @OnClose
    public void fechou(Session session) {
        System.out.println("Fechou sessao id " + session.getId());
        usuariosLogados.remove(session.getId());
    }

    @OnError
    public void erro(Throwable erro, Session session) {
        System.out.println("ERRO SOCKET:\n\t" + erro.getMessage() + "\n");
        usuariosLogados.remove(session.getId());
    }

    @OnMessage
    public void mensagem(Session session, String msg) {
        JsonObject jsonRecebido = Json.createReader(new StringReader(msg)).readObject();
        JsonObjectBuilder envio = Json.createObjectBuilder();
        switch (jsonRecebido.getString("comando")) {
            case "entrou":
                envio.add("comando", "listaInicial");
                JsonArrayBuilder listaJogadores = Json.createArrayBuilder();
                for (String keySet : usuariosLogados.keySet()) {
                    listaJogadores.add(usuariosLogados.get(keySet).criaJson());

                }
                envio.add("lista", listaJogadores);
                envio.add("id", session.getId());
                try {
                    session.getBasicRemote().sendText(envio.build().toString());
                } catch (IOException erro) {
                    System.out.println("ERRO ENTROU SOCKET:\n\t" + erro.getMessage() + "\n");
                }
                break;
            case "novo":
                JogadorComSessao novo = new JogadorComSessao(
                        session,
                        jsonRecebido.getJsonNumber("velocidade").doubleValue(),
                        jsonRecebido.getJsonNumber("rotacao").doubleValue(),
//                        jsonRecebido.getJsonNumber("z").doubleValue(),
                        jsonRecebido.getString("nave")
                );
                usuariosLogados.put(session.getId(), novo);
                JsonObjectBuilder novoJogador = Json.createObjectBuilder();
                novoJogador.add("comando", "novo");
                novoJogador.add("jogador", novo.criaJson());
                msg = novoJogador.build().toString();
            case "novaPosicao":
                for (String keySet : usuariosLogados.keySet()) {
                    if (!keySet.equals(session.getId())) {
                        try {
                            usuariosLogados.get(keySet).session.getBasicRemote().sendText(msg);
                        } catch (IOException erro) {
                            System.out.println("ERRO ENVIO SOCKET:\n\t" + erro.getMessage() + "\n");
                        } finally {
                            continue;
                        }
                    }
                }
                break;
            default:

        }
    }
}
