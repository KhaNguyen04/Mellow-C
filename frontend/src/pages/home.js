import React, {useState,useContext,useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import TaskView from '../components/taskview';
import { AccountContext } from '../api/Account';
import { useNavigate } from 'react-router-dom';
import { dispatch } from 'react';
import { Button, Box, Stack } from '@mui/material';
const Home = (props) => {

    return (
        <div className="home">
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
                <TaskView viewType={props.viewType} type="today"/>
            </Box>
        </div>  
    );
}

export default Home;