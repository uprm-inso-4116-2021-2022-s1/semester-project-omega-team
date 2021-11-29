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
        retrieveReservations();
    }, [])

    const [dialogOpen, setDialogOpen] = React.useState(false);
    const handleDialogOpen = () => {
        setDialogOpen(true);
    };
    const handleDialogClose = () => {
        setDialogOpen(false);
    };
    const [dates, setDates] = useState([
        {
            allDay: false,
            start: new Date("11-26-2021 08:00:00"),
            end: new Date("11-26-2021 08:30:00")
        },
        {
            allDay: false,
            start: new Date("11-26-2021 09:00:00"),
            end: new Date("11-26-2021 09:30:00")
        },
        {
            allDay: false,
            start: new Date("11-26-2021 10:00:00"),
            end: new Date("11-26-2021 10:30:00")
        }
    ]);
    const [tempDates, setTempDates] = useState([]);
    const [tempStart, setTempStart] = useState("");
    const [tempEnd, setTempEnd] = useState("");
    const localizer = momentLocalizer(moment);

    const retrieveReservations = async () => {
        console.log('retrieving reservations')
    }

    return (
        <div>
            {/* <Button onClick={handleOpen}>Open modal</Button> */}
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
                        <Button onClick={handleDialogOpen}>Action 1</Button>
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
                        <Typography>
                            Would you like to submit the following reservation?
                        </Typography>
                        <Typography>Start: {tempStart.toString()}</Typography>
                        <Typography>End: {tempEnd.toString()}</Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button
                        onClick={() => {
                            console.log(tempStart, tempEnd);
                            // submit API call to make reservation
                            handleDialogClose();
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
