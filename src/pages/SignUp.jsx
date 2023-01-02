import React from "react";
import logo  from "../images/logo.png"
import tyreprint from "../images/tyreprint.png"
import px5 from "../images/px-5.jpg"
import { Link } from "react-router-dom";

export function SignUp(){

    return(
        <>
        <div className="flex flex-row bg-[#000] overflow-hidden h-[713px] z-10 relative w-full justify-center items-center">
            <div className="w-1/2">
                <img className="" src={px5} alt="" srcset="" />
            </div>
            <div className="flex flex-col w-[400px] h-[500px] bg-[#F0ECCF] rounded-lg shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] p-8 justify-around">
                <div className="flex flex-row items-center">
                    <div>
                        <img className="w-[40px]" src={logo} alt="" />
                    </div>
                    <h1 className="loginHead text-[40px]">Car Rental</h1>
                </div>
                <div className="relative">
                    <img className="absolute left-40 " src={tyreprint} alt="" />
                </div>
                <div className="flex flex-col bg-transparent z-10">
                    <h2 className="text-lg font-bold">Your Name:</h2>
                    <input className="w-full bg-transparent focus:bg-[#F0ECCF] pl-2 text-lg" type="text" placeholder="Enter Your Email" />
                </div>
                <div className="flex flex-col bg-transparent z-10">
                    <h2 className="text-lg font-bold">Your Email:</h2>
                    <input className="w-full bg-transparent focus:bg-[#F0ECCF] pl-2 text-lg" type="email" placeholder="Enter Your Email" />
                </div>
                <div className="flex flex-col z-10">
                    <h2 className="text-lg font-bold">Your Password:</h2>
                    <input type="password" className="w-full text-lg focus:bg-[#F0ECCF] pl-2 bg-transparent" placeholder="Enter Your Password" />
                </div>
                <button className="bg-[#3A4F7A] shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] z-10 rounded-full text-lg h-[40px] w-full text-white">SIGNUP</button>
                <Link to="/login">Already a user? Click To Login</Link>
            </div>
        </div>
        </>
    )
}