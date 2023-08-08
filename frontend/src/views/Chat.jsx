import { Button, Typography } from "@mui/material";
import React, { useContext, useMemo, useState } from "react";

import { ConfigContext } from "../contexts/ConfigContext";
import DataPlaceholder from "../components/DataPlaceholder";
import MDEditor from "@uiw/react-md-editor";
import serverRequest from "../services/serverRequest";
import styles from "./Chat.module.css";

const Post = ({data, user}) => {
  const now = new Date().getTime() / 1000;
  const date = data.created;
  let timeAgo = Math.round(now - date);
  let timeUnit = "seconds";
  if (timeAgo > 60) {
    timeAgo = Math.round(timeAgo / 60);
    timeUnit = "minutes";
  }
  if (timeAgo > 60) {
    timeAgo = Math.round(timeAgo / 60);
    timeUnit = timeAgo > 1 ? "hours" : "hour";
  }
  const own = data.author === user;
  return (
    <div className={own ? styles.ownPost : styles.post}>
      <div className={own ? styles.ownPostContent : styles.postContent}>
        <Typography>{data.data}</Typography>
      </div>
      <div className={styles.postInfo}>
        {
          own ? null :
            <Typography variant="subtitle2" color="lightgrey">
              {data.author}
            </Typography>
        }
        <Typography variant="subtitle2" color="grey">
          {timeAgo} {timeUnit} ago
        </Typography>
      </div>
    </div>
  );
};

const Chat = () => {
  const [editorValue, setEditorValue] = useState("");
  const {posts, selectedChannel, user} = useContext(ConfigContext);

  const postsFiltered = useMemo(() => {
    if (!posts) return [];
    return Object.entries(posts)
      .filter(([,post]) => {
        return post.channel === selectedChannel;
      })
      .sort(([,postA], [,postB]) => postA.created > postB.created ? 1 : -1);
  }, [posts, selectedChannel]);

  const handlePost = () => {
    const data = {
      channel_id: selectedChannel,
      author: user,
      post_data: editorValue,

    };
    serverRequest("create_post", data);
    setEditorValue("");
  };

  return (
    <div className={styles.container}>
      <div className={styles.postsList}>
        {postsFiltered.length > 0 ? postsFiltered.map(
          ([id, channel]) => <Post key={id} id={id} data={channel} user={user} />
        ) : <DataPlaceholder text="No messages yet :(" />}
      </div>
      <div data-color-mode="dark" className={styles.editorContainer}>
        <MDEditor height="100%" value={editorValue} onChange={setEditorValue} preview="edit" visibleDragbar={false} />
      </div>
      <div className={styles.buttonContainer}>
        <Button size="small" color="success" onClick={handlePost} disabled={!editorValue} variant="contained">
          Send
        </Button>
      </div>
    </div>
  );
};

export default Chat;
