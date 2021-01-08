import React, { useRef } from "react";
import "./App.css";
import Routes from "./routes";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { SnackbarProvider } from "notistack";
import { Button } from "@material-ui/core";

const theme = createMuiTheme({
  palette: {
    primary: {
      // light: será calculada com base em palette.primary.main,
      main: "#00695c",
      // dark: será calculada com base em palette.primary.main,
      // contrastText: será calculada para contrastar com palette.primary.main
    },
    secondary: {
      light: "#0066ff",
      main: "#0044ff",
      // dark: será calculada com base palette.secondary.main,
      contrastText: "#ffcc00",
    },
    // Usado por `getContrastText()` para maximizar o contraste entre
    // o plano de fundo e o texto.
    contrastThreshold: 3,
    // Usado pelas funções abaixo para mudança de uma cor de luminância por aproximadamente
    // dois índices dentro de sua paleta tonal.
    // Por exemplo, mude de Red 500 para Red 300 ou Red 700.
    tonalOffset: 0.2,
  },
});

const App = () => {
  const notistackRef = useRef<any>();
  const onClickDismiss = (key: React.ReactText) => () => {
    if (notistackRef && notistackRef.current) {
      notistackRef.current.closeSnackbar(key);
    }
  };
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        ref={notistackRef}
        hideIconVariant={false}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        action={(key) => (
          <Button style={{ color: "#ffffff" }} onClick={onClickDismiss(key)}>
            Clean
          </Button>
        )}
      >
        <Routes />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
