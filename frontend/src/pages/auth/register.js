import { Box, TextField, Stack, Button, Link,Typography, Hidden } from "@mui/material";
import {CognitoUserAttribute} from 'amazon-cognito-identity-js';
import {
    useMutation,
    useQueryClient
} from "@tanstack/react-query";
import { useState } from "react";
import * as React from 'react';
import { useNavigate } from "react-router-dom";
// import UserPool from ".../api/UserPool";
import UserPool from "../../api/UserPool";

const Register = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle mutating/changing data
    const [loginForm, setLoginForm] = useState({
        'userName': '',
        'email': '',
        'password': '',
        'password2':'',
        'name':'',
        'other':''
    });
    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    const [errors,setErrors]=useState({})
    const validate=(values)=>{    
        let errors = {};
        if (!values.userName.trim()) {
            errors.username = 'Username required';
        } else if (values.userName.length<4){
            errors.username = 'Username required at least 4 characters';
        }
        else if (values.userName.length>34){
            errors.username = 'Username too long';
        }
        if (!values.password) {
            errors.password = 'Password required';
        } else if (values.password.length < 6) {
            errors.password = 'Password must be at leaast 6 characters';
        } else if (values.password.length > 34) {
            errors.password = 'Password too long';
        }
        if (!values.email) {
            errors.email = 'Please enter an email';
        } else if (!isValidEmail(values.email)) {
            errors.email = 'Email invalid';
        }
    
        if (!values.password2) {
            errors.password2 = 'Please confirm your password';
        } else if (values.password2 !== values.password) {
            errors.password2 = 'Passwords do not match';
        }
        if (!values.name.trim()) {
            errors.name = 'Please enter your name';
        } else if (values.name.length>25){
            errors.name = 'Please provide a shorter name'
        }
        return errors;
    }
    const validateEmail=(values)=>{    
        let errors = {};
        if (values==="InvalidLambdaResponseException"){
            errors.email='Email already exists'
        }
        else if (values==="UsernameExistsException"){
            errors.username="User already exists"
        }
        else if (values==="InvalidPasswordException"){
            errors.password="Invalid password"
            errors.other="Password needs a number, a lowercase letter and an uppercase letter"
        }
        else{
            errors.other="Please try again"
        }

        return errors
    }

    const setLoginFieldProperty = (value) => {
        setLoginForm(loginField => ({
            ...loginField,
            ...value
        }));
    };
    // async function emailChecking(url = '',email) {
    //     let response = await fetch(url, {
    //       method: "POST",
    //       headers: {
    //           "Content-Type":'application/json',
    //         //   "authorizationToken":'Mellow-Auth',
    //       },
    //       body:JSON.stringify({email})
    //   });
    //     let data=await response.json();
    //     console.log(data)
    //     // if(response.status === 200){
            
    //     // }
    //     data=JSON.stringify(data)
    //     console.log(data)
    //     return data
    // }
    const navigate = useNavigate();

    let attributeList = [];
    const submitSignUp= event=>{
        event.preventDefault();
        let error=validate(loginForm)
        setErrors(error)
        attributeList.push(new CognitoUserAttribute({Name:'email',Value:loginForm.email}))
        attributeList.push(new CognitoUserAttribute({Name:'name',Value:loginForm.name}))
        if (Object.keys(error).length===0){
                UserPool.signUp(loginForm.userName,loginForm.password,attributeList,null,(err,data)=>{
                    if (err) {
                        console.log(err.name)

                        setErrors(validateEmail(err.name))
                    }
                    else{
                        console.log(data)
                        navigate("/verify",{ state: { userName: loginForm.userName,email:loginForm.email,name: loginForm.name} })
                    }
                })

            // setIsSubmitting(true)
        }
    }

    return (
        <div className="register" >
            <p className="logo" style={{  
                position: 'absolute',
                marginLeft:'7rem',
                marginTop:'3rem',
                fontWeight:'bold'
                }}> Logo</p>

            <div className="content" >

            <h1 class="title">Mellow</h1>


            <Box className="form" sx={{
                // position: 'absolute',
                // left: '50%',
                // marginTop: '20em',
                // transform: 'translate(-50%, -50%)',
                // width: 400,
                // bgcolor: 'white',
                // boxShadow: 3,
                // padding: '2vw',
                // borderRadius: '2em',
                // paddingBottom: 2,
                // paddingTop:1.2,

            }}>

                <h1 style={{ margin: 0,textAlign: "center",paddingBottom:10}}> Register </h1>
                <Stack  style={{marginTop:'0.7em' }} spacing={0.5}>
                    <TextField
                        style={{ marginLeft: '1em',marginRight: '1em' }}
                        size="small"
                        id="username"
                        label="Username"
                        value={loginForm.userName}
                        onChange={(event) => {setLoginFieldProperty({'userName': event.target.value});}}
                        error={errors.username}
                        helperText={errors.username ? errors.username:" "}
                        margin='none'
                        
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
                        style={{ marginLeft: '0.8em',marginRight: '0.8em' }}
                        size="small"
                        id="email"
                        label="Email Address"
                        value={loginForm.email}
                        onChange={(event) => {setLoginFieldProperty({'email': event.target.value});}}
                        error={errors.email}
                        helperText={errors.email ? errors.email:" "}
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
                        style={{ marginLeft: '0.8em',marginRight: '0.8em' }}
                        size="small"
                        id="password"
                        label="Password"
                        value={loginForm.password}
                        onChange={(event) => {setLoginFieldProperty({'password': event.target.value});}}
                        error={errors.password}
                        helperText={errors.password ? errors.password:" "}
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
                        style={{ marginLeft: '0.8em',marginRight: '0.8em' }}
                        size="small"
                        id="password2"
                        label="Confirm Password"
                        value={loginForm.password2}
                        onChange={(event) => {setLoginFieldProperty({'password2': event.target.value});}}
                        error={errors.password2}
                        helperText={errors.password2 ? errors.password2:" "}
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
                        style={{ marginLeft: '0.8em',marginRight: '0.8em' }}
                        size="small"
                        id="name"
                        label="Name"
                        value={loginForm.name}
                        onChange={(event) => {setLoginFieldProperty({'name': event.target.value});}}
                        error={errors.name}
                        helperText={errors.name ? errors.name: " "}
                        sx={{
                            "& .MuiOutlinedInput-root.Mui-focused": {
                                "& > fieldset": {
                          borderColor: 'gray',
                                }
                              },
                              "& .MuiInputLabel-root.Mui-focused": {color: 'grey'},
                        }}
                    />
                    {errors.other? <div style={{
                    color:"red",
                    textAlign:"center",
                    margin:0,padding:0,paddingLeft:'1.5em',paddingRight:'1.5em',fontSize:'0.8em'
                }}>{errors.other} </div>: <div  style={{
                        userSelect: "none", margin:0,padding:0}}>&nbsp;</div>}
                    <Box textAlign='center' 
 >
                    <Button variant="contained" style={{  fontFamily:'Varela Round',fontWeight: '600',marginTop:'0',width: '15em', height: '2.3em',marginBottom:'0em',textTransform: 'none', backgroundColor: "#FEC887",
}}  sx={{borderRadius: '1em','&:hover': {
    filter: "brightness(85%)"
}, }} onClick={submitSignUp} > Register </Button>
                    </Box>
                    <div style={{ margin:0,padding:0,textAlign:"center"}} >
                        <p style={{ marginTop:'1em',marginBottom:'0',padding:'0',fontSize:'0.8em',paddingTop:'0.5'}}> Already have an account? <Link className="register-button" component="button" onClick={() => {navigate("/login")}} style={{textDecoration: 'none', color:'black',  fontWeight: 'bold'
 }}> Log in </Link></p>
                    </div>
                    {/* <Link  component="button" onClick={() => {navigate("/login")}}>   </Link> */}
                </Stack>
            </Box>
            </div>
            <p className="dev" >Develop by Albert Lu, David Sambilay and Kha Nguyen</p>

        </div>
    );
}

export default Register;