import React, { useState } from "react";
import { CognitoUser } from "amazon-cognito-identity-js";
import UserPool from "../../api/UserPool";
import { Box, TextField, Stack, Button, Link,Typography  } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default () => {
  const navigate = useNavigate();
  const [stage, setStage] = useState(1); // 1 = email stage, 2 = code stage
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // function getUser () {
  //   return new CognitoUser({
  //     Username: email.toLowerCase(),
  //     UserPool
  //   });
  // };

  const sendCode = event => {
    event.preventDefault();
    console.log(email)
    var userData = {
      Username: email.toLowerCase(),
      Pool: UserPool
    };
    var getUser = new CognitoUser(userData);

    getUser.forgotPassword({
      onSuccess: data => {
        console.log("onSuccess:", data);
      },
      onFailure: err => {
        console.error("onFailure:", err);
      },
      inputVerificationCode: data => {
        console.log("Input code:", data);
        setStage(2);
      }
    });
  };

  const resetPassword = event => {
    event.preventDefault();

    if (password !== confirmPassword) {
      console.error("Passwords are not the same");
      return;
    }
    var userData = {
      Username: email.toLowerCase(),
      Pool: UserPool
    };
    var getUser = new CognitoUser(userData);

    getUser.confirmPassword(code, password, {
      onSuccess: data => {
        console.log("onSuccess:", data);
        navigate('/login')
      },
      onFailure: err => {
        console.error("onFailure:", err);
      }
    });
  };
  function refreshPage() {
    window.location.reload(true);
  }
  
  return (
    <div className="forgot-pw">
      {stage === 1 && 
      <Box className="forgot-pw-form">
              <h1  style={{textAlign: 'center', marginTop:'0', paddingTop:'0'}}> Reset Password </h1>
              <p style={{textAlign: 'left'}}> Please enter username. A verification code will be sent to the signed up email</p>
                  <TextField
              style={{ marginLeft: '1em',marginRight: '1em' }}
              size="small"
              // label="Username"
              InputLabelProps={{shrink: false}} 
              onChange={event => setEmail(event.target.value)}
              label={email=== "" ? "Username": ""}
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused": {
                    "& > fieldset": {
              borderColor: 'gray',
                    }
                  },
                  "& .MuiInputLabel-root.Mui-focused": {color: 'grey'},
            }}
              />
              <div  style={{marginTop:'1.2em', display:'flex', gap:'1em', flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
              <Button variant="contained" 
                    onClick={() => navigate('/login')}
                    color="primary" 
                    style={{  fontFamily:'Varela Round',
                    fontWeight: '600',marginTop:'0',
                    textTransform: 'none', 
                    backgroundColor: "#D3D3D3"}}  
                    sx={{borderRadius: '1em','&:hover': {
                      filter: "brightness(80%)"
                 }, }} 
                     InputLabelProps={{shrink: false}} 
                     type="submit"> Cancel </Button>
                <Button variant="contained" color="primary" 
                    style={{  fontFamily:'Varela Round',
                    fontWeight: '600',
                    // width: '15em', 
                    textTransform: 'none', 
                    backgroundColor: "#FEC887",}}  
                    sx={{borderRadius: '1em','&:hover': {
                      filter: "brightness(80%)"
                 }, }} 
                    onClick={sendCode}
                    > Send 
                     </Button>
              </div>
      </Box>
      // (
      //   <form onSubmit={sendCode}>
      //     <input
      //       value={email}
      //       onChange={event => setEmail(event.target.value)}
      //     />
      //     <button type="submit">Send verification code</button>
      //   </form>
      // )
      }

      {stage === 2 && 
            <Box className="forgot-pw-form">
              <h1  style={{textAlign: 'center', marginTop:'0', paddingTop:'0'}}> Reset Password </h1>
              <Stack spacing={3}>

              <TextField
              style={{ marginLeft: '1em',marginRight: '1em' }}
              size="small"
              label="Code"
              onChange={event => setCode(event.target.value)}
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused": {
                    "& > fieldset": {
              borderColor: 'gray',
                    }
                  },
                  "& .MuiInputLabel-root.Mui-focused": {color: 'grey'},
            }}
              />
                <TextField
              style={{ marginLeft: '1em',marginRight: '1em' }}
              size="small"
              label="New Password"
              onChange={event => setPassword(event.target.value)}
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused": {
                    "& > fieldset": {
              borderColor: 'gray',
                    }
                  },
                  "& .MuiInputLabel-root.Mui-focused": {color: 'grey'},
            }}
              />
              <TextField
              style={{ marginLeft: '1em',marginRight: '1em' }}
              size="small"
              label="Confirm Password"
              onChange={event => setConfirmPassword(event.target.value)}
              sx={{
                "& .MuiOutlinedInput-root.Mui-focused": {
                    "& > fieldset": {
              borderColor: 'gray',
                    }
                  },
                  "& .MuiInputLabel-root.Mui-focused": {color: 'grey'},
            }}
              />
              </Stack>
              <div  style={{marginTop:'1.2em', display:'flex', gap:'1em', flexDirection: 'row', justifyContent: 'center', alignItems:'center'}}>
              <Button variant="contained" 
                      onClick={refreshPage}
                    color="primary" 
                    style={{  fontFamily:'Varela Round',
                    fontWeight: '600',marginTop:'0',
                    textTransform: 'none', 
                    backgroundColor: "#D3D3D3"}}  
                    sx={{borderRadius: '1em','&:hover': {
                      filter: "brightness(80%)"
                 }}} 
                     InputLabelProps={{shrink: false}} 
                     type="submit"> Back </Button>
                <Button variant="contained" color="primary" 
                    style={{  fontFamily:'Varela Round',
                    fontWeight: '600',
                    // width: '15em', 
                    textTransform: 'none', 
                    backgroundColor: "#FEC887",}}  
                    sx={{borderRadius: '1em','&:hover': {
                      filter: "brightness(80%)"
                 }}} 
                    onClick={resetPassword}
                    > Confirm
                     </Button>
              </div>
            </Box>
            
      // (
      //   <form onSubmit={resetPassword}>
      //     <input value={code} onChange={event => setCode(event.target.value)} />
      //     <input
      //       value={password}
      //       onChange={event => setPassword(event.target.value)}
      //     />
      //     <input
      //       value={confirmPassword}
      //       onChange={event => setConfirmPassword(event.target.value)}
      //     />
      //     <button type="submit">Change password</button>
      //   </form>
      // )
      }
    </div>
  );
};