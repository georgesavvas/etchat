import {Button, Divider, IconButton, TextField, Typography} from "@mui/material";
import ContextMenu, { handleContextMenu } from "../components/ContextMenu";
import React, { useContext, useMemo, useState } from "react";

import AddIcon from "@mui/icons-material/Add";
import { ConfigContext } from "../contexts/ConfigContext";
import {CopyToClipboard} from "../components/CopyToClipboard";
import Modal from "../components/Modal";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import serverRequest from "../services/serverRequest";
import styles from "./Channels.module.css";
import {useSnackbar} from "notistack";

const Channel = ({selected, id, handleSelect, data}) => {
  const {enqueueSnackbar} = useSnackbar();
  const [contextMenu, setContextMenu] = useState(null);
  const [renameOpen, setRenameOpen] = useState(false);
  const [renameValue, setRenameValue] = useState(data.name);

  const contextItems = useMemo(() => {
    const items = [
      {
        "label": "Copy name",
        "fn": () => CopyToClipboard(data.name, enqueueSnackbar),
      },
      {
        "label": "Rename",
        "fn": () => {
          setRenameValue(data.name);
          setRenameOpen(true);
        },
      },
    ];
    return items;
  }, []);

  const handleRename = () => {
    serverRequest("rename_channel", {id: id, name: renameValue});
  };

  return (
    <div
      className={`${styles.channelContainer} ${selected ? styles.selected : ""}`}
      onClick={handleSelect}
      onContextMenu={e => handleContextMenu(e, contextMenu, setContextMenu)}
    >
      <Modal
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        title="Rename channel"
        maxWidth="xs"
        buttons={[
          <Button key="rename" color="success" size="small" variant="contained" onClick={handleRename}>Rename</Button>
        ]}
      >
        <TextField
          label="Name"
          size="small"
          fullWidth
          value={renameValue}
          onChange={e => setRenameValue(e.target.value)}
        />
      </Modal>
      <ContextMenu
        items={contextItems}
        contextMenu={contextMenu}
        setContextMenu={setContextMenu}
      />
      <Typography>{data.name}</Typography>
      <IconButton size="small" sx={{m: 0, p: 0}} onClick={e => handleContextMenu(e, contextMenu, setContextMenu)}>
        <MoreVertIcon sx={{fontSize: 20, color: "grey"}} />
      </IconButton>
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
          value={createChannelName}
          onChange={e => setCreateChannelName(e.target.value)}
        />
      </Modal>
      <div className={styles.titleBar}>
        <Typography variant="h6" align="center">Channel List</Typography>
        <IconButton variant="contained" color="success" onClick={handleChannelCreateClick} sx={{p: 0, mr: 0.5}}>
          <AddIcon sx={{fontSize: 30}} />
        </IconButton>
      </div>
      <Divider sx={{m: "5px"}} />
      <div className={styles.channelList}>
        {channels ? Object.entries(channels).map(
          ([id, channel]) => <Channel key={id} data={channel} selected={id === selectedChannel} handleSelect={() => setSelectedChannel(id)} />
        ) : null}
      </div>
    </div>
  );
};

export default Channels;
