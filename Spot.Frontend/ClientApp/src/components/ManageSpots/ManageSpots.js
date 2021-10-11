import * as React from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';

const columns = [
    { id: 'name', label: 'Spot Name', minWidth: 170 },
    { id: 'description', label: 'Spot Description', minWidth: 100 },
    {
        id: 'address',
        label: 'Address',
        minWidth: 170,
        align: 'right',

    },
    {
        id: 'available',
        label: 'Available',
        minWidth: 170,
        align: 'right',

    },
    {
        id: 'capacity',
        label: 'Capacity',
        minWidth: 170,
        align: 'right',

    },
];

function createData(name, description, date, address, available, capacity) {
    return { name, description, date, address, available, capacity };
}

const rows = [
    createData('Spot Student A', 'Building A', 1324171354, 3287263),
    createData('Carlos', 'City B', 1403500365, 9596961),
    createData('Ricardo', 'Base C', 60483973, 301340),
    createData('Bryan', 'US', 327167434, 9833520),
    createData('Roberto', 'CA', 37602103, 9984670),
    createData('Elver Galarga', 'AU', 25475400, 7692024),
    createData('Agustín', 'DE', 83019200, 357578),
    createData('Jose', 'IE', 4857000, 70273),
    createData('Dennis', 'MX', 126577691, 1972550),
    createData('Diego', 'JP', 126317000, 377973),
    createData('Molusco', 'FR', 67022000, 640679),
    createData('Pedro', 'GB', 67545757, 242495),
    createData('Benito', 'RU', 146793744, 17098246),
    createData('Maria', 'NG', 200962417, 923768),
    createData('Alana', 'BR', 210147125, 8515767),
];

export default function ManageSpots() {
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
        </Paper>
    );
}
