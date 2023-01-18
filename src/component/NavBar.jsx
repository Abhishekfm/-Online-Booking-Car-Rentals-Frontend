import axios from "axios";
import React from "react";
import { Link } from "react-router-dom";
import Cookies from 'js-cookie'

export function NavBar(props){
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
    return(
        <>
        <nav className="bg-slate-800 text-white py-3 px-4 flex justify-between items-center">
            <Link className="text-lg font-semibold tracking-wide uppercase" to="/home">DriveMe</Link>
            <div className="hidden md:flex">
              <Link className="mx-4 text-base font-medium tracking-wide uppercase" to="/home" >Home</Link>
              <Link className="mx-4 text-base font-medium tracking-wide uppercase" to="/home" >Order</Link>
              <Link className="mx-4 text-base font-medium tracking-wide uppercase" to="/admin" >Admin Controller</Link>
              <Link onClick={()=>{logMeOut()}} className="mx-4 text-base font-medium tracking-wide uppercase" to="/login" >LogOut</Link>
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