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
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.json.Json;
import javax.json.JsonArrayBuilder;
import javax.json.JsonObject;
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

    }

    @OnClose
    public void fechou(Session session) {
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
        switch (jsonRecebido.getString("comando")) {
            case "entrou":
                JsonArrayBuilder listaJogadores = Json.createArrayBuilder();
                for (String keySet : usuariosLogados.keySet()) {
                    listaJogadores.add(usuariosLogados.get(keySet).criaJson());

                }
                try {
                    session.getBasicRemote().sendText(listaJogadores.build().toString());
                } catch (IOException erro) {
                    System.out.println("ERRO ENTROU SOCKET:\n\t" + erro.getMessage() + "\n");
                }
                break;
            case "novo":
                JogadorComSessao novo = new JogadorComSessao(
                        session,
                        jsonRecebido.getJsonNumber("x").doubleValue(),
                        jsonRecebido.getJsonNumber("y").doubleValue(),
                        jsonRecebido.getJsonNumber("z").doubleValue(),
                        jsonRecebido.getString("nave")
                );
                usuariosLogados.put(session.getId(), novo);
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
