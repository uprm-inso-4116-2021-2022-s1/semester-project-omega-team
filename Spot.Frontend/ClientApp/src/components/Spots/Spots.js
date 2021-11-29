import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import { Button, CardActionArea, CardActions } from '@mui/material';
import Divider from '@mui/material/Divider';
import axios from "axios";
import Cookies from "js-cookie";
import Reserve from './Reserve';

export default function Spots() {

    useEffect(() => {
        retrieveSpots();
    }, [])

    const backendAPI = "https://omegaspotapi.herokuapp.com/";
    const [featuredSpots, setFeaturedSpots] = useState([]);
    const [spots, setSpots] = useState([]);
    const [openReserve, setOpenReserve] = useState(false);
    const [spotName, setSpotName] = useState("");
    const [spotID, setSpotID] = useState("");

    const retrieveSpots = async () => {
        await axios({
            method: 'GET',
            url: backendAPI + 'Spot'
        }).then((res) => {
            setSpots(res.data);
        })
        await axios({
            method: 'GET',
            url: backendAPI + 'Spot/Featured'
        }).then((res) => {
            setFeaturedSpots(res.data);
        })
    }

    return (
        <div>
            <Divider sx={{ p: 5 }}>
                <Typography component="h2" variant="h4" color="gray" gutterBottom>
                    Featured Spots
                </Typography>
            </Divider>
            {/* desktop card */}
            {/* <Typography variant="h2" sx={{ p: 1 }}>Recent</Typography> */}
            <Grid container spacing={4} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                {featuredSpots.map((card) => (
                    <Grid item key={card}>
                        <Card sx={{ display: 'flex' }}>
                            <CardMedia
                                component="img"
                                // height="151"
                                sx={{ width: 200, height: 200 }}
                                image="https://source.unsplash.com/random"
                                alt="random"
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                                <CardContent>
                                    <Typography gutterBottom variant="h5" component="div">
                                        Recent Spot {card}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla efficitur libero ut urna sagittis, a convallis massa facilisis. Vestibulum sit amet commodo neque, a tristique lectus. Vivamus et elit mi. Fusce dictum molestie elit sit amet accumsan. Nunc ultricies est tellus, quis laoreet turpis maximus vel. Mauris sodales malesuada erat, vel finibus risus suscipit sit amet. Morbi ornare turpis in nisi imperdiet, ac mattis massa varius. Nulla posuere porta diam, laoreet feugiat lorem condimentum id.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => {
                                        setSpotID(card.id)
                                        setSpotName(card.name)
                                        setOpenReserve(true);
                                    }}>Reserve</Button>
                                    <Button size="small">Details</Button>
                                </CardActions>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {/* mobile card */}
            <Grid container spacing={4} sx={{ display: { sm: 'block', md: 'none' } }}>
                {featuredSpots.map((card) => (
                    <Grid item key={card}>
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
                                        {card.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {card.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small" onClick={() => {
                                    setSpotID(card.id)
                                    setSpotName(card.name)
                                    setOpenReserve(true);
                                }}>Reserve</Button>
                                <Button size="small">Details</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {/* desktop card */}
            <Divider sx={{ p: 5 }}>
                <Typography component="h2" variant="h4" color="gray" gutterBottom>
                    Spots
                </Typography>
            </Divider>
            {/* <Typography variant="h2" sx={{ p: 1 }}>Featured</Typography> */}
            <Grid container spacing={4} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                {spots.map((card) => (
                    <Grid item key={card}>
                        <Card sx={{ display: 'flex' }}>
                            <CardMedia
                                component="img"
                                // height="151"
                                sx={{ width: 200, height: 200 }}
                                image="https://source.unsplash.com/random"
                                alt="random"
                            />
                            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-around' }}>
                                <CardContent>
                                    <Typography justifySelf="flex-start" gutterBottom variant="h5" component="div">
                                        {card.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {card.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => {
                                        setSpotID(card.id)
                                        setSpotName(card.name)
                                        setOpenReserve(true);
                                    }}>Reserve</Button>
                                    <Button size="small">Details</Button>
                                </CardActions>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {/* mobile card */}
            <Grid container spacing={4} sx={{ display: { sm: 'block', md: 'none' } }}>
                {spots.map((card) => (
                    <Grid item key={card}>
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
                                        {card.name}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        {card.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small" onClick={() => {
                                    setSpotID(card.id)
                                    setSpotName(card.name)
                                    setOpenReserve(true);
                                }}>Reserve</Button>
                                <Button size="small">Details</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Reserve spotID={spotID} spotName={spotName} openReserve={openReserve} setOpenReserve={setOpenReserve} />
        </div>
    )
}