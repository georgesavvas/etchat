from pathlib import Path
from uuid import uuid4
import datetime
import asyncio

import yaml


PATH = Path("/tmp/nda_chat")
PATH.mkdir(exist_ok=True)
CHANNELS = PATH / "channels.yml"
POSTS = PATH / "posts.yml"
TASKS = set()


def broadcast(manager, data):
    try:
        loop = asyncio.get_running_loop()
    except Exception:
        loop = None
    if loop:
        task = asyncio.create_task(manager.broadcast(data))
        TASKS.add(task)
    else:
        asyncio.run(manager.broadcast(data))


def get_channels():
    channels = {}
    if not CHANNELS.is_file():
        return channels
    with open(CHANNELS, "r") as file:
        channels = yaml.safe_load(file)
    return channels


def create_channel(name, manager=None):
    if not name:
        return False
    channels = get_channels()
    existing_names = [channel["name"] for channel in channels.values()]
    if name in existing_names:
        return False
    channel_id = str(uuid4())
    data = {
        "name": name,
        "created": datetime.datetime.utcnow().timestamp(),
    }
    channels[channel_id] = data
    if manager:
        broadcast(manager, {"channels": channels})
    with open(CHANNELS, "w") as file:
        yaml.safe_dump(channels, file)
    return True


def get_posts():
    posts = {}
    if not POSTS.is_file():
        return posts
    with open(POSTS, "r") as file:
        posts = yaml.safe_load(file)
    if not posts:
        posts = {}
    return posts


def create_post(channel_id, author, post_data, parent=None, manager=None):
    posts = get_posts()
    post_id = str(uuid4())
    data = {
        "data": post_data.strip(),
        "created": datetime.datetime.now().timestamp(),
        "author": author,
        "parent": parent,
        "channel": channel_id,
    }
    posts[post_id] = data
    if manager:
        broadcast(manager, {"posts": posts})
    with open(POSTS, "w") as file:
        posts = yaml.safe_dump(posts, file)
    return True
