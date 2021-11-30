import React, { Component, useState, useEffect } from "react";
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import axios from "axios";
import Cookies from "js-cookie";

export default function ManageReservations() {

    useEffect(() => {
        retrieveReservations();
    }, [])

    const backendAPI = "https://omegaspotapi.herokuapp.com/";
    const theme = useTheme();
    const cards = [1, 2, 3, 4, 5];
    const [reservations, setReservations] = useState([]);
    const sessionID = Cookies.get("sessionID");

    const retrieveReservations = async () => {
        await axios({
            method: 'POST',
            url: backendAPI + 'User/Reservations?Status=2',
            headers: { 'Content-Type': 'application/json' },
            data: sessionID
        }).then((res) => {
            setReservations(res.data);
        })
    }

    
    const cancelReservation = async (reservationID) => {
        console.log(sessionID, reservationID);
        await axios({
            method: 'PUT', 
            url: backendAPI + 'Reservation', 
            headers:  { 'Content-Type': 'application/json' },
            data: {
                sessionID: sessionID,
                reservationID: reservationID,
                newStatus: 6
            }
        }).then(()=> {
            retrieveReservations();
        })
    }

    return (
        <div>
            <Divider sx={{ p: 5 }}>
                <Typography component="h2" variant="h4" color="gray" gutterBottom>
                    Reservations
                </Typography>
            </Divider>
            {/* mobile card */}
            <Grid container spacing={4} >
                {reservations.map((card, i) => (
                    <Grid item key={i} xs={12} sm={6} md={4}>
                        <Card>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="250"
                                    image="https://source.unsplash.com/random"
                                    alt="random"
                                />
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Reservation for {card.spot.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                                        enim praesent elementum facilisis leo vel.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small">Details</Button>
                                <Button size="small" onClick={() => {
                                    cancelReservation(card.id);
                                }}>Cancel</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

        </div>
    )
}