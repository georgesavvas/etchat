import {Button, Divider, IconButton, TextField, Typography} from "@mui/material";
import React, { useContext, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { ConfigContext } from "../contexts/ConfigContext";
import Modal from "../components/Modal";
import serverRequest from "../services/serverRequest";
import styles from "./Channels.module.css";

const Channel = ({selected, handleSelect, data}) => {
  return (
    <div
      className={`${styles.channelContainer} ${selected ? styles.selected : ""}`}
      onClick={handleSelect}
    >
      <Typography>{data.name}</Typography>
    </div>
  );
};

const Channels = () => {
  const {channels, selectedChannel, setSelectedChannel} = useContext(ConfigContext);
  const [createChannelOpen, setCreateChannelOpen] = useState(false);
  const [createChannelName, setCreateChannelName] = useState("");

  const handleChannelCreateClick = () => {
    setCreateChannelOpen(true);
  };

  const handleChannelCreate = () => {
    const data = {
      name: createChannelName,
    };
    serverRequest("create_channel", data);
    setCreateChannelOpen(false);
    setCreateChannelName("");
  };

  return (
    <div className={styles.container}>
      <Modal
        open={createChannelOpen}
        onClose={() => setCreateChannelOpen(false)}
        maxWidth="sm"
        title="Create Channel"
        buttons={[
          <Button size="small" onClick={handleChannelCreate} variant="contained" color="success" key="create" disabled={!createChannelName}>
            Create
          </Button>
        ]}
      >
        <TextField
          label="Channel Name"
          size="small"
          fullWidth
          required
          value={createChannelName}
          onChange={e => setCreateChannelName(e.target.value)}
        />
      </Modal>
      <div className={styles.titleBar}>
        <Typography variant="h6" align="center">Channel List</Typography>
        <IconButton variant="contained" color="success" onClick={handleChannelCreateClick}>
          <AddIcon />
        </IconButton>
      </div>
      <Divider />
      {/* <Button variant="outlined" size="small" onClick={handleChannelCreateClick}>
        New Channel
      </Button> */}
      <div className={styles.channelList}>
        {channels ? Object.entries(channels).map(
          ([id, channel]) => <Channel key={id} data={channel} selected={id === selectedChannel} handleSelect={() => setSelectedChannel(id)} />
        ) : null}
      </div>
    </div>
  );
};

export default Channels;
