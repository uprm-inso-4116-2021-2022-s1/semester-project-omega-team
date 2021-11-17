import * as React from "react";
import { makeStyles } from "@mui/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Container, CssBaseline } from "@mui/material";
import Typography from "@mui/material/Typography";
import Header from "./Header";
import { Box } from "@mui/system";

const useStyles = makeStyles((theme) => ({
  dot: {
    color: "#cc66ff",
  },
}));

export default function LandingPage() {
  const classes = useStyles();
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xl" className={classes.container}>
        <CssBaseline />
        <Header />
        <Box
          sx={{
            marginTop: 30,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Typography variant="h1" fontFamily="Trebuchet MS">
            Welcome to
          </Typography>
          <Typography variant="h1" fontFamily="Trebuchet MS">
            spot<span className={classes.dot}>.</span>
          </Typography>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
