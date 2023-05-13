import { useLocation } from 'react-router-dom';
import UserPool from "../../api/UserPool";
import React, {useState,useContext} from 'react';
import { useNavigate } from "react-router-dom";
import { Box, TextField, Stack, Button, Link } from "@mui/material";
import {CognitoUser} from 'amazon-cognito-identity-js';
import { AccountContext } from "../../api/Account";

const Verify = () => {
    const [code,setCode]=useState('');
    const navigate = useNavigate();
    const {state} = useLocation();
    const verifyAccount = (e) => {
        e.preventDefault();
        const user = new CognitoUser({
          Username: state.userName,
          Pool: UserPool,
        });
        user.confirmRegistration(code, true, (err, data) => {
          if (err) {
            console.log(err.message);
            alert("Couldn't verify account");
            
          } else {
              console.log(data);
              alert('Account verified successfully');
              navigate("/login")
          }
        })
      };
    return (
        <div className='verify'>
          <Box sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'white',
            boxShadow: 3,
            padding: '2vw',
            borderRadius: '2em'
        }}>
            <h1> Verify </h1>
            <Stack spacing={2}>
                <TextField
                    id="verify"
                    label="verify"
                    value={code}
                    onChange={(event) => {setCode(event.target.value);}}
                />
                <Button variant="contained" color="primary" sx={{borderRadius: '1em'}} onClick={verifyAccount}> Verify </Button>
            </Stack>
        </Box>
        </div>
    )
}

export default Verify