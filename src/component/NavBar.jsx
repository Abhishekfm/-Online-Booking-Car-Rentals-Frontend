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
    const [showModal, setShowModal] = useState(false)
    const modalContent = (
      <div>
          <div
          className="justify-center items-center flex overflow-x-hidden backdrop-blur-sm overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
        >
          <div className="relative w-auto my-6 mx-auto max-w-[320px] 2xs:max-w-sm xs:max-w-lg sm:max-w-xl md:max-w-3xl">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*header*/}
              <div className="flex items-start justify-between p-1 sm:p-3 border-b border-solid border-slate-200 rounded-t">
                <h3 className="text-xl 2md:text-2xl font-semibold">
                For Better Results 
                </h3>
                <button
                  className="p-1 ml-auto bg-transparent border-0 text-black opacity-40 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                  onClick={() => closeMe()}
                >
                  <span className=" text-[#000] text-[29px] block focus:outline-none">
                  ×
                  </span>
                </button>
              </div>
              {/*body*/}
              <div className="relative p-3 2md:p-6 gap-2 flex flex-col flex-auto">
                  <p className="my-1 md:my-4 text-slate-500 text-md 2md:text-lg leading-relaxed">
                  Search in Country India And State Uttar Pradesh And City Noida
                  </p>
                  <em className="text-red-600 text-[14px] 2md:text-lg">Note:- For better Use Of Application</em>
              </div>
              {/*footer*/}
              <div className="flex items-center justify-end p-2 border-t border-solid border-slate-200 rounded-b">
                <button
                  className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => closeMe()}
                >
                  Close
                </button>
                <button
                  className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                  type="button"
                  onClick={() => closeMe()}
                >
                  Okay
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>

      </div>
  );
  function closeMe(){
    setShowModal(false)
  }
    async function logMeOut(){
      try {
        const res = await axios.post(`${props.BaseUrl}/auth/logout`,
        { withCredentials:true});
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
        {showModal? modalContent:""}
        <nav className="bg-slate-800 text-white py-3 px-4 flex justify-between items-center">
            <Link className="text-lg font-semibold tracking-wide uppercase" to="/">DriveMe</Link>
            <div className="hidden md:flex">
              <Link className="mx-4 text-base font-medium tracking-wide uppercase" to="/" >Home</Link>
              {myRole === "ADMIN" || myRole === "USER"?<Link className="mx-4 text-base font-medium tracking-wide uppercase" to="/order" >Order</Link>:""}
              {myRole === "ADMIN"?<Link className="mx-4 text-base font-medium tracking-wide uppercase" to="/users" >Users</Link>:""}
              <p onClick={()=>{setShowModal(true)}} className="mx-4 text-base font-medium tracking-wide uppercase">Available IN</p>
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
                  <p onClick={()=>{setShowModal(true)}} className="mx-4 text-base font-medium tracking-wide uppercase">Available IN</p>
                  {myRole === "ADMIN"?<Link className="px-4 py-1 text-base font-medium hover:bg-slate-200 tracking-wide text-[#000] uppercase" to="/admin" >Admin Controller</Link>:""}
                  {myRole === "ADMIN"?<Link className="px-4 py-1 text-base font-medium hover:bg-slate-200 tracking-wide text-[#000] uppercase" to="/allorder" >All Order</Link>:""}
                  {myRole === "ADMIN" || myRole === "USER"?<Link onClick={()=>{logMeOut()}} className=" px-4 py-1 text-[#000] hover:bg-slate-200 text-base font-medium tracking-wide uppercase" to="/login" >LogOut</Link>:<Link className=" px-4 py-1 hover:bg-slate-200 text-[#000] text-base font-medium tracking-wide uppercase" to="/login" >LogIn</Link>}
                  {myRole === "NOROLE"?<Link className=" px-4 py-1 text-base font-medium tracking-wide text-[#000] hover:bg-slate-200 uppercase" to="/signup" >SIGNUP</Link>:""}
              </div>:""}
        </>
    )
}