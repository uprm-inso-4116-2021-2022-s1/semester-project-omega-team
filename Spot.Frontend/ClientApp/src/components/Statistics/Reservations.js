import React, { useState, useEffect } from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Title from '../Title/Title'
import axios from "axios";
import Cookies from "js-cookie";

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'spot', label: 'Spot', minWidth: 170 },
    {
        id: 'startTime',
        label: 'Start Time',
        minWidth: 200,
        // align: 'right',
        // format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'endTime',
        label: 'End Time',
        minWidth: 200,
        // align: 'right',
        // format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'reason',
        label: 'Reason',
        minWidth: 100,
        // align: 'right',
        // format: (value) => value.toFixed(2),
    },
];

function createData(name, spot, startTime, endTime, reason) {
    return { name, spot, startTime, endTime, reason };
}

const rows = [
    createData('Person A', 'Spot A', '01-01-2021', '00:00 AM', 68),
    createData('Person B', 'Spot B', '01-01-2021', '00:00 AM', 68),
    createData('Person C', 'Spot C', '01-01-2021', '00:00 AM', 68),
    createData('Person D', 'Spot D', '01-01-2021', '00:00 AM', 68),
    createData('Person E', 'Spot E', '01-01-2021', '00:00 AM', 68),
    createData('Person F', 'Spot F', '01-01-2021', '00:00 AM', 68),
    createData('Person G', 'Spot G', '01-01-2021', '00:00 AM', 68),
    createData('Person H', 'Spot H', '01-01-2021', '00:00 AM', 68),
    createData('Person I', 'Spot I', '01-01-2021', '00:00 AM', 68),
    createData('Person J', 'Spot J', '01-01-2021', '00:00 AM', 68),
    createData('Person K', 'Spot K', '01-01-2021', '00:00 AM', 68),
    createData('Person L', 'Spot L', '01-01-2021', '00:00 AM', 68),
    createData('Person M', 'Spot M', '01-01-2021', '00:00 AM', 68),
    createData('Person N', 'Spot N', '01-01-2021', '00:00 AM', 68),
    createData('Person O', 'Spot O', '01-01-2021', '00:00 AM', 68),
];

export default function Reservations() {

    useEffect(() => {
        getReservations();
        return () => {
            setReservations([]);
        };
    }, [])

    const backendAPI = "https://omegaspotapi.herokuapp.com/";
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [reservations, setReservations] = useState([]);
    const [sessionID, setSessionID] = useState(Cookies.get('sessionID'));

    const getReservations = async () => {
        let tempList = []
        for (let i = 0; i < 7; i++) {
            await axios({
                method: 'POST',
                url: backendAPI + 'Business/Reservations?Status=' + i,
                headers: { 'Content-Type': 'application/json' },
                data: sessionID
            }).then((res) => {
                res.data.forEach((item) => {
                    tempList.push(createData(item.user.name, item.spot.name, new Date(item.startTime).toTimeString(), new Date(item.endTime).toTimeString(), item.reason));
                })
                setReservations(tempList)
                console.log(reservations)
            }).catch((error) => { console.log(error) })
        }
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    return (
        <div>
            <TableContainer sx={{ maxHeight: 375 }}>
                <Title>Recent Reservations</Title>
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
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reservations
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row, i) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                                        {columns.map((column) => {
                                            const value = row[column.id];
                                            return (
                                                <TableCell key={column.id} align={column.align}>
                                                    {column.format && typeof value === 'number'
                                                        ? column.format(value)
                                                        : value}
                                                </TableCell>
                                            );
                                        })}
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </div>
    );
}
