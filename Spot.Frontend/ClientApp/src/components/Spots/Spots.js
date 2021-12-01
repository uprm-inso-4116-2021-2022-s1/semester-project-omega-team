import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardMedia from '@mui/material/CardMedia';
import Modal from "@mui/material/Modal";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import Grid from '@mui/material/Grid';
import { Button, CardActionArea } from '@mui/material';
import Divider from '@mui/material/Divider';
import "react-big-calendar/lib/css/react-big-calendar.css";
import moment from "moment";
import axios from "axios";
import Cookies from "js-cookie";

const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    // minWidth: 275,
    // minHeight: 800,
    bgcolor: "background.paper",
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4
};

export default function Spots() {

    useEffect(() => {
        getSpots();
        return () => {
            setSpots([]);
            setFeaturedSpots([]);
            setDates([]);
            setTempDates([]);
        };
    }, [])

    const backendAPI = "https://omegaspotapi.herokuapp.com/";
    const [featuredSpots, setFeaturedSpots] = useState([]);
    const [spots, setSpots] = useState([]);
    const [openReserve, setOpenReserve] = useState(false);
    const [openDetails, setOpenDetails] = useState(false);
    const [spotDetails, setSpotDetails] = useState({
        name: "",
        description: "",
        business: {
            website: "",
            phoneNumbers: "",
            email: ""
        }
    });
    const [spotName, setSpotName] = useState("");
    const [spotID, setSpotID] = useState("");
    const [sessionID, setSessionID] = useState(Cookies.get('sessionID'));
    const [reserveDialogOpen, setReserveDialogOpen] = useState(false);
    const [dates, setDates] = useState([]);
    const [reserveDialogMessage, setReserveDialogMessage] = useState("Would you like to submit the following reservation?")
    const [errorReserveDialog, setErrorReserveDialog] = useState(false);
    const [tempDates, setTempDates] = useState([]);
    const [tempStart, setTempStart] = useState(new Date());
    const [tempEnd, setTempEnd] = useState(new Date());
    const localizer = momentLocalizer(moment);

    const getSpots = async () => {
        await axios({
            method: 'GET',
            url: backendAPI + 'Spot'
        }).then((res) => {
            console.log('received spots', res.data);
            setSpots(res.data);
        })
        await axios({
            method: 'GET',
            url: backendAPI + 'Spot/Featured'
        }).then((res) => {
            console.log('received featured spots', res.data);
            setFeaturedSpots(res.data);
        })
    }

    const getSpotDetails = async (spotID) => {
        console.log('retrieving spot details for spot:', spotID);
        await axios({
            method: 'GET',
            url: backendAPI + 'Spot/' + spotID,
            // headers: { 'Content-Type': 'application/json' },
        }).then((res) => {
            console.log('received the following spot details for spot:', spotID, res.data);
            setSpotDetails(res.data);
            setOpenDetails(true);
        })
    }

    const getReservations = async (spotID) => {
        console.log('retrieving reservations')
        let tempList = []

        await axios({
            method: 'GET',
            url: backendAPI + 'Spot/' + spotID + '/ScheduleFuture?Start=0&End=20'
        }).then((res) => {
            res.data.forEach((item, i) => {
                tempList.push({
                    allDay: false,
                    start: new Date(item.startTime),
                    end: new Date(item.endTime)
                })
            })
            console.log(tempList);
            setDates(tempList);
        }).catch((error) => {
            console.log('get spot schedule error', error);
        })
    }

    const createReservation = async () => {
        await axios({
            method: 'POST',
            url: backendAPI + 'Reservation/Check',
            // headers: { 'Content-Type': 'application/json' },
            data: {
                sessionID: sessionID,
                reason: "Creating a reservation for user: " + sessionID + " at the spot: " + spotID,
                startTime: tempStart,
                endTime: tempEnd,
                spotID: spotID
            },
        }).then((res) => {
            if (!res.data) {
                console.log('reservation valid!');
                setReserveDialogMessage("Would you like to submit the following reservation?");
                setErrorReserveDialog(false);
                axios({
                    method: 'POST',
                    url: backendAPI + 'Reservation',
                    headers: { 'Content-Type': 'application/json' },
                    data: {
                        sessionID: sessionID,
                        reason: "Creating a reservation for user: " + sessionID + " at the spot: " + spotID,
                        startTime: tempStart,
                        endTime: tempEnd,
                        spotID: spotID
                    }
                }).then((res) => {
                    console.log('reservation submitted!', res.data)
                    getReservations(spotID)
                    setReserveDialogOpen(false);
                }).catch((error) => {
                    console.log('oops! something went wrong...', error);
                })
            }
        }).catch((error) => {
            console.log({
                sessionID: sessionID,
                reason: "Creating a reservation for user: " + sessionID + " at the spot: " + spotID,
                startTime: tempStart,
                endTime: tempEnd,
                spotID: spotID
            })
            console.log('reservation invalid!', error);
            setReserveDialogMessage("Sorry, this reservation is invalid!")
            setErrorReserveDialog(true);
        })
    }


    const desktopFeatured = (
        <div>
            {/* desktop card */}
            <Grid container spacing={4} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                {featuredSpots.map((card, i) => (
                    <Grid item key={i}>
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
                                    <Typography justifySelf="flex-start" variant="body2" color="text.secondary">
                                        Start: {new Date(card.business.openTime).toTimeString()}
                                    </Typography>
                                    <Typography justifySelf="flex-start" variant="body2" color="text.secondary">
                                        End: {new Date(card.business.closeTime).toTimeString()}
                                    </Typography>
                                    <Typography justifySelf="flex-start" variant="body2" color="text.secondary">
                                        {card.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => {
                                        setSpotID(card.id)
                                        setSpotName(card.name)
                                        setOpenReserve(true);
                                    }}>Reserve</Button>
                                    <Button size="small" onClick={() => {
                                        setSpotID(card.id);
                                        setSpotName(card.name);
                                        getSpotDetails(card.id);
                                    }}>Details</Button>
                                </CardActions>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div >
    );

    const mobileFeatured = (
        <div>
            {/* mobile card */}
            <Grid container spacing={4} sx={{ display: { sm: 'block', md: 'none' } }}>
                {featuredSpots.map((card, i) => (
                    <Grid item key={i}>
                        <Card>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="250"
                                    image="https://source.unsplash.com/random"
                                    alt="random"
                                />
                                <CardContent>
                                    <Typography justifySelf="flex-start" gutterBottom variant="h5" component="div">
                                        {card.name}
                                    </Typography>
                                    <Typography justifySelf="flex-start" variant="body2" color="text.secondary">
                                        Start: {new Date(card.business.openTime).toTimeString()}
                                    </Typography>
                                    <Typography justifySelf="flex-start" variant="body2" color="text.secondary">
                                        End: {new Date(card.business.closeTime).toTimeString()}
                                    </Typography>
                                    <Typography justifySelf="flex-start" variant="body2" color="text.secondary">
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
                                <Button size="small" onClick={() => {
                                    setSpotID(card.id);
                                    setSpotName(card.name);
                                    getSpotDetails(card.id);
                                }}>Details</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );

    const desktopSpots = (
        <div>
            <Grid container spacing={4} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                {spots.map((card, i) => (
                    <Grid item key={i}>
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
                                    <Typography justifySelf="flex-start" variant="body2" color="text.secondary">
                                        Start: {new Date(card.business.openTime).toTimeString()}
                                    </Typography>
                                    <Typography justifySelf="flex-start" variant="body2" color="text.secondary">
                                        End: {new Date(card.business.closeTime).toTimeString()}
                                    </Typography>
                                    <Typography justifySelf="flex-start" variant="body2" color="text.secondary">
                                        {card.description}
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small" onClick={() => {
                                        setSpotID(card.id);
                                        setSpotName(card.name);
                                        getReservations(card.id);
                                        setOpenReserve(true);
                                    }}>
                                        Reserve
                                    </Button>
                                    <Button size="small" onClick={() => {
                                        setSpotID(card.id);
                                        setSpotName(card.name);
                                        getSpotDetails(card.id);
                                    }} >Details</Button>
                                </CardActions>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );

    const mobileSpots = (
        <div>
            {/* mobile card */}
            <Grid container spacing={4} sx={{ display: { sm: 'block', md: 'none' } }}>
                {spots.map((card, i) => (
                    <Grid item key={i}>
                        <Card>
                            <CardActionArea>
                                <CardMedia
                                    component="img"
                                    height="250"
                                    image="https://source.unsplash.com/random"
                                    alt="random"
                                />
                                <CardContent>
                                    <Typography justifySelf="flex-start" gutterBottom variant="h5" component="div">
                                        {card.name}
                                    </Typography>
                                    <Typography justifySelf="flex-start" variant="body2" color="text.secondary">
                                        Start: {new Date(card.business.openTime).toTimeString()}
                                    </Typography>
                                    <Typography justifySelf="flex-start" variant="body2" color="text.secondary">
                                        End: {new Date(card.business.closeTime).toTimeString()}
                                    </Typography>
                                    <Typography justifySelf="flex-start" variant="body2" color="text.secondary">
                                        {card.description}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small" onClick={() => {
                                    setSpotID(card.id);
                                    setSpotName(card.name);
                                    setOpenReserve(true);
                                }}>Reserve</Button>
                                <Button size="small" onClick={() => {
                                    setSpotID(card.id);
                                    setSpotName(card.name);
                                    getSpotDetails(card.id);
                                }}>Details</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </div>
    );

    const featuredTitle = (
        <div>
            <Divider sx={{ p: 5 }}>
                <Typography component="h2" variant="h4" color="gray" gutterBottom>
                    Featured
                </Typography>
            </Divider>
        </div>
    );

    const spotsTitle = (
        <div>
            <Divider sx={{ p: 5 }}>
                <Typography component="h2" variant="h4" color="gray" gutterBottom>
                    Spots
                </Typography>
            </Divider>
        </div>
    );

    const calendarModal = (
        <div>
            <Modal
                open={openReserve}
                onClose={() => {
                    setOpenReserve(false)
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card style={style}>
                    <CardHeader title={"Reservation for " + spotName} />
                    <CardContent>
                        <Calendar
                            style={{ height: 300, minWidth: 275 }}
                            selectable
                            localizer={localizer}
                            startAccessor="start"
                            events={dates.concat(tempDates)}
                            endAccessor="end"
                            views={["month", "day"]}
                            defaultView="day"
                            defaultDate={Date.now()}
                            // toolbar={false}
                            onSelecting={(selected) => {
                                setTempStart(selected.start);
                                setTempEnd(selected.end);
                                setTempDates([
                                    {
                                        title: "Selection",
                                        allDay: false,
                                        start: new Date(selected.start),
                                        end: new Date(selected.end)
                                    }
                                ]);
                            }}
                        />
                    </CardContent>
                    <CardActions>
                        <Button onClick={() => {
                            if (tempStart !== '' && tempEnd !== '') {
                                console.log(tempStart, tempEnd)
                                setReserveDialogOpen(true);
                            }
                        }}>Reserve</Button>
                    </CardActions>
                </Card>
            </Modal>
        </div>
    );

    const confirmReservation = (
        <div>
            <Dialog
                open={reserveDialogOpen}
                onClose={() => {
                    setReserveDialogOpen(false);
                }}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Reservation?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography color={errorReserveDialog ? 'red' : 'black'}>
                            {reserveDialogMessage}
                        </Typography>
                        <Typography>Start: {tempStart.toString()}</Typography>
                        <Typography>End: {tempEnd.toString()}</Typography>
                        <Typography>At: {spotName}</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setReserveDialogMessage("Would you like to submit the following reservation?");
                        setErrorReserveDialog(false);
                        setReserveDialogOpen(false);
                    }}>Cancel</Button>
                    <Button
                        onClick={() => {
                            console.log(tempStart, tempEnd);
                            createReservation(spotID);
                        }}
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

    const spotDetail = (
        <div>
            <Dialog
                open={openDetails}
                onClose={() => {
                    setOpenDetails(false);
                }}
            >
                <DialogTitle>
                    Details for {spotDetails.name}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography>{spotDetails.description}</Typography>
                        <Typography>{spotDetails.business.name}</Typography>
                        <Typography>{spotDetails.business.website}</Typography>
                        <Typography>{spotDetails.business.email}</Typography>
                        <Typography>{spotDetails.business.phoneNumbers}</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setOpenDetails(false);
                    }}>Return</Button>
                </DialogActions>
            </Dialog>
        </div>
    )

    return (
        <div>
            {featuredTitle}
            {desktopFeatured}
            {mobileFeatured}
            {spotsTitle}
            {desktopSpots}
            {mobileSpots}
            {calendarModal}
            {confirmReservation}
            {spotDetail}
        </div>
    )
}