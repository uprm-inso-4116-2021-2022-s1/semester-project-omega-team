import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
    event.preventDefault();
}

export default function Visitors() {
    return (
        <React.Fragment>
            <Title>Visitors</Title>
            <Typography component="p" variant="h4">
                420
            </Typography>
            <Typography color="text.secondary" sx={{ flex: 1 }}>
                since April 20th, 2021
            </Typography>
            <div>
                <Link color="primary" href="#" onClick={preventDefault}>
                    View others
                </Link>
            </div>
        </React.Fragment>
    );
}