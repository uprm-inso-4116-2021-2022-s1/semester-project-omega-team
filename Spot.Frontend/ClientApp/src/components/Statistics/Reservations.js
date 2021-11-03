import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import Title from '../Title/Title'

const columns = [
    { id: 'name', label: 'Name', minWidth: 170 },
    { id: 'spot', label: 'Spot', minWidth: 100 },
    {
        id: 'date',
        label: 'Date',
        minWidth: 170,
        align: 'right',
        // format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'time',
        label: 'Time',
        minWidth: 170,
        align: 'right',
        // format: (value) => value.toLocaleString('en-US'),
    },
    {
        id: 'party',
        label: 'Party',
        minWidth: 170,
        align: 'right',
        // format: (value) => value.toFixed(2),
    },
];

function createData(name, spot, date, time, party) {
    return { name, spot, date, time, party };
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
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
                        {rows
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
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
