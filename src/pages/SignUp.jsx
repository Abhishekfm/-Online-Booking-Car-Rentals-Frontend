import React from "react";
import logo  from "../images/logo.png"
import tyreprint from "../images/tyreprint.png"
import px5 from "../images/px-5.jpg"
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { MyContext } from "../contexts/MyContext";
import { useContext } from "react";

export function SignUp({BaseUrl}){
    const [user, setUser] = useContext(MyContext)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const navigate = useNavigate()

    const handleSubmit = async () => {
        try {
            if(!name || !email || !password){
                console.log("Provide all details");
                toast("Provide All Details")
                return
            }
            const res = await axios.post(`${BaseUrl}/auth/createuser`,{
                name,
                email,
                password
            },{ credentials: "include"})
            if(!res){
                toast.error("Something Went Wrong")
                console.log(res);
                return
            }else{
                console.log(res);
                setUser(res)
                navigate("/")
                toast.success("Account is Created")
            }
        } catch (error) {
            console.log(error);
            toast.error("Something Went Wrong")
        }
    }
    return(
        <>
        <ToastContainer />
        <div className="flex flex-row bg-[#000] overflow-hidden h-screen z-10 sm:flex-nowrap flex-wrap relative w-full justify-center items-start sm:items-center">
            <div className="w-1/2">
                <img className="" src={px5} alt="" srcset="" />
            </div>
            <div className="flex flex-col w-[400px] h-[500px] bg-[#F0ECCF] rounded-lg shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] p-8 justify-around">
                <div className="flex flex-row items-center">
                    <div>
                        <img className="w-[40px]" src={logo} alt="" />
                    </div>
                    <Link className="loginHead text-[40px] cursor-pointer" to="/">Car Rental</Link>
                </div>
                <div className="relative">
                    <img className="absolute left-40 " src={tyreprint} alt="" />
                </div>
                <div className="flex flex-col bg-transparent z-10">
                    <h2 className="text-lg font-bold">Your Name:</h2>
                    <input className="w-full bg-transparent focus:bg-[#F0ECCF] pl-2 text-lg" type="text" placeholder="Enter Your Name" onChange={(event)=>{setName(event.target.value)}} />
                </div>
                <div className="flex flex-col bg-transparent z-10">
                    <h2 className="text-lg font-bold">Your Email:</h2>
                    <input className="w-full bg-transparent focus:bg-[#F0ECCF] pl-2 text-lg" type="email" placeholder="Enter Your Email" onChange={(event)=>{setEmail(event.target.value)}} />
                </div>
                <div className="flex flex-col z-10">
                    <h2 className="text-lg font-bold">Your Password:</h2>
                    <input type="password" className="w-full text-lg focus:bg-[#F0ECCF] pl-2 bg-transparent" placeholder="Enter Your Password" onChange={(event)=>{setPassword(event.target.value)}} />
                </div>
                <button className="bg-[#3A4F7A] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] z-10 rounded-full text-lg h-[40px] w-full text-white" onClick={handleSubmit}>SIGNUP</button>
                <Link to="/login">Already a user? Click To Login</Link>
            </div>
        </div>
        </>
    )
}