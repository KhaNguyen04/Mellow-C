import { useState, useContext, useEffect } from "react";
import { Button, Modal, IconButton, Popover, Typography, Menu, MenuItem, ListItemIcon } from "@mui/material";
import { AccountContext } from '../api/Account';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LogoutIcon from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';

import {
    useQueryClient
} from "@tanstack/react-query";

import {
    useTheme
  } from "@mui/material";

function UserButton() {

    const theme = useTheme();

    const {logOut, getSession} = useContext(AccountContext);

    const queryClient = useQueryClient();

    const [name, setName] = useState("N");

    useEffect(() => {
        getSession().then(async({IdToken})=>{
            setName(JSON.parse(atob(IdToken.split('.')[1]))["name"][0]);
        });
    })

    const [open, setOpen] = useState(false);

    const [currentTarget, setCurrentTarget] = useState(null);

    const handleClick = (event) => {
        setOpen(true);
        setCurrentTarget(event.currentTarget);
    };
          
    const handleClose = () => {
        setOpen(false);
    };
    
    const handleProfile = () => {
        handleClose();
    };

    const handleLogout = () => {
        queryClient.removeQueries(['categories']);
        queryClient.removeQueries(['tasklist']);
        logOut();
        handleClose();
    };

    return (
        <div>
            <IconButton
                color="inherit"
                edge="start"
                onClick={handleClick}
            >
                <Avatar sx={{ bgcolor: theme.palette.primary.main, color: "black", border: "1px solid black" }}> {name} </Avatar>
            </IconButton>
            <Menu
                anchorEl={currentTarget}
                open={open}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                sx={{
                    mt: "0.5em"
                }}
            >
                <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                        <PersonOutlineIcon fontSize="small" />
                    </ListItemIcon>
                    Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                </MenuItem>
            </Menu>
        </div>
    );
}

export default UserButton;