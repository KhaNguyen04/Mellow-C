import { useState } from "react";
import AddTaskForm from "./addtaskform";
import { Button, ListItemButton, Modal } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import styled from "@emotion/styled";

function AddTaskPopup(props) {

    const [open, setOpen] = useState(false);

    const NavbarItemButton = styled(ListItemButton)(({ theme }) => ({
        paddingTop: "0.2em",
        paddingLeft: "0.5em",
        paddingRight: "0.5em",
        paddingBottom: "0.2em",
        borderRadius: "1em",
        '&.Mui-selected, &.Mui-selected:hover': {
          backgroundColor: props.listItemColorSelected
        },
        '&:hover': {
          backgroundColor: props.listItemColorHover
        }
      }));

    return (
        <div>
            {/*<Button variant='contained' onClick={() => setOpen(true)} style={{"backgroundColor": "#fffadf"}}>Add Task</Button>*/}
            {<NavbarItemButton sx={{justifyContent: "center", padding: "0.5em"}} onClick={() => setOpen(true)}>
                <AddIcon/>
            </NavbarItemButton>}
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div>
                    <AddTaskForm activateClose={() => setOpen(false)}/>
                </div>
            </Modal>
        </div>
    );
}

export default AddTaskPopup;