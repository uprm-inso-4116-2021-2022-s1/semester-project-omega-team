import React, { Component, useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
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

export default function Reserve(props) {

    useEffect(() => {
        getReservations();
    }, [])

    const backendAPI = "https://omegaspotapi.herokuapp.com/";
    const [dialogOpen, setDialogOpen] = React.useState(false);
    const handleDialogOpen = () => {
        setDialogOpen(true);
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const [dates, setDates] = useState([]);
    const [dialogMessage, setDialogMessage] = useState("Would you like to submit the following reservation?")
    const [errorDialog, setErrorDialog] = useState(false);
    const [tempDates, setTempDates] = useState([]);
    const [tempStart, setTempStart] = useState(new Date());
    const [tempEnd, setTempEnd] = useState(new Date());
    const localizer = momentLocalizer(moment);
    const [sessionID, setSessionID] = useState(Cookies.get('sessionID'));

    const getReservations = async () => {
        console.log('retrieving reservations')
        let tempList = []
        await axios({
            method: 'GET',
            url: backendAPI + 'Spot/' + props.spotID + '/Schedule'
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
                reason: "Creating a reservation for user: " + sessionID + " at the spot: " + props.spotID,
                startTime: tempStart.toISOString(),
                endTime: tempEnd.toISOString(),
                spotID: props.spotID
            },
        }).then((res) => {
            if (!res.data) {
                console.log('reservation valid!');
                setDialogMessage("Would you like to submit the following reservation?");
                setErrorDialog(false);
                axios({
                    method: 'POST',
                    url: backendAPI + 'Reservation',
                    headers: { 'Content-Type': 'application/json' },
                    data: {
                        sessionID: sessionID,
                        reason: "Creating a reservation for user: " + sessionID + " at the spot: " + props.spotID,
                        startTime: tempStart.toISOString(),
                        endTime: tempEnd.toISOString(),
                        spotID: props.spotID
                    }
                }).then((res) => {
                    console.log('reservation submitted!', res.data)
                    handleDialogClose();
                }).catch((error) => {
                    console.log('oops! something went wrong...', error);
                })
            }
        }).catch((error) => {
            console.log({
                sessionID: sessionID,
                reason: "Creating a reservation for user: " + sessionID + " at the spot: " + props.spotID,
                startTime: tempStart.toISOString(),
                endTime: tempEnd.toISOString(),
                spotID: props.spotID
            })
            console.log('reservation invalid!', error);
            setDialogMessage("Sorry, this reservation is invalid!")
            setErrorDialog(true);
        })
    }

    return (
        <div>
            <Modal
                open={props.openReserve}
                onClose={() => {
                    props.setOpenReserve(false)
                }}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Card style={style}>
                    <CardHeader title={"Reservation for " + props.spotName} />
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
                                handleDialogOpen();
                            }
                        }}>Confirm</Button>
                    </CardActions>
                </Card>
            </Modal>
            <Dialog
                open={dialogOpen}
                onClose={handleDialogClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Confirm Reservation?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        <Typography color={errorDialog ? 'red' : 'black'}>
                            {dialogMessage}
                        </Typography>
                        <Typography>Start: {tempStart.toString()}</Typography>
                        <Typography>End: {tempEnd.toString()}</Typography>
                        <Typography>At: {props.spotName}</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setDialogMessage("Would you like to submit the following reservation?");
                        setErrorDialog(false);
                        handleDialogClose();
                    }}>Cancel</Button>
                    <Button
                        onClick={() => {
                            console.log(tempStart, tempEnd);
                            createReservation();
                        }}
                        autoFocus
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}
