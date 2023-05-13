import { useState } from "react";
import { Button, ListItem, ListItemButton, ListItemIcon, MenuItem, Modal } from "@mui/material";
import EditIcon from '@mui/icons-material/Edit';
import styled from "@emotion/styled";
import EditTaskForm from "./edittaskform";

function EditTaskPopup(props) {

    const [open, setOpen] = useState(false);

    return (
        <div>
            <MenuItem onClick={() => setOpen(true)}>
                <ListItemIcon sx={{justifyContent: "center"}}>
                    <EditIcon/>
                </ListItemIcon>
                Edit
            </MenuItem>

            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div>
                    <EditTaskForm task={props.task} activateClose={() => setOpen(false)}/>
                </div>
            </Modal>
        </div>
    );
}

export default EditTaskPopup;