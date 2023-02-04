import React from "react";
import axios from "axios";
import { useState } from "react";
import car from "../images/car.png"
import expand from "../images/expand.png"

export function AllOrdersComp(props){
    const orderHistory = props.orderHistory
    const [isVisibleId, setIsVisibleId] = useState(null);
    const [getDbOtp, setGetDbOtp] = useState(0);
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [timer, setTimer] = useState(300);
    const [isClickedOnSendOtp, setIsClickedOnSendOtp] = useState("")
    const [isOtpVerified, setIsOtpVerified] = useState("")
    const [btnClicked, setBtnClicked] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const [userId, setUserId] = useState("")
    const [userName, setUserName] = useState("")
    const [userRole, setUserRole] = useState("")

    const handleChange = (e, index, orderId) => {
        const newOtp = [...otp];
        newOtp[index] = e.target.value;
        setOtp(newOtp);
        if(index === 5 && e.target.value.length > 1){
            const newOtp = [...otp];
            newOtp[index] = e.target.value[0];
            e.target.value = e.target.value[0];
            setOtp(newOtp);
            return
        }
        if (e.target.value.length === 1) {
          const nextInput = document.getElementById(`input-${index + 1}-${orderId}`);
          if (nextInput) {
            nextInput.focus();
          }
        }
    };

    const handleBackspace = (e, index, orderId) => {
        if (e.target.value.length === 0 && index > 0) {
          const prevInput = document.getElementById(`input-${index - 1}-${orderId}`);
          if (prevInput) {
            prevInput.focus();
          }
        }
    };
    const handleInputFocus = (e, index) => {
        if (index > 0 && otp[index - 1].length === 0) {
          e.target.previousSibling.focus();
        }
    };

    const isDisabled = otp.some((value) => value.length === 0);
    
    async function showLocation(orderId, sd, ed, carId, stage){
        if(isVisibleId === orderId){
            setIsVisibleId(null)
            setUserId("")
            return
        }
        setBtnClicked(true)
        setTimeout(() => {
            setBtnClicked(false);
            // props.showResults()
            // startAdmin()
        }, 1000);
        setIsVisibleId(orderId)
        // if(ed < new Date().toISOString().substr(0, 16) && stage === "PENDING"){
        //     console.log("yes it is small");
        //     deleteOrder(carId, orderId)
        // }
    }
    async function deleteOrder(carId, orderId){
        try {
            setBtnClicked(true)
            const res = await axios.delete(`${props.BaseUrl}/admin/deleteorderbyid/${carId}/${orderId}`,{withCredentials:true})
            if(res){
                console.log(res);
                props.getOrder()
            }
            setTimeout(() => {
                setBtnClicked(false);
                // props.showResults()
                // startAdmin()
            }, 1000);
        } catch (error) {
            setTimeout(() => {
                setBtnClicked(false);
                // props.showResults()
                // startAdmin()
            }, 1000);
            console.log(error);
        }
    }
    async function deliverOrder(carId, orderId){
        try {
            let val = otp.join("")
            console.log(otp.some((value) => value.length === 0));
            if(otp.some((value) => value.length === 0)){
                console.log("Empty");
                return
            }
            console.log(otp);
            val = Number(val)
            if(val !== Number(getDbOtp)){
                return
            }
            setBtnClicked(true)
            const res = await axios.post(`${props.BaseUrl}/u/verifyotp`,{
                orderId,
                enteredOtp:val
            },{withCredentials:true})
            if(Number(getDbOtp) <= 0){
                setTimeout(() => {
                    setBtnClicked(false);
                    // props.showResults()
                    // startAdmin()
                }, 1000);
                return
            }else{
                setTimeout(() => {
                    setBtnClicked(false);
                    // props.showResults()
                    // startAdmin()
                }, 1000);
                console.log(res);
                setIsOtpVerified(orderId)
                props.getOrder()
                // if(val === Number(getDbOtp)){
                //     console.log(true);
                // }
            }
            return
        } catch (error) {
            setTimeout(() => {
                setBtnClicked(false);
                // props.showResults()
                // startAdmin()
            }, 1000);
            return
        }
    }
    async function sendOtpToCustomer(carId, orderId){
        try {
            setIsClickedOnSendOtp(orderId)
            const interval = setInterval(() => {
                setTimer((prevTimer) => {
                  if (prevTimer === 0) {
                    clearInterval(interval);
                    setIsClickedOnSendOtp("");
                    return 300;
                  }
                  return prevTimer - 1;
                });
            }, 1000);
            setBtnClicked(true)
            const res = await axios.get(`${props.BaseUrl}/u/sendotp/${orderId}`,{ withCredentials:true })
            if(!res){
                setTimeout(() => {
                    setBtnClicked(false);
                    // props.showResults()
                    // startAdmin()
                }, 1000);
                return
            }else{
                setTimeout(() => {
                    setBtnClicked(false);
                    // props.showResults()
                    // startAdmin()
                }, 1000);
                console.log(res);
                setGetDbOtp(res.data.otp)
            }
            return
        } catch (error) {
            setTimeout(() => {
                setBtnClicked(false);
                // props.showResults()
                // startAdmin()
            }, 1000);
            return
        }
    }
    async function knowCustomer(id){
        try {
            if(userId === id){
                setUserEmail("")
                setUserName("")
                setUserRole("")
                setUserId("")
                return
            }
            setUserId(id)
            const res = await axios(`${props.BaseUrl}/admin/getname/${id}`,{withCredentials:true})
            if(res){
                console.log(res);
                setUserEmail(res.data.user.email)
                setUserName(res.data.user.name)
                setUserRole(res.data.user.role)
            }
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <>
        {!btnClicked?
        <div className="flex w-full flex-col">
            {orderHistory && orderHistory.map((ele)=>(
                <div key={ele._id} className="flex w-full p-4 flex-col items-start justify-around border-dashed border-b-2 border-slate-400">
                    <div className="flex w-full p-4 flex-row items-start justify-around">
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
                                </div>
                            </div>
                        </div>
                        {ele.stage ==="PENDING"?<div className="flex flex-col justify-between h-[100px]">
                            <div>
                                <button onClick={()=>{deleteOrder(ele.carId, ele._id)}} className="px-4 w-[150px] py-2 bg-[#CD0404] rounded-md font-semibold text-[#fff]">Delete Order</button>
                            </div>
                        </div>:ele.stage === "ONGOING"?<h2 className="text-[20px] font-semibold">Order is <span className="text-[24px] font-bold uppercase text-[#5F9DF7]">on going</span></h2>:<h2 className="text-[24px] text-[#285430] font-bold uppercase">success</h2>}
                    </div>
                    <div className="w-full flex flex-col gap-2 ">
                        <h2 onClick={()=>{showLocation(ele._id, ele.orderDate.startDate, ele.orderDate.endDate, ele.carId, ele.stage)}} className="text-[20px] font-semibold cursor-pointer flex items-end">More Info <img className="w-[30px]" src={expand} alt="" /></h2>
                        <div id={ele._id} className={isVisibleId === ele._id?"flex flex-col w-full justify-around":"hidden"}>
                            <div className="flex w-full justify-around">
                            <table class="table-auto w-1/2 text-left text-[18px]">
                                <thead>
                                    <tr class="bg-gray-900 text-white">
                                        <th class="px-4 py-2">Country</th>
                                        <th class="px-4 py-2">State</th>
                                        <th class="px-4 py-2">City</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="bg-gray-100 font-semibold">
                                        <td class="border px-4 py-2 uppercase">{ele.carLocation.country}</td>
                                        <td class="border px-4 py-2 uppercase">{ele.carLocation.state}</td>
                                        <td class="border px-4 py-2 uppercase">{ele.carLocation.city}</td>
                                    </tr>
                                </tbody>
                            </table>
                            {ele.stage === "PENDING"?<div className="w-1/5 h-full flex flex-col justify-between">
                                <div className="flex flex-col items-end gap-2 justify-between">
                                    <h2 className="text-[20px] font-semibold text-slate-800">Enter OTP <span className="text-[12px]">And Take It From User</span></h2>
                                    <div className="flex w-full h-[50px] justify-between">
                                        {otp.map((value, index) => (
                                            <input
                                              key={index}
                                              type="number"
                                              className="bg-[#E9E8E8] font-semibold text-[20px] gap-2 w-8 h-8 text-center shadow-md rounded-md "
                                              id={`input-${index}-${ele._id}`}
                                            //   value={value}
                                              onChange={(e) => handleChange(e, index, ele._id)}
                                              onKeyDown={(e) => {
                                                if (e.keyCode === 8) {
                                                  handleBackspace(e, index, ele._id);
                                                }
                                              }}
                                            />
                                        ))}
                                    </div>
                                    {isClickedOnSendOtp !== ele._id?<button onClick={()=>{sendOtpToCustomer(ele.carId, ele._id)}} className="px-4 mb-8  py-2 bg-[#E8E2E2] shadow-lg text-black rounded-md font-semibold text-[#fff] cursor-pointer">Send OTP..</button>: (
                                      <div className="flex text-[20px] font-semibold gap-2">
                                        Timer: {Math.floor(timer / 60)}:
                                        {timer % 60 < 10 ? "0" + timer % 60 : timer % 60}
                                      </div>
                                    )}
                                </div>
                                <button onClick={()=>{deliverOrder(ele.carId, ele._id)}} disabled={isDisabled} className="px-4 py-2 text-[20px] bg-[#0081C9] rounded-md font-semibold text-[#fff] cursor-pointer">Deliver Order</button>
                            </div>:ele.stage === "ONGOING"?<h2 className="text-[15px] font-semibold">Order's <span className="text-[20px] font-bold text-[#7B8FA1] ">Otp Submitted</span></h2>:<h2 className="text-[24px] text-[#285430] font-bold uppercase">success</h2>}
                            </div>
                            {/* {ele.orderDate.endDate < new Date().toISOString().substr(0, 16)&& ele.stage === "PENDING"?deleteOrder(ele.carId, ele._id):""} */}
                            <h2 onClick={()=>{knowCustomer(ele.userId)}} className="text-[20px] pb-2 font-semibold cursor-pointer flex items-end">Know your Customer ?<img className="w-[30px]" src={expand} alt="" /></h2>
                            <div className={isVisibleId === ele._id && userId === ele.userId ? "block w-full":"hidden"}>
                                <table class="table-auto w-1/2 text-left text-[18px]">
                                        <thead>
                                            <tr class="bg-gray-900 text-white">
                                                <th class="px-4 py-2 uppercase">Name</th>
                                                <th class="px-4 py-2 uppercase">Email</th>
                                                <th class="px-4 py-2 uppercase">Role</th>
                                                <th class="px-4 py-2 uppercase">ID</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="bg-gray-100 font-semibold">
                                                <td class="border px-4 py-2 uppercase">{userName}</td>
                                                <td class="border px-4 py-2 ">{userEmail}</td>
                                                <td class="border px-4 py-2 uppercase">{userRole}</td>
                                                <td class="border px-4 py-2 ">{userId}</td>
                                            </tr>
                                        </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
            </div>
            ))}
        </div>:
        <div>
            <div className="w-full h-full  backdrop-blur-[10px] flex top-0 fixed justify-center items-center">
                <div class="lds-hourglass"></div>
            </div>
            <div className="flex w-full flex-col">
            {orderHistory && orderHistory.map((ele)=>(
                <div key={ele._id} className="flex w-full p-4 flex-col items-start justify-around border-dashed border-b-2 border-slate-400">
                    <div className="flex w-full p-4 flex-row items-start justify-around">
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
                                </div>
                            </div>
                        </div>
                        {ele.stage ==="PENDING"?<div className="flex flex-col justify-between h-[100px]">
                            <div>
                                <button onClick={()=>{deleteOrder(ele.carId, ele._id)}} className="px-4 w-[150px] py-2 bg-[#CD0404] rounded-md font-semibold text-[#fff]">Delete Order</button>
                            </div>
                        </div>:ele.stage === "ONGOING"?<h2 className="text-[20px] font-semibold">Order is <span className="text-[24px] font-bold uppercase text-[#5F9DF7]">on going</span></h2>:<h2 className="text-[24px] text-[#285430] font-bold uppercase">success</h2>}
                    </div>
                    <div className="w-full flex flex-col gap-2 ">
                        <h2 onClick={()=>{showLocation(ele._id, ele.orderDate.startDate, ele.orderDate.endDate, ele.carId, ele.stage)}} className="text-[20px] font-semibold cursor-pointer flex items-end">More Info <img className="w-[30px]" src={expand} alt="" /></h2>
                        <div id={ele._id} className={isVisibleId === ele._id?"flex w-full justify-around":"hidden"}>
                            <table class="table-auto w-1/2 text-left text-[18px]">
                                <thead>
                                    <tr class="bg-gray-900 text-white">
                                        <th class="px-4 py-2">Country</th>
                                        <th class="px-4 py-2">State</th>
                                        <th class="px-4 py-2">City</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="bg-gray-100 font-semibold">
                                        <td class="border px-4 py-2 uppercase">{ele.carLocation.country}</td>
                                        <td class="border px-4 py-2 uppercase">{ele.carLocation.state}</td>
                                        <td class="border px-4 py-2 uppercase">{ele.carLocation.city}</td>
                                    </tr>
                                </tbody>
                            </table>
                            {ele.stage === "PENDING"?<div className="w-1/5 h-full flex flex-col justify-between">
                                <div className="flex flex-col items-end gap-2 justify-between">
                                    <h2 className="text-[20px] font-semibold text-slate-800">Enter OTP <span className="text-[12px]">And Take It From User</span></h2>
                                    <div className="flex w-full h-[50px] justify-between">
                                        {otp.map((value, index) => (
                                            <input
                                              key={index}
                                              type="number"
                                              className="bg-[#E9E8E8] font-semibold text-[20px] gap-2 w-8 h-8 text-center shadow-md rounded-md "
                                              id={`input-${index}-${ele._id}`}
                                            //   value={value}
                                              onChange={(e) => handleChange(e, index, ele._id)}
                                              onKeyDown={(e) => {
                                                if (e.keyCode === 8) {
                                                  handleBackspace(e, index, ele._id);
                                                }
                                              }}
                                            />
                                        ))}
                                    </div>
                                    {isClickedOnSendOtp !== ele._id?<button onClick={()=>{sendOtpToCustomer(ele.carId, ele._id)}} className="px-4 mb-8  py-2 bg-[#E8E2E2] shadow-lg text-black rounded-md font-semibold text-[#fff] cursor-pointer">Send OTP..</button>: (
                                      <div className="flex text-[20px] font-semibold gap-2">
                                        Timer: {Math.floor(timer / 60)}:
                                        {timer % 60 < 10 ? "0" + timer % 60 : timer % 60}
                                      </div>
                                    )}
                                </div>
                                <button onClick={()=>{deliverOrder(ele.carId, ele._id)}} disabled={isDisabled} className="px-4 py-2 text-[20px] bg-[#0081C9] rounded-md font-semibold text-[#fff] cursor-pointer">Deliver Order</button>
                            </div>:ele.stage === "ONGOING"?<h2 className="text-[15px] font-semibold">Order's <span className="text-[20px] font-bold text-[#7B8FA1] ">Otp Submitted</span></h2>:<h2 className="text-[24px] text-[#285430] font-bold uppercase">success</h2>}
                            {/* {ele.orderDate.endDate < new Date().toISOString().substr(0, 16)&& ele.stage === "PENDING"?deleteOrder(ele.carId, ele._id):""} */}
                        </div>
                    </div>
            </div>
            ))}
        </div>
        </div>
        }
        </>
    )
}


function Loading(){
    return(
        <>
        <div className="w-full h-full flex justify-center items-center">
            <h1 className="text-[34px]">LOADING</h1>
        </div>
        </>
    )
}