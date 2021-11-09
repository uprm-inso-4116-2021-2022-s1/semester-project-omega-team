import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useHistory } from "react-router-dom";
import axios from "axios";

function Copyright(props) {
    return (
        <Typography variant="body2" color="text.secondary" align="center" {...props}>
            {'Copyright ©'}
            <Link color="inherit" href="https://github.com/uprm-inso-4116-2021-2022-s1/semester-project-omega-team">
                Spots
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const theme = createTheme();

export default function SignUpBusiness() {

    let history = useHistory();

    const CORS = "https://cors-anywhere.herokuapp.com/";
    const usersAPI = "https://omegaspotapi.herokuapp.com/User/";

    const [username, setUsername] = useState("");
    const [validUsername, setValidUsername] = useState(true);

    const [name, setName] = useState("");
    const [validName, setValidName] = useState(true);

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [validPassword, setValidPassword] = useState(true);

    const handleSubmit = async () => {
        // if password != confirm password or passwords are empty, set red flag
        if (password !== confirmPassword || password === "") {
            setValidPassword(false);
        }
        // if name is empty, set red flag
        if (name === "") {
            setValidName(false);
        }
        if (username !== "") {
            await axios({
                method: 'POST',
                url: usersAPI + 'CheckUser',
                headers: { 'Content-Type': 'application/json' },
                data: username
            }).then((res) => {
                // if username already exists, set red flag
                if (res.data) {
                    setValidUsername(false);
                } else {
                    // if both username and password are valid, return to login
                    if (password === confirmPassword && name !== "") {
                        axios({
                            method: 'POST',
                            url: usersAPI + 'Register',
                            headers: { 'Content-Type': 'application/json' },
                            data: {
                                username: username,
                                name: name,
                                password: password
                            }
                        })
                        history.push('/login');
                    }
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
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Sign Up
                    </Typography>
                    <Box /*component="form" noValidate onSubmit={handleSubmit}*/ sx={{ mt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    name="name"
                                    fullWidth
                                    id="name"
                                    label="Full Name"
                                    autoFocus
                                    error={!validName}
                                    helperText={!validName ? "Field cannot be empty" : ""}
                                    onChange={(e) => {
                                        setValidName(true);
                                        setName(e.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="username"
                                    fullWidth
                                    id="username"
                                    label="Username"
                                    error={!validUsername}
                                    helperText={!validUsername ? username === "" ? "Field cannot be empty" : "Username already exists" : ""}
                                    onChange={(e) => {
                                        setValidUsername(true);
                                        setUsername(e.target.value);
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
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
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="confirmPassword"
                                    required
                                    fullWidth
                                    id="confirmPassword"
                                    label="Confirm Password"
                                    error={!validPassword}
                                    helperText={!validPassword ? password === "" ? "Field cannot be empty" : "Passwords do not match" : ""}
                                    onChange={(e) => {
                                        setValidPassword(true);
                                        setConfirmPassword(e.target.value);
                                    }}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            // type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2 }}
                            onClick={() => {
                                handleSubmit();
                            }}
                        >
                            Sign Up
                        </Button>
                        <Grid container justifyContent="center">
                            <Grid item>
                                <Link href="/signupbusiness" variant="body2">
                                    Would you like this to be a business account?
                                </Link>
                            </Grid>
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}
