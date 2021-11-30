import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useHistory } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://material-ui.com/">
        Spot
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const theme = createTheme();

export default function LogIn() {

  let history = useHistory();

  const usersAPI = "https://omegaspotapi.herokuapp.com/User/";

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(true);

  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(true);

  const handleSubmit = async () => {
    // if password is empty, set red flag
    if (password === "") {
      setValidPassword(false);
    }
    // if username not empty, process
    if (username !== "") {
      await axios({
        method: 'POST',
        url: usersAPI + 'CheckUser',
        headers: { 'Content-Type': 'application/json' },
        data: username
      }).then((res) => {
        if (!res.data) {
          setValidUsername(false);
        } else {
          axios({
            method: 'POST',
            url: usersAPI + 'Auth',
            headers: { 'Content-Type': 'application/json' },
            data: {
              username: username,
              password: password
            }
          }).then((res) => {
            Cookies.set("sessionID", res.data);
            axios({
              method: 'POST',
              url: usersAPI,
              headers: { 'Content-Type': 'application/json' },
              data: res.data
            }).then((res) => {
              Cookies.set("isOwner", res.data.isOwner)
              history.push('/mainpage')
            })
          })
        }
      })
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            background: 'white',
            borderRadius: '10px'
          }}
        >
          <Typography component="h1" variant="h3" color="#7761FF" fontFamily="Lucida Sans">
            Spot
          </Typography>
          <Box component="form" noValidate sx={{ mt: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  name="username"
                  fullWidth
                  id="username"
                  label="Username"
                  autoFocus
                  error={!validUsername}
                  helperText={!validUsername ? username === "" ? "Field cannot be empty" : "User does not exist" : ""}
                  onChange={(e) => {
                    setValidUsername(true);
                    setUsername(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  fullWidth
                  id="password"
                  label="Password"
                  onChange={(e) => {
                    setValidPassword(true);
                    setPassword(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="remember" color="primary" />}
                  label="Remember me"
                />
              </Grid>
            </Grid>
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: '#7761FF'
              }}
              color="secondary"
              size="medium"
              onClick={() => {
                handleSubmit();
              }}
            >
              Log In
            </Button>
            <Grid container justifyContent="space-around">
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid item>
                <Link href="/SignUp" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}