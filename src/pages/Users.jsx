import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";

export function Users(props){
    const [users, setUsers] = useState("")
    const [clickedUser, setClickedUser] = useState("")
    async function getAllUser(skipNo){
        try {
            const res = await axios.post(`${props.BaseUrl}/admin/getalluser`,{ skipNo }, { withCredentials:true })
            if(!res){
                return
            }else{
                console.log(res);
                setUsers(res.data.allUser)
            }
        } catch (error) {
            console.log(error);
        }
    }
    async function setUserAndOrder(userId){
        try {
            const res = await axios.get(`${props.BaseUrl}/admin/getorderbyid/${userId}`,{withCredentials:true})
            if(!res){
                return
            }else{
                console.log(res);
                setClickedUser(userId)
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        getAllUser(0)
    },[])
    return(
        <>
        <div className="flex flex-col p-4">
            <div className="flex flex-row justify-around">
                <h1 className="w-1/3 text-[25px] font-semibold text-center pl-4 border-2 border-slate-400">Name</h1>
                <h1 className="w-1/3 text-[25px] font-semibold text-center pl-4 border-2 border-l-0 border-slate-400">Email</h1>
                <h1 className="w-1/3 text-[25px] font-semibold text-center pl-4 border-2 border-l-0 border-slate-400">Role</h1>
            </div>
            {users && users.map((ele)=>(
                <div>
                    <div onClick={()=>{setUserAndOrder(ele._id)}} className="flex flex-row translate-z-1 hover:translate-x-1 cursor-pointer justify-around">
                        <h1 className="w-1/3 pl-4 border-2 font-medium border-t-0 border-slate-400">{ele.name}</h1>
                        <h1 className="w-1/3 pl-4 border-2 font-medium border-t-0 border-l-0 border-slate-400">{ele.email}</h1>
                        <h1 className="w-1/3 pl-4 border-2 font-medium border-t-0 border-l-0 border-slate-400">{ele.role}</h1>
                    </div>
                    <div className={clickedUser === ele._id?"block":"hidden"}>
                        <h1>hello</h1>
                    </div>
                </div>
            ))}
        </div>
        </>
    )
}