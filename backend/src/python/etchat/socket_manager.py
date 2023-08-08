import logging
import time

from .tools import get_logger
from starlette.websockets import WebSocketState


LOGGER = get_logger(__name__)


class SocketManager:
    def __init__(self, name):
        self.connections = {}
        self.name = name

    async def connect(self, websocket, session_id):
        LOGGER.info(f"{self.name} - Accepting connection {session_id}")
        if session_id in list(self.connections.keys()):
            LOGGER.warning(f"{self.name} - Replacing websocket {session_id}")
            ws = self.connections[session_id]
            if ws.client_state == WebSocketState.CONNECTED:
                await ws.close()
        await websocket.accept()
        self.connections[session_id] = websocket
        LOGGER.info(f"{self.name} - Total connections: {len(self.connections)}")

    async def disconnect(self, session_id):
        if session_id not in list(self.connections.keys()):
            LOGGER.warning(f"Attempted to disconnect socket {session_id} but couldn't find it.")
            return
        LOGGER.info(f"{self.name} - Closing websocket {session_id}")
        ws = self.connections[session_id]
        if ws.client_state == WebSocketState.CONNECTED:
            await ws.close()
        del self.connections[session_id]
        LOGGER.info(f"{self.name} - Total connections: {len(self.connections)}")

    async def broadcast(self, data):
        if not self.connections:
            LOGGER.debug("No active connections found to broadcast over")
            return
        for ws_id, ws in self.connections.items():
            if ws.client_state == WebSocketState.DISCONNECTED:
                LOGGER.warning("Attempted to broadcast to {ws_id} but it is disconnected")
                continue
            try:
                LOGGER.debug(f"Broadcasting for session id {ws_id}")
                await ws.send_json({"data": data})
            except Exception as e:
                print(ws)
                print(ws.client_state)
                LOGGER.error(e)
