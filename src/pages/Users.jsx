import axios from "axios";
import banner3 from "../images/banner3.jpg"
import { PageNumber } from "../component/PageNumber";
import { NavBar } from "../component/NavBar";
import car from "../images/car.png"
import expand from "../images/expand.png"
import React, { useEffect } from "react";
import { useState } from "react";

export function Users(props){
    const [showEmpty, setShowEmpty] = useState(false)
    const [users, setUsers] = useState("")
    const [customerName, setCustomerName] = useState("")
    const [customerEmail, setCustomerEmail] = useState("")
    const [customerRole, setCustomerRole] = useState("")
    const [skipNo, setSkipNo] = useState(0)
    const [numberOfPages, setNumberOfPages] = useState(0)
    const [clickedUser, setClickedUser] = useState("")
    const [orderHistory, setOrderHistory] = useState([])
    const [isVisibleId, setIsVisibleId] = useState(null);
    async function getAllUser(){
        try {
            const res = await axios.post(`${props.BaseUrl}/admin/getalluser`,{ skipNo }, { withCredentials:true })
            if(!res){
                return
            }else{
                console.log(res);
                let page = Math.ceil(Number(res.data.totalLength)/5)
                setNumberOfPages(page)
                setUsers(res.data.allUser)
            }
        } catch (error) {
            console.log(error);
        }
    }
    async function setUserAndOrder(userId, name, email, role, deleteOrderCall){
        try {
            if(clickedUser === userId && deleteOrderCall !== true){
                setClickedUser(null)
                return
            }
            const res = await axios.get(`${props.BaseUrl}/admin/getorderbyid/${userId}`,{withCredentials:true})
            if(!res){
                return
            }else{
                console.log(res);
                setCustomerName(name)
                setCustomerEmail(email)
                setCustomerRole(role)
                if(res.data.allOrder.length <= 0){
                    setShowEmpty(true)
                }else{
                    setShowEmpty(false)
                }
                setOrderHistory(res.data.allOrder)
                setClickedUser(userId)
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        getAllUser()
    },[skipNo])
    async function showLocation(carId){
        if(isVisibleId === carId){
            setIsVisibleId(null)
            return
        }
        setIsVisibleId(carId)
    }
    async function deleteOrder(carId, orderId){
        try {
            const res = await axios.delete(`${props.BaseUrl}/admin/deleteorderbyid/${carId}/${orderId}`,{withCredentials:true})
            if(!res){
                return
            }else{
                console.log(res);
                setUserAndOrder(res.data.thisOrder.userId, customerName, customerEmail, customerRole, true)
                return
            }
        } catch (error) {
            console.log(error);
        }
    }
    async function deleteAccount(id){
        try {
            console.log(id);
            console.log(customerRole);
            let role = customerRole
            const res = await axios.delete(`${props.BaseUrl}/admin/deleteuseraccount/${id}/${role}`,{withCredentials:true})
            if(!res){
                return
            }else{
                getAllUser();
                setClickedUser(null)
                console.log(res);
            }
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <>
        <NavBar BaseUrl={props.BaseUrl}/>
        <div className='w-full h-[0px] p-[10px]'>
              <img src={banner3} className="w-full rounded-[20px] h-[300px] object-cover" alt="" />
        </div>
        <div className="w-full h-[300px] text-center pt-[0px] ">
          <h1 className="text-[50px] drop-shadow-lg font-extrabold text-white drop-shadow-lg">
             ALL USERS OF DRIVEME
          </h1>
        </div>
        <div className="flex flex-col p-4">
            <div className="flex flex-row justify-around">
                <h1 className="w-1/3 text-[25px] font-semibold text-center pl-4 border-2 border-slate-400">Name</h1>
                <h1 className="w-1/3 text-[25px] font-semibold text-center pl-4 border-2 border-l-0 border-slate-400">Email</h1>
                <h1 className="w-1/3 text-[25px] font-semibold text-center pl-4 border-2 border-l-0 border-slate-400">Role</h1>
            </div>
            <div className="h-[150px]">
            {users && users.map((ele)=>(
                <div className="">
                    <div onClick={()=>{setUserAndOrder(ele._id, ele.name, ele.email, ele.role, false)}} className="flex flex-row translate-z-1 hover:translate-x-1 cursor-pointer justify-around">
                        <h1 className="w-1/3 pl-4 border-2 font-medium border-t-0 border-slate-400">{ele.name}</h1>
                        <h1 className="w-1/3 pl-4 border-2 font-medium border-t-0 border-l-0 border-slate-400">{ele.email}</h1>
                        <h1 className="w-1/3 pl-4 border-2 font-medium border-t-0 border-l-0 border-slate-400">{ele.role}</h1>
                    </div>
                </div>
            ))}
            </div>
            <PageNumber setSkip={setSkipNo} pages={numberOfPages}/>
            <div className={clickedUser?"block flex flex-row":"hidden"}>
                <div className="flex rounded-[20px] h-[440px] flex-col ml-2 m-2 bg-slate-100 gap-4 p-4 w-[300px]">
                    <h1 className="text-lg text-slate-400 uppercase">Name</h1>
                    <div className="flex flex-col gap-2 p-2 border-dashed border-b-2 border-slate-400">
                        <h1 className="text-[16px] uppercase">{customerName}</h1>
                    </div>
                    <div className="flex flex-col gap-2 p-2 border-dashed border-b-2 border-slate-400">
                        <h1 className="text-[16px] text-slate-400 uppercase">Email of Customer</h1>
                        <h2 className="text-[15px]">{customerEmail}</h2>
                    </div>
                    <div className="flex flex-col gap-2 p-2 border-dashed border-b-2 border-slate-400">
                        <h1 className="text-[16px] text-slate-400 uppercase">Role Of Customer</h1>
                        <h2 className="text-[15px]">{customerRole}</h2>
                    </div>
                    <div className="flex flex-col gap-2 p-2 border-dashed border-b-2 border-slate-400">
                        <h1 className="text-[16px] text-slate-400 uppercase">Delete Customer Account</h1>
                        <button onClick={()=>{deleteAccount(clickedUser)}} className="px-4 py-2 bg-[#CD0404] rounded-md font-semibold text-[#fff]">Delete User Account</button>
                    </div>
                </div>
                <div className={!showEmpty?"flex w-full flex-col":"hidden"}>
                    {orderHistory && orderHistory.map((ele)=>(
                        <div key={ele._id} className="flex w-full p-4 flex-row items-start justify-around border-dashed border-b-2 border-slate-400">
                        <div className="flex gap-8">
                            <div className="cursor-pointer" >
                             <img className="h-[200px] w-[340px] object-cover" src={ele.url? ele.url :car} alt="" />
                            </div>
                            <div className="flex w-full flex-row justify-between">
                                <div className="flex w-full flex-col gap-6">
                                    <h2 className="text-[25px] font-bold">{ele.carName}</h2>
                                    <h1 className="text-[18px] font-semibold">Booked Cars: <span className="text-[#CD0404]">{ele.numberOfCars}</span></h1>
                                    <div>
                                        <h1 className="text-[15px] text- font-medium">Start Date: <span className="text-[#FFEA20]">{ele.orderDate.startDate}</span></h1>
                                        <h1 className="text-[15px] font-medium">End Date:  <span className="text-[#CD0404]">{ele.orderDate.endDate}</span></h1>
                                    </div>
                                    <h2 onClick={()=>{showLocation(ele._id)}} className="text-[20px] cursor-pointer flex items-end">More Info <img className="w-[30px]" src={expand} alt="" /></h2>
                                    <div id={ele._id} className={isVisibleId === ele._id?"block w-full ":"hidden"}>
                                        <p className="text-[20px]">Country: {ele.carLocation.country}</p>
                                        <p className="text-[20px]">State: {ele.carLocation.state}</p>
                                        <p className="text-[20px]">City: {ele.carLocation.city}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col justify-between h-[100px]">
                            <div>
                                <button onClick={()=>{deleteOrder(ele.carId, ele._id)}} className="px-4 w-[150px] py-2 bg-[#CD0404] rounded-md font-semibold text-[#fff]">Delete Order</button>
                            </div>
                        </div>
                    </div>
                    ))}
                </div>
                <div className={showEmpty?"block w-full text-center":"hidden"}>
                    <h1 className="text-[35px] font-bold">NO ORDERS!</h1>
                </div>
            </div>
        </div>
        </>
    )
}