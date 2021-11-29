import React from 'react';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function ManageReservations() {

    const theme = useTheme();
    const cards = [1, 2, 3, 4, 5];

    return (
        <div>
            <Divider sx={{ p: 5 }}>
                <Typography component="h2" variant="h4" color="gray" gutterBottom>
                    Reservations
                </Typography>
            </Divider>
            {/* mobile card */}
            <Grid container spacing={4} >
                {cards.map((card) => (
                    <Grid item key={card} xs={12} sm={6} md={4}>
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
                                        Reserved Spot {card}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                                        enim praesent elementum facilisis leo vel.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small">Details</Button>
                                <Button size="small">Cancel</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

        </div>
    )
}