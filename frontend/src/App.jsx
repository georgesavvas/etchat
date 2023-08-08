import "react-reflex/styles.css";
import "./App.css";

import {ThemeProvider, createTheme} from "@mui/material/styles";

import Button from "@mui/material/Button";
import {ConfigProvider} from "./contexts/ConfigContext";
import {ErrorBoundary} from "react-error-boundary";
import GlobalStyles from "@mui/material/GlobalStyles";
import Home from "./views/Home";
import React from "react";
import {SnackbarProvider} from "notistack";
import Typography from "@mui/material/Typography";
import darkScrollbar from "@mui/material/darkScrollbar";

let darkTheme = createTheme({
  palette: {
    mode: "dark",
    ndachat: {
      main: "rgb(252, 140, 3)",
    },
    lightgrey: {
      main: "rgb(211,211,211)",
    },
  },
  typography: {
    fontSize: 12.5,
    allVariants: {
      color: "lightgrey"
    }
  },
});

const ErrorFallback = ({error, resetErrorBoundary}) => {
  return (
    <div className="errorFallback" role="alert">
      {/* <ErrorIcon /> */}
      <Typography variant="h4">{"NDA Chat has crashed :("}</Typography>
      <Button color="review" variant="outlined" size="large" onClick={resetErrorBoundary}>Reload</Button>
      <pre className="errorContainer">{error.message}</pre>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <GlobalStyles styles={{...darkScrollbar()}} />
      <div className="App">
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <SnackbarProvider maxSnack={3} autoHideDuration={2500}>
            <ConfigProvider>
              <Home />
            </ConfigProvider>
          </SnackbarProvider>
        </ErrorBoundary>
      </div>
    </ThemeProvider>
  );
}

export default App;
