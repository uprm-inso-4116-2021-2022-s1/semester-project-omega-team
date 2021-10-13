import React, { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Badge from '@mui/material/Badge';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import AccountCircle from '@mui/icons-material/AccountCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MoreIcon from '@mui/icons-material/MoreVert';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ManageSpots from '../ManageSpots/ManageSpots';
import Statistics from '../Statistics/Statistics';
import Spots from '../Spots/Spots';
import ManageReservations from '../ManageReservations/ManageReservations';
import { useHistory } from "react-router-dom";

const drawerWidth = 240;

export default function MainPage(props) {

    // declare variables
    let history = useHistory();

    const { window } = props;
    const [accountType, setAccountType] = useState("business");
    const container = window !== undefined ? () => window().document.body : undefined;

    const [showManageSpots, setShowManageSpots] = useState(true);
    const [showStatistics, setShowStatistics] = useState(false);

    const [showSpots, setShowSpots] = useState(true);
    const [showReservations, setShowReservations] = useState(false);

    const [anchorEl, setAnchorEl] = useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const [mobileOpen, setMobileOpen] = useState(false);

    // ui functions
    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleLogOut = () => {
        history.push("/login")
    };

    // business functions
    const handleShowManageSpots = () => {
        setShowManageSpots(true);
        setShowStatistics(false);
        console.log('manage spots:', showManageSpots, 'statistics:', showStatistics);
    };

    const handleShowStatistics = () => {
        setShowStatistics(true);
        setShowManageSpots(false);
        console.log('manage spots:', showManageSpots, 'statistics:', showStatistics);
    };

    const handleButtonsBusiness = (index) => {
        switch (index) {
            case 0:
                handleShowManageSpots();
                break;
            case 1:
                handleShowStatistics();
                break;
            default:
                console.log('index invalid');
        }
    };

    // client functions
    const handleShowSpots = () => {
        setShowSpots(true);
        setShowReservations(false);
        console.log('spots:', showSpots, 'reservations:', showReservations);
    };

    const handleShowReservations = () => {
        setShowReservations(true);
        setShowSpots(false);
        console.log('spots:', showSpots, 'reservations:', showReservations);
    };

    const handleButtonsClient = (index) => {
        switch (index) {
            case 0:
                handleShowSpots();
                break;
            case 1:
                handleShowReservations();
                break;
            default:
                console.log('index invalid');
        }
    };

    // ui components
    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <div>
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                id={menuId}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isMenuOpen}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={handleMenuClose}>My account</MenuItem>
                <MenuItem onClick={handleMenuClose}>Log out</MenuItem>
            </Menu>
        </div>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <div>
            <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                id={mobileMenuId}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={isMobileMenuOpen}
                onClose={handleMobileMenuClose}
            >
                {/* <MenuItem>
                    <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                        <Badge badgeContent={4} color="error">
                            <MailIcon />
                        </Badge>
                    </IconButton>
                    <p>Messages</p>
                </MenuItem> */}
                <MenuItem>
                    <IconButton
                        size="large"
                        aria-label="show 17 new notifications"
                        color="inherit"
                    >
                        <Badge badgeContent={20} color="error">
                            <NotificationsIcon />
                        </Badge>
                    </IconButton>
                    <p>Notifications</p>
                </MenuItem>
                <MenuItem>
                    <IconButton
                        size="large"
                        aria-label="account of current user"
                        // aria-haspopup="true"
                        color="inherit"
                    >
                        <AccountCircle />
                    </IconButton>
                    <p>Profile</p>
                </MenuItem>
                <MenuItem>
                    <IconButton
                        size="large"
                        aria-label="log out button"
                        // aria-haspopup="true"
                        color="inherit"
                        onClick={handleLogOut}
                    >
                        <ExitToAppIcon />
                    </IconButton>
                    <p>Log out</p>
                </MenuItem>
            </Menu>
        </div>
    );

    const drawerBusiness = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {['Manage Spots', 'Statistics'].map((text, index) => (
                    <ListItem button key={text} onClick={() => { handleButtonsBusiness(index); }}>
                        {/* <ListItemIcon>
                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon> */}
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const drawerClient = (
        <div>
            <Toolbar />
            <Divider />
            <List>
                {['Spots', 'Manage Reservations'].map((text, index) => (
                    <ListItem button key={text} onClick={() => { handleButtonsClient(index); }}>
                        {/* <ListItemIcon>
                            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                        </ListItemIcon> */}
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const sidebar = (
        <div>
            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="component tabs"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', /*sm: 'none'*/ },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {accountType === "business" ? drawerBusiness : drawerClient}
                </Drawer>
                {/* <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {accountType === "business" ? drawerBusiness : drawerClient}
                </Drawer> */}
            </Box>
        </div>
    );

    const header = (
        <div>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="start"
                        onClick={handleDrawerToggle}
                        sx={{ mr: 2, /*display: { sm: 'none' }*/ }}
                    >
                        <MenuIcon />
                    </IconButton>
                    {accountType === "business" ?
                        <Typography variant="h6" noWrap component="div">
                            Business
                        </Typography>
                        :
                        <Typography variant="h6" noWrap component="div">
                            Client
                        </Typography>}
                    <Box sx={{ flexGrow: 1 }} />
                    <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {/* <IconButton size="large" aria-label="show 4 new mails" color="inherit">
                            <Badge badgeContent={4} color="error">
                                <MailIcon />
                            </Badge>
                        </IconButton> */}
                        <IconButton
                            size="large"
                            aria-label="show 17 new notifications"
                            color="inherit"
                        >
                            <Badge badgeContent={20} color="error">
                                <NotificationsIcon />
                            </Badge>
                        </IconButton>
                        <IconButton
                            size="large"
                            // edge="end"
                            aria-label="account of current user"
                            // aria-controls={menuId}
                            // aria-haspopup="true"
                            // onClick={handleProfileMenuOpen}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                        <IconButton
                            size="large"
                            edge="end"
                            aria-label="log out button"
                            // aria-haspopup="true"
                            color="inherit"
                            onClick={handleLogOut}
                        >
                            <ExitToAppIcon />
                        </IconButton>
                    </Box>
                    <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="show more"
                            aria-controls={mobileMenuId}
                            aria-haspopup="true"
                            onClick={handleMobileMenuOpen}
                            color="inherit"
                        >
                            <MoreIcon />
                        </IconButton>
                    </Box>
                </Toolbar>
            </AppBar>
        </div>
    );

    const contentBusiness = (
        <div>
            <Box component="main" sx={{ flexGrow: 1, p: 3, height: '100vh', overflow: 'auto' }}>
                <Toolbar />
                {showManageSpots ? <ManageSpots /> : <div />}
                {showStatistics ? <Statistics /> : <div />}
            </Box>
        </div>
    )

    const contentClient = (
        <div>
            <Box component="main" sx={{ flexGrow: 1, p: 3, height: '100vh', overflow: 'auto' }}>
                <Toolbar />
                {showSpots ? <Spots /> : <div />}
                {showReservations ? <ManageReservations /> : <div />}
            </Box>
        </div>
    )

    const content = (
        <div>
            {accountType === "business" ? contentBusiness : contentClient}
        </div>
    );

    return (
        <div>
            <Box sx={{ display: 'box', backgroundColor: (theme) => theme.palette.mode === 'light' ? theme.palette.grey[100] : theme.palette.grey[900] }}>
                <CssBaseline />
                {header}
                {renderMobileMenu}
                {renderMenu}
                {sidebar}
                {content}
            </Box>
        </div>
    )
}