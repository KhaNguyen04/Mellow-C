import { useState } from "react";
import DeleteCategoryForm from "./deletecategoryform";
import { Button, Modal } from "@mui/material";

function DeleteCategoryPopup(props) {

    const [open, setOpen] = useState(false);

    return (
        <div>
            <Button variant='contained' onClick={() => setOpen(true)} style={{"backgroundColor": "red", "color": "white"}}>Delete Category</Button>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <div>
                    <DeleteCategoryForm categoryID={props.categoryID} activateClose={() => setOpen(false)}/>
                </div>
            </Modal>
        </div>
    );
}

export default DeleteCategoryPopup;