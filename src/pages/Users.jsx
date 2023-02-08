import axios from "axios";
import banner3 from "../images/banner3.jpg"
import { PageNumber } from "../component/PageNumber";
import { NavBar } from "../component/NavBar";
import car from "../images/car.png"
import expand from "../images/expand.png"
import React, { useEffect } from "react";
import { useState } from "react";
import { AllOrdersComp } from "../component/AllOrdersComp";

export function Users(props){
    const [showEmpty, setShowEmpty] = useState(false)
    const [users, setUsers] = useState("")
    const [customerName, setCustomerName] = useState("")
    const [customerEmail, setCustomerEmail] = useState("")
    const [customerRole, setCustomerRole] = useState("")
    const [skipNo, setSkipNo] = useState(0)
    const [skipNo2, setSkipNo2] = useState(0)
    const [numberOfPages, setNumberOfPages] = useState(0)
    const [numberOfPages2, setNumberOfPages2] = useState(0)
    const [clickedUser, setClickedUser] = useState("")
    const [orderHistory, setOrderHistory] = useState([])
    const [isVisibleId, setIsVisibleId] = useState(null);
    async function getAllUser(){
        try {
            const res = await axios.post(`${props.BaseUrl}/admin/getalluser`,{ skipNo }, { credentials: "include"})
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
                console.log(userId)
                console.log("No executed")
                setClickedUser(null)
                return
            }
            console.log("Yes Executed")
            const res = await axios.get(`${props.BaseUrl}/admin/getorderbyid/${userId}/${skipNo2}`,{ credentials: "include"})
            if(!res){
                return
            }else{
                console.log(res);
                setCustomerName(name)
                setCustomerEmail(email)
                setCustomerRole(role)
                if(res.data.allFiveOrder.length <= 0){
                    setShowEmpty(true)
                }else{
                    setShowEmpty(false)
                }
                let page = Math.ceil(Number(res.data.totalLength)/5)
                setNumberOfPages2(page)
                setOrderHistory(res.data.allFiveOrder)
                setClickedUser(userId)
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        getAllUser()
    },[skipNo])
    useEffect(()=>{
        setUserAndOrder(clickedUser, customerName, customerEmail, customerRole, true)
    },[skipNo2])
    async function showLocation(carId){
        if(isVisibleId === carId){
            setIsVisibleId(null)
            return
        }
        setIsVisibleId(carId)
    }
    async function deleteOrder(carId, orderId){
        try {
            const res = await axios.delete(`${props.BaseUrl}/admin/deleteorderbyid/${carId}/${orderId}`,{ credentials: "include"})
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
            const res = await axios.delete(`${props.BaseUrl}/admin/deleteuseraccount/${id}/${role}`,{ credentials: "include"})
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
              <img src={banner3} className="w-full rounded-[10px] h-[200px] md:h-[240px] object-cover" alt="" />
        </div>
        <div className="w-full h-[180px] md:h-[220px] text-center pt-[0px] ">
          <h1 className="text-[30px] md:text-[50px] drop-shadow-lg font-extrabold text-white drop-shadow-lg">
             ALL USERS OF DRIVEME
          </h1>
        </div>
        <div className="flex flex-col p-4">
            <table class="table-auto text-left text-[14px] sm:text-[18px]">
                <thead>
                    <tr class="bg-gray-900 text-white">
                        <th class="px-1 py-1 2md:px-4 2md:py-2">Name</th>
                        <th class="px-1 py-1 2md:px-4 2md:py-2">Email</th>
                        <th class="px-1 py-1 2md:px-4 2md:py-2">Role</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map((ele)=>(
                    <tr class="bg-gray-100 font-semibold hover:bg-gray-300 active:bg-[#000]" onClick={()=>{setUserAndOrder(ele._id, ele.name, ele.email, ele.role, false)}}>
                        <td class="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{ele.name}</td>
                        <td class="border px-1 py-1 2md:px-4 2md:py-2 ">{ele.email}</td>
                        <td class="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{ele.role}</td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <PageNumber setSkip={setSkipNo} pages={numberOfPages}/>
            <div className={clickedUser?"block flex flex-row flex-wrap 2md:flex-nowrap ":"hidden"}>
                <div className="flex rounded-[20px] h-[440px] flex-col ml-2 m-2 bg-slate-100 gap-4 p-4 w-full md:w-[300px]">
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
                    <AllOrdersComp orderHistory={orderHistory} getOrder={()=>{setUserAndOrder(clickedUser, customerName, customerEmail, customerRole, true)}} BaseUrl={props.BaseUrl} />
                    <PageNumber setSkip={setSkipNo2} pages={numberOfPages2}/>
                    {/* {orderHistory && orderHistory.map((ele)=>(
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
                    ))} */}
                </div>
                <div className={showEmpty?"block w-full text-center":"hidden"}>
                    <h1 className="text-[35px] font-bold">NO ORDERS!</h1>
                </div>
            </div>
        </div>
        </>
    )
}