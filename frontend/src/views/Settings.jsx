import { Button, TextField } from "@mui/material";
import React, { useContext, useEffect, useMemo, useState } from "react";

import { ConfigContext } from "../contexts/ConfigContext";
import Modal from "../components/Modal";
import serverRequest from "../services/serverRequest";
import styles from "./Settings.module.css";

const Settings = props => {
  const {user} = useContext(ConfigContext);
  const [displayName, setDisplayName] = useState("");
  const [oldDisplayName, setOldDisplayName] = useState("");

  useEffect(() => {
    if (!displayName) {
      setDisplayName(user);
      setOldDisplayName(user);
    }
  }, [user]);

  const onDisplayNameChange = e => {
    const value = e.target.value.replace(/[\W_ ]+/g, "");
    setDisplayName(value);
  };

  const canChangeDisplayName = useMemo(() => {
    if (displayName === oldDisplayName) return false;
    return true;
  }, [displayName, oldDisplayName]);

  const handleDisplayNameChange = e => {
    serverRequest("set_display_name", {user: user, name: e.target.value});
  };

  return (
    <Modal
      title="Settings"
      open={props.open}
      onClose={props.onClose}
      maxWidth="md"
      buttons={[
        <Button key="close" onClick={props.onClose} size="small" variant="outlined">Close</Button>
      ]}
    >
      <div className={styles.row}>
        <TextField
          label="Display Name"
          size="small"
          value={displayName}
          onChange={onDisplayNameChange}
        />
        <Button
          color="success"
          size="small"
          variant="contained"
          disabled={!canChangeDisplayName}
          onClick={handleDisplayNameChange}
        >
          Confirm
        </Button>
      </div>
    </Modal>
  );
};

export default Settings;
