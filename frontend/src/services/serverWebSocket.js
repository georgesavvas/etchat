import Sockette from "sockette";

const address = "localhost:8080";

export async function serverSocket(endpoint, sessionID) {
  const ws = new WebSocket(
    `ws://${address}/ws/${endpoint}/${sessionID}`
  );
  return ws;
}

export const longSocket = (endpoint, sessionID, websocketConfig={}) => {
  const ws = new Sockette(
    `ws://${address}/ws/${endpoint}/${sessionID}`,
    websocketConfig,
  );
  return ws;
};
