import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import TableFooter from '@mui/material/TableFooter';
import Grid from '@mui/material/Grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Title from '../Title/Title';
import axios from "axios";
import Cookies from "js-cookie";
import Spots from '../Spots/Spots';

const columns = [
    { id: 'name', label: 'Spot Name', minWidth: 170 },
    { id: 'description', label: 'Spot Description', minWidth: 100 },
    { id: 'spotID', label: 'Spot ID', minWidth: 100 },
];

function createData(name, description, spotID) {
    return { name, description, spotID };
}

const rows = [
    createData('Spot A', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Building A, Street B, City C, PR 00420', 'Yes', '68'),
    createData('Spot B', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Building A, Street B, City C, PR 00420', 'No', '68'),
    createData('Spot C', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Building A, Street B, City C, PR 00420', 'Yes', '68'),
    createData('Spot D', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Building A, Street B, City C, PR 00420', 'Yes', '68'),
    createData('Spot E', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Building A, Street B, City C, PR 00420', 'Yes', '68'),
    createData('Spot F', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Building A, Street B, City C, PR 00420', 'No', '68'),
    createData('Spot G', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Building A, Street B, City C, PR 00420', 'Yes', '68'),
    createData('Spot H', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Building A, Street B, City C, PR 00420', 'Yes', '68'),
    createData('Spot I', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Building A, Street B, City C, PR 00420', 'No', '68'),
    createData('Spot J', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Building A, Street B, City C, PR 00420', 'No', '68'),
    createData('Spot K', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Building A, Street B, City C, PR 00420', 'Yes', '68'),
    createData('Spot L', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Building A, Street B, City C, PR 00420', 'Yes', '68'),
    createData('Spot M', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Building A, Street B, City C, PR 00420', 'No', '68'),
    createData('Spot N', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Building A, Street B, City C, PR 00420', 'Yes', '68'),
    createData('Spot O', 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', 'Building A, Street B, City C, PR 00420', 'Yes', '68'),
];

export default function ManageSpots() {

    useEffect(() => {
        getSpots();
        return () => {
            setSpots([]);
        };
    }, [])

    const backendAPI = "https://omegaspotapi.herokuapp.com/";
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sessionID, setSessionID] = useState(Cookies.get('sessionID'));
    const [tempName, setTempName] = useState("");
    const [tempDescription, setTempDescription] = useState("");
    const [tempUpdateMessage, setTempUpdateMessage] = useState("Please enter the updated name and/or description of the current Spot!")
    const [errorUpdate, setErrorUpdate] = useState(false);
    const [tempAddMessage, setTempAddMessage] = useState("Please enter the name and description of the new Spot that will be added!")
    const [errorAdd, setErrorAdd] = useState(false);
    const [spots, setSpots] = useState([]);
    const [updateOpen, setUpdateOpen] = useState(false);
    const [addOpen, setAddOpen] = useState(false);
    const [deleteOpen, setDeleteOpen] = useState(false);
    const [spotID, setSpotID] = useState("");

    const getSpots = async () => {
        await axios({
            method: 'POST',
            url: backendAPI + 'User/Business',
            headers: { 'Content-Type': 'application/json' },
            data: sessionID
        }).then((res) => {
            axios({
                method: 'GET',
                url: backendAPI + 'Business/' + res.data.id + '/Spots',
            }).then((res) => {
                console.log('received the following spots from business', res.data);
                let tempList = []
                res.data.forEach((item) => {
                    tempList.push(createData(item.name, item.description, item.id))
                })
                setAddOpen(false);
                setUpdateOpen(false);
                setDeleteOpen(false);
                setSpots(tempList);
            }).catch((error) => {
                console.log('user business spots error:', error);
            })
        }).catch((error) => {
            console.log('user business error:', error);
        })
    }

    const createSpot = async () => {
        await axios({
            method: 'POST',
            url: backendAPI + 'Spot',
            headers: { 'Content-Type': 'application/json' },
            data: {
                sessionID: sessionID,
                name: tempName,
                description: tempDescription
            }
        }).then((res) => {
            setTempAddMessage("Please enter the name and description of the new Spot that will be added!")
            setUpdateOpen(false);
            setAddOpen(false);
            setDeleteOpen(false);
            getSpots();
        }).catch((error) => {
            console.log('create spot error:', error)
        })
    }

    const deleteSpot = async () => {
        await axios({
            method: 'DELETE',
            url: backendAPI + 'Spot',
            headers: { 'Content-Type': 'application/json' },
            data: {
                sessionID: sessionID,
                spotID: spotID,
                spotName: tempName,
                spotDescription: tempDescription
            }
        }).then((res) => {
            console.log('deleted spot', spotID);
            setUpdateOpen(false);
            setAddOpen(false);
            setDeleteOpen(false);
            getSpots();
        }).catch((error) => {
            console.log('deleting spots error', error);
        });
    }

    const updateSpot = async () => {
        await axios({
            method: 'POST',
            url: backendAPI + 'Spot',
            headers: { 'Content-Type': 'application/json' },
            data: {
                sessionID: sessionID,
                spotID: spotID,
                name: tempName,
                description: tempDescription
            }
        }).then((res) => {
            console.log('updated spot', spotID)
            setTempUpdateMessage("Please enter the updated name and/or description of the current Spot!")
            setUpdateOpen(false);
            setAddOpen(false);
            setDeleteOpen(false);
            getSpots();
        }).catch((error) => {
            console.log('update spot error:', error)
        })
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const spotsTitle = (
        <div>
            <Divider sx={{ p: 1 }}>
                <Typography component="h2" variant="h4" color="gray" gutterBottom>
                    Spots
                </Typography>
            </Divider>
        </div>
    );

    const table = (
        <div>
            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer sx={{ maxHeight: 440 }}>
                    <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                            <TableRow>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align}
                                        style={{ minWidth: column.minWidth }}
                                    >
                                        {column.label}
                                    </TableCell>
                                ))}
                                <TableCell>
                                    Update
                                </TableCell>
                                <TableCell>
                                    Delete
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {spots
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, i) => {
                                    return (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={i}>
                                            {columns.map((column) => {
                                                const value = row[column.id];
                                                return (
                                                    <TableCell key={column.id} align={column.align}>
                                                        {column.format && typeof value === 'number' ? column.format(value) : value}
                                                    </TableCell>
                                                );
                                            })}
                                            <TableCell >
                                                <IconButton
                                                    aria-label="update"
                                                    onClick={() => {
                                                        console.log('updating spot', row.spotID)
                                                        setTempName(row.name);
                                                        setTempDescription(row.description);
                                                        setSpotID(row.spotID);
                                                        setUpdateOpen(true);
                                                        setAddOpen(false);
                                                        setDeleteOpen(false);
                                                    }}>
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton
                                                    aria-label="delete"
                                                    onClick={() => {
                                                        console.log('deleting spot', row.spotID)
                                                        setTempName(row.name);
                                                        setTempDescription(row.description);
                                                        setSpotID(row.spotID);
                                                        setUpdateOpen(false);
                                                        setAddOpen(false);
                                                        setDeleteOpen(true);
                                                    }}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TableFooter sx={{ display: 'flex' }}>
                    <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Grid item sx={{ p: 1 }}>
                            <Button
                                variant="contained"
                                onClick={() => {
                                    console.log('adding new spot');
                                    setTempName("");
                                    setTempDescription("");
                                    setUpdateOpen(false);
                                    setAddOpen(true);
                                    setDeleteOpen(false);
                                }}>
                                Add New
                            </Button>
                        </Grid>
                        <Grid item>
                            <TablePagination
                                rowsPerPageOptions={[10, 25, 100]}
                                component="div"
                                count={rows.length}
                                rowsPerPage={rowsPerPage}
                                page={page}
                                onPageChange={handleChangePage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                        </Grid>
                    </Grid>

                </TableFooter>
            </Paper>
        </div>
    );

    const editDialog = (
        <div>
            <Dialog open={updateOpen} onClose={() => { setUpdateOpen(false); }}>
                <DialogTitle>Edit an existing Spot</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography color={errorUpdate ? 'red' : 'gray'}>{tempUpdateMessage}</Typography>
                    </DialogContentText>
                    <TextField
                        required
                        variant="standard"
                        margin="dense"
                        id="name"
                        label="Spot Name"
                        defaultValue={tempName}
                        onChange={(e) => {
                            setTempName(e.target.value);
                        }}
                    />
                    <TextField
                        required
                        variant="standard"
                        fullWidth
                        margin="dense"
                        id="description"
                        label="Spot Description"
                        defaultValue={tempDescription}
                        onChange={(e) => {
                            setTempDescription(e.target.value);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setUpdateOpen(false); }}>Cancel</Button>
                    <Button
                        onClick={() => {
                            if (tempName !== "" && tempDescription !== "") {
                                setErrorUpdate(false);
                                updateSpot(spotID);
                            } else {
                                setTempUpdateMessage("Sorry! Your inputs are invalid.")
                                setErrorUpdate(true);
                            }
                        }}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

    const addDialog = (
        <div>
            <Dialog open={addOpen} onClose={() => { setAddOpen(false); }}>
                <DialogTitle>Add a new Spot</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        <Typography color={errorAdd ? 'red' : 'gray'}>{tempAddMessage}</Typography>
                    </DialogContentText>
                    <TextField
                        required
                        variant="standard"
                        margin="dense"
                        id="name"
                        label="Spot Name"
                        defaultValue=""
                        onChange={(e) => {
                            setTempName(e.target.value);
                        }}
                    />
                    <TextField
                        required
                        variant="standard"
                        fullWidth
                        margin="dense"
                        id="description"
                        label="Spot Description"
                        defaultValue=""
                        onChange={(e) => {
                            setTempDescription(e.target.value);
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setAddOpen(false); }}>Cancel</Button>
                    <Button
                        onClick={() => {
                            console.log({
                                sessionID: sessionID,
                                name: tempName,
                                description: tempDescription
                            })
                            if (tempName !== "" && tempDescription !== "") {
                                setErrorAdd(false);
                                createSpot();
                            } else {
                                setErrorAdd(true);
                                setTempAddMessage("Sorry! Your inputs are invalid.")
                            }
                        }}>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );

    const deleteDialog = (
        <div>
            <Dialog
                open={deleteOpen}
                onClose={() => { setDeleteOpen(false); }}
            >
                <DialogTitle>Delete a Spot</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you would like to delete {tempName}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { setDeleteOpen(false); }}>Cancel</Button>
                    <Button onClick={() => { deleteSpot(); }} autoFocus>
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )

    return (
        <div>
            {spotsTitle}
            {table}
            {editDialog}
            {addDialog}
            {deleteDialog}
        </div>
    );
}
