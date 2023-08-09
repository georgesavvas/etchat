import React, {createContext, useEffect, useRef, useState} from "react";

import loadFromLS from "../utils/loadFromLS";
import {longSocket} from "../services/serverWebSocket";
import saveToLS from "../utils/saveToLS";
import serverRequest from "../services/serverRequest";
import {v4 as uuid} from "uuid";

// import {useSnackbar} from "notistack";



const SESSION_ID = uuid();

const createChatsSocket = config => {
  return longSocket("chats", SESSION_ID, config);
};

const destroySocket = socket => {
  if (!socket.current) return;
  socket.current.close();
  socket.current = undefined;
};

export const ConfigContext = createContext();

export const ConfigProvider = props => {
  const [user, setUser] = useState();
  const [channels, setChannels] = useState({});
  const [selectedChannel, setSelectedChannel] = useState("");
  const [posts, setPosts] = useState({});
  const chatsSocket = useRef();

  const handleChatsSocketMessage = e => {
    if (!e.data) return;
    const resp = JSON.parse(e.data);
    if (!resp.data) return;
    const data = resp.data;
    console.log("Received", data);
    if (Array.isArray(data)) return;
    if (data.channels) setChannels(data.channels);
    if (data.posts) setPosts(data.posts);
  };

  useEffect(() => {
    window.services.get_env("USER").then(resp => setUser(resp));
    serverRequest("channels").then(resp => {
      if (!resp) return;
      setChannels(resp.data);
    });
    serverRequest("posts").then(resp => {
      if (!resp) return;
      setPosts(resp.data);
    });
    const previouslySelectedChannel = loadFromLS("selectedChannel");
    if (previouslySelectedChannel) setSelectedChannel(previouslySelectedChannel);
    if (chatsSocket.current) return;
    const websocketConfig = {
      timeout: 5000,
      onmessage: handleChatsSocketMessage,
      onerror: e => console.log("Error", e),
      onopen: e => console.log("Connected!", e),
      onclose: e => {
        console.log("Closed!", e);
        chatsSocket.current = undefined;
      },
      onreconnect: e => console.log("Reconnecting...", e),
    };
    const ws = createChatsSocket(websocketConfig);
    if (!ws) return;
    chatsSocket.current = ws;
    return (() => destroySocket(chatsSocket));
  }, []);

  const onChannelSelect = value => {
    setSelectedChannel(value);
    saveToLS("selectedChannel", value);
  };

  return (
    <ConfigContext.Provider value={{
      channels: channels,
      selectedChannel: selectedChannel,
      setSelectedChannel: onChannelSelect,
      posts: posts,
      user: user,
    }}>
      {props.children}
    </ConfigContext.Provider>
  );
};
