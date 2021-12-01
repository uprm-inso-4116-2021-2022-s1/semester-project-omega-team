import React, { useState, useEffect } from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from '../Title/Title';
import axios from "axios";
import Cookies from "js-cookie";

function preventDefault(event) {
    event.preventDefault();
}

export default function Visitors() {
    useEffect(() => {
        getYearCount();
        return () => {
        };
    }, [])

    const backendAPI = "https://omegaspotapi.herokuapp.com/";
    const [yearCount, setYearCount] = useState(0);
    const [sessionID, setSessionID] = useState(Cookies.get('sessionID'));

    const getYearCount = async () => {
        await axios({
            method: 'POST',
            url: backendAPI + 'Business/ReservationsCount?StartRange=2021-01-1%2000%3A00%3A00&EndRange=2021-12-1%2023%3A59%3A59',
            headers: { 'Content-Type': 'application/json' },
            data: sessionID
        }).then((res) => {
            console.log(res.data);
            let sum = 0
            res.data.forEach((item) => {
                sum += item.count
            })
            setYearCount(sum);
        }).catch((error) => {
            console.log(error);
        })
    }
    return (
        <React.Fragment>
            <Title>Visitors</Title>
            <Typography component="p" variant="h4">
                {yearCount}
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                since January 1st, 2021
            </Typography>
            <div>
                <Link color="primary" href="#" onClick={preventDefault}>
                    View others
                </Link>
            </div>
        </React.Fragment>
    );
}