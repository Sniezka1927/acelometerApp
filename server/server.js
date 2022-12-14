const WebSocket = require("ws");

const wss = new WebSocket.Server({ port: 1337 }, () => {
  console.log("ws startuje na porcie 1337");
});

//reakcja na podłączenie klienta i odesłanie komunikatu

wss.on("connection", (ws, req) => {
  //adres ip klienta

  const clientip = req.connection.remoteAddress; //reakcja na komunikat od klienta

  ws.on("message", (message) => {
    const recievedObj = JSON.parse(message.toString());
    const x = recievedObj.x.toFixed(2);
    const y = recievedObj.y.toFixed(2);
    const z = recievedObj.z.toFixed(2);
    sendToAll(JSON.stringify(recievedObj));

    // ws.send("serwer odsyła do klienta -> " + message);
  });
});

const sendToAll = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

const sendToAllButMe = (data, ws) => {
  wss.clients.forEach((client) => {
    if (client !== ws && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};
