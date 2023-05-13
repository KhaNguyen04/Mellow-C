import './App.css';

import { BrowserRouter as Router, Routes, Route, useLocation,Navigate } from 'react-router-dom';
// import { Redirect } from "react-router-dom"; 
import Box from '@mui/material/Box';
import { Account } from './api/Account';
import Home from './pages/home';
import Tasks from './pages/tasks';
import Login from './pages/auth/login';
import NavbarPage from './components/navbar_page';
import Register from './pages/auth/register';
import Verify from './pages/auth/verify';
import PrivateRoute from './api/PrivateRoute';
import PrivateRoute2 from './api/PrivateRoute';
import React, {useState,useEffect} from "react";
import ForgotPassword from "./pages/auth/ForgotPassword";

// ------------------------------------- BEGIN THEME --------------------------------------- //
import { createTheme } from "@mui/material/styles";
import { CssBaseline, ThemeProvider } from "@mui/material";
import TasksByCategory from './pages/tasks_by_category';
import NewCalendar from './components/newcalendar';

import HomeIcon from '@mui/icons-material/Home';
import AppsIcon from '@mui/icons-material/Apps';
import TodayIcon from '@mui/icons-material/Today';
import UpcomingIcon from '@mui/icons-material/Upcoming';
import EventRepeatIcon from '@mui/icons-material/EventRepeat';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { Folder } from '@mui/icons-material';

export const appTheme = createTheme({
    palette: {
      primary: {
        light: '',
        main: '#fff281',
        dark: ''
      },
      secondary: {
        main: '#edf2ff',
      },
    },
    appbar: {
      main: '#ffffff'
    }
});
// --------------------------------------- END THEME ---------------------------------------- //


function App() {
  // useEffect(()=> {
  //   if (localStorage.getItem("authTokens")){    
  //     getTodoList()
  //   }
  // }, [localStorage.getItem("authTokens")])
  // let getTodoList= async() =>{
  //     let response = await fetch(`https://34ydqr7kf5.execute-api.us-west-2.amazonaws.com/v1/task`, {
  //         method: "GET",
  //         headers: {
  //             "Content-Type":'application/json',
  //             "Authorization":token
  //         },
  //         body: JSON.stringify({ email: 'TestingEmail@gmail.com' }),
  //     });
  //     let data=await response.json();
  // }
  
  return (
    <ThemeProvider theme={appTheme}>
      <CssBaseline enableColorScheme/>
      <Box sx={{display: 'flex', backgroundColor: "#fdfdfd" }}>
        <Router>
        <Account>

          {/* ALL pages will display on part of the website (right of sidebar). */}
          <div>
            <Routes>
                <Route element={<PrivateRoute />}>
                  <Route element={<NavbarPage/>}>
                    <Route path="/home" element={<Home id="Home" icon={<HomeIcon/>} viewType="list"/>}> </Route>
                    <Route path="/tasks">
                      <Route path="all" element={<Tasks id="All" icon={<AppsIcon/>} type="all" viewType="list"/>}> </Route>
                      <Route path="today" element={<Tasks id="Today" icon={<TodayIcon/>} type="today" viewType="list"/>}> </Route>
                      <Route path="upcoming" element={<Tasks id="Upcoming" icon={<UpcomingIcon/>} type="upcoming" viewType="list"/>}> </Route>
                      <Route path="past" element={<Tasks id="Past" icon={<EventRepeatIcon/>} type="past" viewType="list"/>}> </Route>
                      <Route path="finished" element={<Tasks id="Finished" icon={<AssignmentTurnedInIcon/>} type="finished" viewType="list"/>}> </Route>
                      <Route path="category/:id" element={<TasksByCategory viewType="list"/>}> </Route>
                    </Route>
                    <Route path="calendar" element={<Tasks viewType="calendar"/>}> </Route>
                  </Route>
                </Route>
                <Route exact path="/"  element={localStorage.getItem("authTokens") ? <Navigate to="/home" /> : <Login/> }></Route>

                <Route path="/register" element={localStorage.getItem("authTokens") ? <Navigate to="/home" /> : <Register/>}> </Route>
                <Route path="/verify" element={localStorage.getItem("authTokens") ? <Navigate to="/home" /> : <Verify/>}> </Route> 
                <Route path="/forgot-password" element={localStorage.getItem("authTokens") ? <Navigate to="/home" /> : <ForgotPassword/>}> </Route>
                <Route  exact path="/login"  element= {<Login/>}></Route>
                <Route path="*" element={localStorage.getItem("authTokens") ? <Navigate replace to="/home" /> : <Navigate to ="/" />}> </Route>

                {/* <Route path="*" element={<Verify/>}> </Route> */}

                {/* <Route element={<NavbarPage/>}>
                  <Route path="/home" element={<PrivateRoute><Home/></PrivateRoute>}> </Route>
                  <Route path="/tasks" element={<PrivateRoute><Tasks/></PrivateRoute>}> </Route>
                  <Route path="*" element={<PrivateRoute><Home/></PrivateRoute>}> </Route>
                </Route> */}
            </Routes>
          </div>
          </Account>

        </Router>
      </Box>
    </ThemeProvider>
  );
}

export default App;
