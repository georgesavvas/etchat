import { Divider, Typography } from "@mui/material";
import React, {useContext, useEffect, useState} from "react";
// import serverRequest from "../services/serverRequest";
import {ReflexContainer, ReflexElement, ReflexSplitter} from "react-reflex";

import Channels from "./Channels";
import Chat from "./Chat";
import {ConfigContext} from "../contexts/ConfigContext";
import loadReflexLayout from "../utils/loadReflexLayout";
import saveReflexLayout from "../utils/saveReflexLayout";
import styles from "./Home.module.css";

const splitterStyle = {
  borderColor: "rgb(80,80,80)",
  backgroundColor: "rgb(80,80,80)"
};

const defaultFlexRations = {
  "home.channels": 0.25,
  "home.chat": 0.75
};

export default function Home() {
  const [flexRatios, setFlexRatios] = useState(defaultFlexRations);

  useEffect(() => {
    const data = loadReflexLayout();
    if (!data) {
      setFlexRatios(defaultFlexRations);
      return;
    }
    const viewport = data["home.channels"];
    const sources = data["home.chat"];
    if (!viewport || !sources) {
      setFlexRatios(defaultFlexRations);
      return;
    }
    const fullWidth = viewport[0] + sources[0];
    const ratios = {
      "home.channels": viewport[0] / fullWidth,
      "home.chat": sources[0] / fullWidth
    };
    setFlexRatios(ratios);
  }, []);

  const handleResized = data => {
    saveReflexLayout(data);
  };

  return (
    <div className={styles.container}>
      <div className={styles.topBar}>
        <div className={styles.topBarButtons} />
        <Typography variant="h5" align="center">NDA Chat</Typography>
        <div className={styles.topBarButtons}>

        </div>
      </div>
      <Divider sx={{m: "5px"}} />
      <ReflexContainer orientation="vertical" className={styles.viewport}>
        <ReflexElement flex={flexRatios["home.channels"]} name="home.channels"
          onStopResize={handleResized}
        >
          <Channels />
        </ReflexElement>
        <ReflexSplitter style={splitterStyle} />
        <ReflexElement flex={flexRatios["home.chat"]} name="home.chat"
          onStopResize={handleResized}
        >
          <Chat />
        </ReflexElement>
      </ReflexContainer>
    </div>
  );
}
