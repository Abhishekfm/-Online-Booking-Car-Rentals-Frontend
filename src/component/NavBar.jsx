import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../contexts/MyContext";
import { useContext } from "react";
import { useEffect } from "react";

export function NavBar(props){
    const [user, setUser] = useContext(MyContext)
    const [ myRole, setMyRole] = useState("")
    async function logMeOut(){
      try {
        const res = await axios.get(`${props.BaseUrl}/auth/logout`,
        { withCredentials: true });
        if(!res){
          return
        }else{
          // Cookies.remove('token', { path: '' }) 
          console.log(res);
        }
      } catch (error) {
        console.log(error);
      }
    }
    useEffect(()=>{
      async function MyRole(){
        try {
          const res = await axios.get(`${props.BaseUrl}/auth/dashboard`,{withCredentials:true})
          if(!res){
            return
          }else{
            setMyRole(res.data.role)
            console.log(res);
          }
        } catch (error) {
          console.log(error);
        }
      }
      MyRole()
    },[])
    return(
        <>
        <nav className="bg-slate-800 text-white py-3 px-4 flex justify-between items-center">
            <Link className="text-lg font-semibold tracking-wide uppercase" to="/">DriveMe</Link>
            <div className="hidden md:flex">
              <Link className="mx-4 text-base font-medium tracking-wide uppercase" to="/" >Home</Link>
              {myRole === "ADMIN" || myRole === "USER"?<Link className="mx-4 text-base font-medium tracking-wide uppercase" to="/order" >Order</Link>:""}
              {myRole === "ADMIN"?<Link className="mx-4 text-base font-medium tracking-wide uppercase" to="/users" >Users</Link>:""}
              {myRole === "ADMIN"?<Link className="mx-4 text-base font-medium tracking-wide uppercase" to="/admin" >Admin Controller</Link>:""}
              {myRole === "ADMIN"?<Link className="mx-4 text-base font-medium tracking-wide uppercase" to="/allorder" >All Order</Link>:""}
              {myRole === "ADMIN" || myRole === "USER"?<Link onClick={()=>{logMeOut()}} className="mx-4 text-base font-medium tracking-wide uppercase" to="/login" >LogOut</Link>:<Link className="mx-4 text-base font-medium tracking-wide uppercase" to="/login" >LogIn</Link>}
              {myRole === "NOROLE"?<Link className="mx-4 text-base font-medium tracking-wide uppercase" to="/signup" >SIGNUP</Link>:""}
            </div>
            <button className="md:hidden focus:outline-none" aria-label="Menu">
              <svg className="h-6 w-6 fill-current" viewBox="0 0 24 24">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
        </nav>

        </>
    )
}