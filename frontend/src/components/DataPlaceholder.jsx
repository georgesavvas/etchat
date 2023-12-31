import React from "react";
import Typography from "@mui/material/Typography";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: "20px",
  height: "100%",
  flexGrow: "100",
  position: "absolute",
  left: 0,
  top: 0,
  width: "100%",
  boxSizing: "border-box",
  pointerEvents: "none"
};

const typeStyle = {
  color: "rgb(70, 70, 70)"
};

const DataPlaceholder = props => {
  return (
    <div style={{...containerStyle, ...props.style}}>
      <Typography variant={props.variant || "h4"} style={typeStyle}>{props.text || "Placeholder"}</Typography>
    </div>
  );
};

export default DataPlaceholder;
