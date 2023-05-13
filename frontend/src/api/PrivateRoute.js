import React,{ useState,useContext,useEffect } from 'react'
import { Outlet,Navigate } from 'react-router-dom'
import { AccountContext } from "./Account";

const PrivateRoute=({children}) =>{
  // let {authTokens}=useContext(AccountContext)

  return (
    localStorage.getItem("authTokens") ? <Outlet/>: <Navigate to="/" />
  )
}

export default PrivateRoute;