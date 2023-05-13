import { Box, TextField, Stack, Button, Link,Typography  } from "@mui/material";
import { AccountContext } from "../../api/Account";
import React, {useContext,useEffect} from 'react';
import { useState } from "react";
import UserPool from "../../api/UserPool";
import { useNavigate } from "react-router-dom";
// import './login.css'
const Login = () => {
    const [fpColor,setFpColor]=useState('blue')
    const [regColor,setRegColor]=useState('black')
    const [verifyLink,setVerifyLink]=useState(false)

    const navigate = useNavigate();
    // Handle mutating/changing data
    const [loginForm, setLoginForm] = useState({
        'userName': '',
        'password': ''
    });

    const setLoginFieldProperty = (value) => {
        setLoginForm(loginField => ({
            ...loginField,
            ...value
        }));
    };
    const [errors,setErrors]=useState(" ")
    const {authenticate,getSession}=useContext(AccountContext);

    const validate=(values)=>{    
        let errors = " ";
        if (!values.userName.trim() && !values.password.trim()){
            errors = 'Username and Password required';
        }
        else if(!values.userName.trim()) {
            errors = 'Username required';
        }
        else if (!values.password.trim()) {
            errors = 'Password required';
        }
        return errors;
    }
    const submitLogIn= event=>{
        event.preventDefault();
        let error = " ";
        error=validate(loginForm)
        setErrors(error)
        console.log("hello1")
        if (error===" "){
            console.log("hello3")
            authenticate(loginForm.userName,loginForm.password).then(data=>{
                console.log('Logged in!',data)
                // getSession().then(async({token})=>{
                //     console.log(token)
                //     let response = await fetch(`https://34ydqr7kf5.execute-api.us-west-2.amazonaws.com/v1/task`, {
                //     method: "GET",
                //     headers: {
                //       "Authorization":token
                //     },
                //   });
                //   let data=await response.json();
                //   navigate('/home',{state:{data:data}})
                //   })
                getSession().then(
                    navigate('/home')
                )
            }).catch(err=>{
                console.error(err.name)
                if (err.name==="NotAuthorizedException"){
                    setErrors("Incorrect username or password")
                }
                else if (err.name==="UserNotConfirmedException"){
                    setErrors("User is not confirmed")
                }
                else {
                    setErrors("Please try again!")
                }
            })
        }
        console.log("hello2")

    }

    return (
        <div className="login" style={{    
            }}>
            {!localStorage.getItem("authTokens")?
            <>
            <p className="logo" style={{  
                position: 'absolute',
                marginLeft:'7rem',
                marginTop:'3rem',
                fontWeight:'bold'
                }}> Logo</p>

            

            <div className="content" >
            <h1 class="title">Mellow</h1>
          {/* <p className="picture" style={{ }}>Picture</p> */}

            <Box className="form" >

                <h1  style={{textAlign: 'center'}}> Sign In </h1>
                <Stack spacing={3}>
                    <TextField
                    sx={{
                        "& .MuiOutlinedInput-root.Mui-focused": {
                            "& > fieldset": {
                      borderColor: 'gray',
                            }
                          },
                          "& .MuiInputLabel-root.Mui-focused": {color: 'grey'},
                    }}
                    // focused={{
                    //     "& .MuiInputLabel-root": {color: 'brown'},
                    //     "& .MuiOutlinedInput-root.Mui-focused": {
                    //     "& > fieldset": {
                    // borderColor: "brown"
                    //     }
                    //     }
                    // }}
                    // InputLabelProps={{style : {color : 'green'} }}
                    // sx={{
                    //     "& label": {
                    //       "&.Mui-focused": {
                    //         color: 'black'
                    //       }
                    //     }
                    //   }}
                    // InputLabelProps={{
                    //     style: { color: 'orange' },
                    //   }}
                    style={{ marginLeft: '1em',marginRight: '1em' }}
                    // InputLabelProps={{ shrink: true }}
                    size="small"
                    id="userName"
                    label="Username"
                    value={loginForm.userName}
                    onChange={(event) => {setLoginFieldProperty({'userName': event.target.value});}}
                    />
                    <TextField
                    style={{ marginLeft: '1em',marginRight: '1em' }}
                    sx={{
                        "& .MuiOutlinedInput-root.Mui-focused": {
                            "& > fieldset": {
                      borderColor: 'gray',
                            }
                          },
                          "& .MuiInputLabel-root.Mui-focused": {color: 'grey'},
                    }}
                    size="small"
                    id="password"
                    label="Password"
                    value={loginForm.password}
                    onChange={(event) => {setLoginFieldProperty({'password': event.target.value});}}
                    />
            {/* {errors && <Typography   
                variant='p'
                sx={{
                    color:"red",
                    textAlign:"center"
                }}>
                {errors}
          </Typography>} */}
          <div  style={{
                    marginTop:'0.7em',
                    color:"red",
                    textAlign:"center",
                    userSelect: "none",
                }}>{errors.replace(/ /g, "\u00A0")}</div>


                    <Box textAlign='center' style={{
                    marginTop:'0.4em',

                }}>
                    <Button variant="contained" color="primary" 
                    style={{  fontFamily:'Varela Round',
                    fontWeight: '600',marginTop:'0',
                    width: '15em', 
                    height: '2em',
                    marginBottom:'0em',
                    textTransform: 'none', 
                    backgroundColor: "#FEC887",}}  
                    sx={{borderRadius: '1em',
                        '&:hover': {
                        filter: "brightness(85%)"
                   },     }} 
                    onClick={submitLogIn }
                     type="submit"> Log in </Button>
                    </Box>

                    <Link component="button" onClick={() => {navigate("/forgot-password")}} style={{ textDecoration: 'none', color:'blue' }}> Forgot Password</Link>
                    <hr  style={{
                        marginLeft:'2em',
                        marginRight:'2em',
                        paddingTop:'0'
                    }}/>
                    <div style={{ margin:0,padding:0,textAlign:"center"}} >
                        <p style={{ marginTop:'1em',marginBottom:'0',padding:'0',fontSize:'0.8em',paddingTop:'0.5'}}> Don't have an account? <Link className="register-button" component="button" onClick={() => {navigate("/register")}} style={{textDecoration: 'none', color:'black',  fontWeight: 'bold'
 }}> Register </Link></p>
                    </div>
                </Stack>
            </Box>
            </div>
            <p className="dev" >Develop by Albert Lu, David Sambilay and Kha Nguyen</p>
            </>:<><h1>Already logged in, back to home page</h1>
                <button onClick={() => navigate('/') } className="logoutBut">Back to home page</button> 
                </>
            }
        </div>
        
    );
}

export default Login;