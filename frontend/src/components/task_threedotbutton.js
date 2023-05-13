import { useState, useContext } from "react";
import { Button, Modal, IconButton, Popover, Typography, Menu, MenuItem, ListItemIcon } from "@mui/material";
import { AccountContext } from '../api/Account';

import FormatBoldIcon from '@mui/icons-material/FormatBold';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Avatar from '@mui/material/Avatar';

import {
    useTheme
  } from "@mui/material";
import { MoreVert } from "@mui/icons-material";
import EditTaskPopup from "./edittaskpopup";

function ThreeDotButtonTask(props) {

    const handleDeleteTask = props.handleDeleteTask;

    const theme = useTheme();

    const [open, setOpen] = useState(false);

    const handleClick = (event) => {
        event.stopPropagation();
        setOpen(event.currentTarget);
    };
          
    const handleClose = (event) => {
        event.stopPropagation();
        setOpen(false);
    };

    const handleDelete = (event) => {
        event.stopPropagation();
        handleDeleteTask(event);
    };

    return (
        <div>
            <IconButton
                color="inherit"
                edge="start"
                onClick={handleClick}
            >
                <MoreVert/>
            </IconButton>
            <Menu
                anchorEl={open}
                open={(open != false) ? true : false}
                onClose={handleClose}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                sx={{
                    mt: "0.5em"
                }}
            >
                <EditTaskPopup task={props.task}/>
                <MenuItem onClick={handleDelete}>
                    <ListItemIcon sx={{justifyContent: "center"}}>
                        <DeleteIcon/>
                    </ListItemIcon>
                    Delete
                </MenuItem>
            </Menu>
        </div>
    );
}

export default ThreeDotButtonTask;