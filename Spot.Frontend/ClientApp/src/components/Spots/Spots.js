import React from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import { Button, CardActionArea, CardActions } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function Spots() {

    const theme = useTheme();
    const recentCards = [1, 2, 3];
    const featuredCards = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    return (
        <div>
            {/* desktop card */}
            <Typography variant="h2" sx={{ p: 1 }}>Recent</Typography>
            <Grid container spacing={4} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                {recentCards.map((card) => (
                    <Grid item key={card}>
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
                                        Recent Spot {card}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                                        enim praesent elementum facilisis leo vel.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Action 1</Button>
                                    <Button size="small">Action 2</Button>
                                </CardActions>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {/* mobile card */}
            <Grid container spacing={4} sx={{ display: { sm: 'block', md: 'none' } }}>
                {recentCards.map((card) => (
                    <Grid item key={card}>
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
                                        Recent Spot {card}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                                        enim praesent elementum facilisis leo vel.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small">Action 1</Button>
                                <Button size="small">Action 2</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {/* desktop card */}
            <Typography variant="h2" sx={{ p: 1 }}>Featured</Typography>
            <Grid container spacing={4} sx={{ display: { xs: 'none', sm: 'none', md: 'block' } }}>
                {featuredCards.map((card) => (
                    <Grid item key={card}>
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
                                        Featured Spot {card}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                                        enim praesent elementum facilisis leo vel.
                                    </Typography>
                                </CardContent>
                                <CardActions>
                                    <Button size="small">Action 1</Button>
                                    <Button size="small">Action 2</Button>
                                </CardActions>
                            </Box>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            {/* mobile card */}
            <Grid container spacing={4} sx={{ display: { sm: 'block', md: 'none' } }}>
                {featuredCards.map((card) => (
                    <Grid item key={card}>
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
                                        Featured Spot {card}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                                        tempor incididunt ut labore et dolore magna aliqua. Rhoncus dolor purus non
                                        enim praesent elementum facilisis leo vel.
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small">Action 1</Button>
                                <Button size="small">Action 2</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

        </div>
    )
}