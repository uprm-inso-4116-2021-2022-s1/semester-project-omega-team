import React, { useState, useEffect } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import DateTimePicker from '@mui/lab/DateTimePicker';
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

    const [businessName, setBusinessName] = useState("");
    const [validBusinessName, setValidBusinessName] = useState(true);

    const [openTime, setOpenTime] = useState('2014-08-18T21:11:54');
    const [validOpenTime, setValidOpenTime] = useState(true);

    const [closeTime, setCloseTime] = useState('2014-08-22T21:11:54');
    const [validCloseTime, setValidCloseTime] = useState(true);

    const [phoneNumber, setPhoneNumber] = useState("");
    const [validPhoneNumber, setValidPhoneNumber] = useState(true);

    const [email, setEmail] = useState("");
    const [validEmail, setValidEmail] = useState(true);

    const [website, setWebsite] = useState("");
    const [validWebsite, setValidWebsite] = useState(true);

    const [checked, setChecked] = useState(true);

    const handleCheck = (event) => {
        setChecked(event.target.checked);
    };

    const handleSubmit = async () => {
        // if password != confirm password or passwords are empty, set red flag
        if (password !== confirmPassword || password === "") {
            setValidPassword(false);
        }
        // if name is empty, set red flag
        if (name === "") {
            setValidName(false);
        }
        // if business name is empty, set red flag
        if (businessName === "") {
            setValidBusinessName(false);
        }
        // if phone number is empty, set red flag
        if (phoneNumber === "") {
            setValidPhoneNumber(false);
        }
        // if email is empty, set red flag
        if (email === "") {
            setValidEmail(false);
        }
        // if website is empty, set red flag
        if (website === "") {
            setValidWebsite(false);
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
                    // if all fields are valid, return to login
                    if (password === confirmPassword && name !== "" && businessName !== "" && phoneNumber !== "" && email !== "" && website !== "") {
                        axios({
                            method: 'POST',
                            url: usersAPI + 'RegisterBusiness',
                            headers: { 'Content-Type': 'application/json' },
                            data: {
                                userRequest: {
                                    username: username,
                                    name: name,
                                    password: password
                                },
                                businessDetails: {
                                    name: businessName,
                                    openTime: openTime,
                                    closeTime: closeTime,
                                    reservationsRequireApproval: checked,
                                    phoneNumbers: phoneNumber,
                                    email: email,
                                    website: website
                                }
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
            <LocalizationProvider dateAdapter={AdapterDateFns}>
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
                            Business Sign Up
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
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
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="businessName"
                                        label="Business Name"
                                        name="businessName"
                                        error={!validBusinessName}
                                        helperText={!validBusinessName ? "Field cannot be empty" : ""}
                                        onChange={(e) => {
                                            setValidBusinessName(true);
                                            setBusinessName(e.target.value);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <DateTimePicker
                                        fullWidth
                                        id="openTime"
                                        label="Open Time"
                                        value={openTime}
                                        error={!validOpenTime}
                                        helperText={!validOpenTime ? "Field cannot be empty" : ""}
                                        onChange={(e) => {
                                            setValidOpenTime(true);
                                            setOpenTime(e);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <DateTimePicker
                                        fullWidth
                                        label="Close Time"
                                        id="closeTime"
                                        value={closeTime}
                                        error={!validCloseTime}
                                        helperText={!validCloseTime ? "Field cannot be empty" : ""}
                                        onChange={(e) => {
                                            setValidCloseTime(true);
                                            setCloseTime(e);
                                        }}
                                        renderInput={(params) => <TextField {...params} />}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="phoneNumber"
                                        label="Phone Number"
                                        name="phoneNumber"
                                        error={!validPhoneNumber}
                                        helperText={!validPhoneNumber ? "Field cannot be empty" : ""}
                                        onChange={(e) => {
                                            setValidPhoneNumber(true);
                                            setPhoneNumber(e.target.value);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="email"
                                        label="Email"
                                        name="email"
                                        error={!validEmail}
                                        helperText={!validEmail ? "Field cannot be empty" : ""}
                                        onChange={(e) => {
                                            setValidEmail(true);
                                            setEmail(e.target.value);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <TextField
                                        fullWidth
                                        id="website"
                                        label="Website"
                                        name="website"
                                        error={!validWebsite}
                                        helperText={!validWebsite ? "Field cannot be empty" : ""}
                                        onChange={(e) => {
                                            setValidWebsite(true);
                                            setWebsite(e.target.value);
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={checked}
                                                onChange={handleCheck}
                                                color="primary"
                                                id="reservationApproval"
                                                name="reservationApproval"
                                            />
                                        }
                                        label="Would you like reservations to require your approval?"
                                    />
                                </Grid>
                            </Grid>
                            <Button
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                onClick={handleSubmit}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <Link href="/signup" variant="body2">
                                        Would you like this to be a regular account?
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
            </LocalizationProvider>
        </ThemeProvider>
    );
}