import * as React from 'react';

import AddTaskPopup from '../components/addtaskpopup';
import TaskView from '../components/taskview';

import { Link } from 'react-router-dom';
import { Box, Stack } from '@mui/material';

const Tasks = (props) => {
    return (
        <Box
            sx={{ 
                ml: "5vw",
                mr: "5vw",
                width: {xs: "calc(100vw - 5vw - 5vw)", sm: "calc(100vw - 5vw - 5vw)", md: "calc(100vw - 240px - 5vw - 5vw - 5vw)"},
            }}
        >
            <Stack direction={"row"} justifyContent={"center"} alignItems={"center"}>
                {props.icon}
                <h2 style={{ textAlign: "center", marginLeft: "0.5em" }}>{props.id}</h2>
            </Stack>
            <TaskView key={props.id} id={props.id} type={props.type} viewType={props.viewType}/>
        </Box>
    );
}

export default Tasks;