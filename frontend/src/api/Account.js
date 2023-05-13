import React, {createContext,useState,useEffect} from 'react';
import {CognitoUser, AuthenticationDetails} from 'amazon-cognito-identity-js';
import UserPool from "./UserPool";
import { useNavigate} from "react-router-dom";
const AccountContext=createContext();
const Account= props =>{
    // let [authTokens, setAuthTokens] = useState(()=> localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null)
    const navigate = useNavigate();
    const getSession=async()=>
        await new Promise((resolve, reject) => {
            const user=UserPool.getCurrentUser();
            if (user){
                user.getSession((err,session)=>{
                    if (err){
                        // setAuthTokens(null)
                        localStorage.removeItem('authTokens')
                        navigate('/')
                        reject();
                    } else{
                        // setAuthTokens(session)
                        localStorage.setItem('authTokens', JSON.stringify(session))
                        const AccessToken=session.getAccessToken().getJwtToken()
                        const IdToken=session.getIdToken().getJwtToken()
                        resolve({user,AccessToken,IdToken,session});
                    }
                })
            }else{
                reject();
            }
        })
    const authenticate = async (Username, Password) =>
        await new Promise((resolve, reject) => {
        const user = new CognitoUser({ Username:Username, Pool: UserPool });
        const authDetails = new AuthenticationDetails({ Username:Username, Password:Password });

        user.authenticateUser(authDetails, {
            onSuccess: data => {
            console.log('onSuccess:', data);
            resolve(data);
            },

            onFailure: err => {
            console.error('onFailure:', err.message);
            reject(err);
            },

            newPasswordRequired: data => {
            console.log('newPasswordRequired:', data);
            resolve(data);
            }
        });
        });

    const resendCode = async (Username) =>
        await new Promise((resolve, reject) => {
        const user = new CognitoUser({ Username:Username, Pool: UserPool });
        const authDetails = new AuthenticationDetails({ Username:Username });

        user.authenticateUser(authDetails, {
            onSuccess: data => {
            console.log('onSuccess:', data);
            resolve(data);
            },

            onFailure: err => {
            console.error('onFailure:', err.message);
            reject(err);
            },

            newPasswordRequired: data => {
            console.log('newPasswordRequired:', data);
            resolve(data);
            }
        });
        });

    
    const logOut=()=>{
        const user=UserPool.getCurrentUser();
        if (user){

            localStorage.removeItem("authTokens")

            user.signOut();
            // setAuthTokens(null)
            navigate('/login')
            window.location.reload()
        }
    }
    useEffect(() => {
        getSession().catch(error => console.log(error));
      }, []);
    return(
        <AccountContext.Provider value={{authenticate,logOut,getSession}}>
            {props.children}
        </AccountContext.Provider>
    );
};
export {Account,AccountContext};