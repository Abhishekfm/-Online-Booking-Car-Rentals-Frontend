import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import car from "../images/car.png"
import expand from "../images/expand.png"
import banner5 from "../images/banner5.jpg"
import { MyContext } from "../contexts/MyContext";

export function OrderCars({ BaseUrl }){
    const [showEmpty, setShowEmpty] = useState(false)
    const [user, setUser ] = useContext(MyContext)
    const [allOrder, setAllOrder] = useState([])
    //added
    const [isVisibleId, setIsVisibleId] = useState(null);
    const [getDbOtp, setGetDbOtp] = useState(0);
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [timer, setTimer] = useState(300);
    const [isClickedOnSendOtp, setIsClickedOnSendOtp] = useState("")
    const [isOtpVerified, setIsOtpVerified] = useState("")

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
            return
        }
        setIsVisibleId(orderId)
        // if(ed < new Date().toISOString().substr(0, 16) && stage === "PENDING"){
        //     console.log("yes it is small");
        //     deleteOrder(carId, orderId)
        // }
    }
    async function deleteOrder(carId, orderId){
        try {
            const res = await axios.delete(`${BaseUrl}/admin/deleteorderbyid/${carId}/${orderId}`,{withCredentials:true})
            if(!res){
                return
            }else{
                console.log(res);
                myOrders()
                return
            }
        } catch (error) {
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
            const res = await axios.post(`${BaseUrl}/u/verifyotp`,{
                orderId,
                enteredOtp:val
            },{withCredentials:true})
            if(Number(getDbOtp) <= 0){
                return
            }else{
                console.log(res);
                setIsOtpVerified(orderId)
                myOrders()
                // if(val === Number(getDbOtp)){
                //     console.log(true);
                // }
            }
            return
        } catch (error) {
            return
        }
    }
    async function sendOtpToAdmin(carId, orderId){
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
            const res = await axios.get(`${BaseUrl}/u/sendotp/${orderId}`,{ withCredentials:true })
            if(!res){
                return
            }else{
                console.log(res);
                setGetDbOtp(res.data.otp)
            }
            return
        } catch (error) {
            return
        }
    }
    async function myOrders(){
        try {
            const res = await axios.get(`${BaseUrl}/u/myorder`, {withCredentials: true})
            if(!res){
                return
            }else{
                if(res.data.allOrder.length <= 0){
                    setShowEmpty(true)
                }else{
                    setShowEmpty(false)
                }
                setAllOrder(res.data.allOrder)
                console.log(res);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        myOrders()
    },[])
    async function deleteMe(carId, orderId){
        try {
            const res = await axios.delete(`${BaseUrl}/u/deleteorder/${carId}/${orderId}`,{withCredentials:true})
            if(!res){
                return
            }else{
                console.log(res);
                myOrders()
            }
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <>
        <div className="flex flex-col gap-2">
            <div className='w-full h-[110px] p-[10px]'>
              <img src={banner5} className="w-full rounded-[20px] h-[350px] object-cover" alt="" />
            </div>
            <div className='w-full h-[230px] text-center pt-[10px]'>
                <h1 className="text-[50px] font-extrabold drop-shadow-lg text-white drop-shadow-lg">My Orders</h1>
            </div>
            {allOrder&&allOrder.map((ele)=>(
                <div className={!showEmpty?"flex w-full p-4 flex-col items-start justify-around border-dashed border-b-2 border-slate-400":"hidden"}>
                    <div className="flex w-full p-4 flex-row items-start justify-around ">
                        <div>
                         <img className="h-[200px] w-[340px] object-cover" src={car} alt="" />
                        </div>
                        <div className="flex w-1/2 flex-row justify-between">
                            <div className="flex flex-col h-[200px] justify-between w-full">
                                <h2 className="text-[30px] font-bold">{ele.carName}</h2>
                                <h1 className="text-[20px] text- font-medium">Start Date: <span className="text-[#FFEA20]">{ele.orderDate.startDate}</span></h1>
                                <h1 className="text-[20px] font-medium">End Date:  <span className="text-[#CD0404]">{ele.orderDate.endDate}</span></h1>
                            </div>
                            {ele.stage ==="PENDING"?<div className="flex flex-col justify-between h-[100px]">
                            <div className="flex flex-col items-center w-[200px]">
                                <h1 className="text-[20px] font-semibold">Price: 20000</h1>
                                <button onClick={()=>{deleteMe(ele.carId, ele._id)}} className="text-lg rounded-[10px] font-semibold bg-[#CD0404] text-white px-4 py-2">Delete Order</button>
                            </div>
                        </div>:ele.stage === "ONGOING"?<h2 className="text-[20px] font-semibold">Order is <span className="text-[24px] font-bold uppercase text-[#5F9DF7]">on going</span></h2>:<h2 className="text-[24px] text-[#285430] font-bold uppercase">success</h2>}
                        </div>
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
                            {ele.stage === "ONGOING"?<div className="w-1/5 h-full flex flex-col justify-between">
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
                                    {isClickedOnSendOtp !== ele._id?<button onClick={()=>{sendOtpToAdmin(ele.carId, ele._id)}} className="px-4 mb-8  py-2 bg-[#E8E2E2] shadow-lg text-black rounded-md font-semibold text-[#fff] cursor-pointer">Send OTP..</button>: (
                                      <div className="flex text-[20px] font-semibold gap-2">
                                        Timer: {Math.floor(timer / 60)}:
                                        {timer % 60 < 10 ? "0" + timer % 60 : timer % 60}
                                      </div>
                                    )}
                                </div>
                                <button onClick={()=>{deliverOrder(ele.carId, ele._id)}} disabled={isDisabled} className="px-4 py-2 text-[20px] bg-[#0081C9] rounded-md font-semibold text-[#fff] cursor-pointer">Deliver Order</button>
                            </div>:ele.stage === "PENDING"?<h2 className="text-[15px] font-semibold">Order is <span className="text-[20px] font-bold text-[#82CD47] ">Still Pending</span></h2>:<h2 className="text-[24px] text-[#285430] font-bold uppercase">success</h2>}
                            {/* {ele.orderDate.endDate < new Date().toISOString().substr(0, 16)&& ele.stage === "PENDING"?deleteOrder(ele.carId, ele._id):""} */}
                        </div>
                    </div>
                </div>
            ))}
            <div className={showEmpty?"block w-full text-center":"hidden"}>
                <h1 className="text-[35px] font-bold">NO ORDERS!</h1>
            </div>
        </div>
        </>
    )
}