import os
import logging

import uvicorn
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware

from . import api
from .tools import get_logger
from .socket_manager import SocketManager


LOGGER = get_logger(__name__)
SOCKET_MANAGER = SocketManager("chats")

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def resp(ok=True, data=None):
    resp = {"ok": ok}
    if data:
      resp["data"] = data
    return resp


@app.get("/channels")
async def get_channels():
    data = api.get_channels()
    return resp(True, data)


@app.post("/create_channel")
async def create_channel(request: Request):
    result = await request.json()
    ok = api.create_channel(**result, manager=SOCKET_MANAGER)
    return resp(ok)


@app.get("/posts")
async def get_posts():
    data = api.get_posts()
    return resp(True, data)


@app.post("/create_post")
async def create_post(request: Request):
    result = await request.json()
    ok = api.create_post(**result, manager=SOCKET_MANAGER)
    return resp(ok)


@app.websocket("/ws/chats/{session_id}")
async def chats(websocket: WebSocket, session_id):
    if session_id:
        await SOCKET_MANAGER.connect(websocket, session_id)
        try:
            while True:
                data = await websocket.receive_text()
                LOGGER.warning("Received data from chats socket:")
                print(data)
        except WebSocketDisconnect:
            await SOCKET_MANAGER.disconnect(session_id)


if __name__ == "__main__":
    uvicorn.run(
        f"{__name__}:app",
        host="0.0.0.0",
        port=8080,
        reload=True,
    )
