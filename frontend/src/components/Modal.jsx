import React, { useEffect } from "react";

import ClearIcon from "@mui/icons-material/Clear";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import styles from "./Modal.module.css";

function Modal(props) {
  useEffect(() => {
    if (!props.open || !props.focusRef) return;
    const timeout = setTimeout(() => {
      if (props.focusRef.current) props.focusRef.current.focus();
    }, props.focusDelay || 250);
    return () => {
      clearTimeout(timeout);
    };
  }, [props.open]);

  const dialogStyle = {
    "& .MuiDialog-container": {
      "& .MuiPaper-root": {
        backgroundColor: "rgb(20,20,20)",
        backgroundImage: "none",
        height: props.fullHeight ? "100%" : "none"
      },
    },
  };

  const handleSubmit = e => {
    e.preventDefault();
    props.onFormSubmit();
  };

  const formWrapper = (onFormSubmit, children) => {
    if (onFormSubmit) return (
      <form onSubmit={handleSubmit}>
        {children}
      </form>
    );
    else return children;
  };

  return (
    <Dialog open={props.open} onClose={props.onClose}
      fullWidth={props.fullWidth !== undefined ? props.fullWidth : true}
      maxWidth={props.maxWidth || "sx"} sx={dialogStyle}
    >
      {formWrapper(props.onFormSubmit,
        <>
          <ClearIcon onClick={props.onClose} className={styles.closeButtonStyle} />
          {props.title ? <DialogTitle style={{padding: "10px 20px 0px 20px"}}>{props.title}</DialogTitle> : null}
          <DialogContent style={{padding: "15px 20px"}} {...props.dialogContentProps}>
            {props.text ? <DialogContentText>{props.text}</DialogContentText> : null}
            {props.children}
          </DialogContent>
          {props.buttons ?
            <DialogActions>
              {props.buttons}
            </DialogActions>
            : null
          }
        </>
      )}
    </Dialog>
  );
}

export default Modal;
