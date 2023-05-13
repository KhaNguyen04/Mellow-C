import { Outlet } from "react-router-dom";
import Navbar from "./navbar";
import '../App.css';
import { Box } from "@mui/material";

function NavbarPage (props) {
    return (
        <Navbar>
            <Box>
                <Outlet/>
            </Box>
        </Navbar>
    );
}

export default NavbarPage;