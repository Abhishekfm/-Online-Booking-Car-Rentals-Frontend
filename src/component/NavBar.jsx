import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../contexts/MyContext";
import { useContext } from "react";
import { useEffect } from "react";
import hamburger from "../images/hamburger.svg"

export function NavBar(props){
    const [user, setUser] = useContext(MyContext)
    const [ myRole, setMyRole] = useState("")
    const [resp, setResp] = useState(false)
    async function logMeOut(){
      try {
        const res = await axios.post(`${props.BaseUrl}/auth/logout`,
        { credentials: "include"});
        if(!res){
          return
        }else{
          // Cookies.remove('token', { path: '' }) 
          console.log(res);
          sessionStorage.clear()
          sessionStorage.removeItem("token");
        }
      } catch (error) {
        console.log(error);
      }
    }
    useEffect(()=>{
      async function MyRole(){
        try {
          const res = await axios.get(`${props.BaseUrl}/auth/dashboard`,{ withCredentials:true })
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
    function showResp(){
      if(resp === true){
        setResp(false)
        return
      }
      setResp(true)
    }
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
            <button className="md:hidden relative focus:outline-none" onClick={()=>{showResp(true)}} aria-label="Menu">
              <img src={hamburger} alt="" />
            </button>
        </nav>
        {resp?
              <div className="flex md:hidden shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] flex-col w-[210px] rounded-[10px] absolute right-3 top-16 z-10 gap-2 bg-[#fff]">
                  <Link className=" text-base font-medium px-4 py-1 w-full hover:bg-slate-200 text-[#000] tracking-wide uppercase" to="/" >Home</Link>
                  {myRole === "ADMIN" || myRole === "USER"?<Link className=" px-4 py-1 hover:bg-slate-200 text-base text-[#000] font-medium tracking-wide uppercase" to="/order" >Order</Link>:""}
                  {myRole === "ADMIN"?<Link className="px-4 py-1 text-base font-medium hover:bg-slate-200 tracking-wide text-[#000] uppercase" to="/users" >Users</Link>:""}
                  {myRole === "ADMIN"?<Link className="px-4 py-1 text-base font-medium hover:bg-slate-200 tracking-wide text-[#000] uppercase" to="/admin" >Admin Controller</Link>:""}
                  {myRole === "ADMIN"?<Link className="px-4 py-1 text-base font-medium hover:bg-slate-200 tracking-wide text-[#000] uppercase" to="/allorder" >All Order</Link>:""}
                  {myRole === "ADMIN" || myRole === "USER"?<Link onClick={()=>{logMeOut()}} className=" px-4 py-1 text-[#000] hover:bg-slate-200 text-base font-medium tracking-wide uppercase" to="/login" >LogOut</Link>:<Link className=" px-4 py-1 hover:bg-slate-200 text-[#000] text-base font-medium tracking-wide uppercase" to="/login" >LogIn</Link>}
                  {myRole === "NOROLE"?<Link className=" px-4 py-1 text-base font-medium tracking-wide text-[#000] hover:bg-slate-200 uppercase" to="/signup" >SIGNUP</Link>:""}
              </div>:""}
        </>
    )
}