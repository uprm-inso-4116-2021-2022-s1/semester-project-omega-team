import * as React from 'react';
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
import Title from '../Title/Title';

const columns = [
    { id: 'name', label: 'Spot Name', minWidth: 170 },
    { id: 'description', label: 'Spot Description', minWidth: 100 },
    { id: 'address', label: 'Address', minWidth: 170 },
    { id: 'available', label: 'Available', minWidth: 100 },
    { id: 'capacity', label: 'Capacity', minWidth: 100 },
];

function createData(name, description, address, available, capacity) {
    return { name, description, address, available, capacity };
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
            <Divider sx={{ p: 1 }}>
                <Typography component="h2" variant="h4" color="gray" gutterBottom>
                    Spots
                </Typography>
            </Divider>
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
                                    Edit
                                </TableCell>
                                <TableCell>
                                    Delete
                                </TableCell>
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
                                            <TableCell >
                                                <IconButton aria-label="edit">
                                                    <EditIcon />
                                                </IconButton>
                                            </TableCell>
                                            <TableCell>
                                                <IconButton aria-label="delete">
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
                            <Button variant="contained">Add New</Button>
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
}
