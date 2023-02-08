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
    const [timer, setTimer] = useState(30);
    const [isClickedOnSendOtp, setIsClickedOnSendOtp] = useState("")
    const [isOtpVerified, setIsOtpVerified] = useState("")
    const [btnClicked, setBtnClicked] = useState(false)
    const [userEmail, setUserEmail] = useState("")
    const [userId, setUserId] = useState("")
    const [userName, setUserName] = useState("")
    const [userRole, setUserRole] = useState("")
    const [showOtpModal, setShowOtpModal] = useState(false)
    let intervalIds = [];

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
            // if(val !== Number(getDbOtp)){
            //     return
            // }
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
                setShowOtpModal(false)
                await props.getOrder()
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
    async function sendOtpToCustomer(ele, carId, orderId){
        try {
            setIsClickedOnSendOtp(orderId)
            clearAllIntervals();
            let intervalId = setInterval(() => {
              setTimer((prevTimer) => {
                if (prevTimer === 0) {
                  clearInterval(intervalId);
                  setIsClickedOnSendOtp("");
                  return 30;
                }
                return prevTimer - 1;
              });
            }, 1000);
            intervalIds.push(intervalId);
            setBtnClicked(true)
            const sbjct = "Delivery Of the Vehicle"
            const msg = `This is your one-time password. Give This OTP to our Dilvery Agent. 
            When you recieve your ${ele.carName} Booked Car.`
            const res = await axios.get(`${props.BaseUrl}/u/sendotp/${orderId}/${sbjct}/${msg}`,{ withCredentials:true })
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
    function showOtpModalFunc(ele){
        setShowOtpModal(true)
    }
    function clearAllIntervals() {
        intervalIds.forEach(intervalId => {
          clearInterval(intervalId);
        });
        intervalIds = [];
    }
    const modalContent = (ele) => {
        return <div>
            <div
            className="justify-center px-2 items-center flex overflow-x-hidden backdrop-blur-sm overflow-y-hidden fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-1 mx-auto max-w-[320px] xs:max-w-lg sm:max-w-xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-5 border-b border-solid border-slate-200 rounded-t">
                  <h3 className="text-2xl font-semibold">
                  Otp Confirmation
                  </h3>
                  
                  {isClickedOnSendOtp !== ele._id?<button
                    className="p-1 ml-auto bg-transparent h-[29px] border-0 text-black opacity-40 float-right text-3xl leading-none font-semibold outline-none focus:outline-none"
                    onClick={() => closeMe()}
                  >
                    <span className=" text-[#000] text-[29px] block focus:outline-none">
                    ×
                    </span>
                  </button>: (
                      <div className="flex text-[20px] text-[#000] opacity-40 h-[29px] text-[17px] block focus:outline-non font-semibold gap-2">
                        {Math.floor(timer / 60)}:
                        {timer % 60 < 10 ? "0" + timer % 60 : timer % 60}
                      </div>
                    )}
                </div>
                {/*body*/}
                <div className="relative p-2 xs:p-6 w-full gap-2 flex flex-col items-center flex-auto">
                    {/* <input type="textarea" className="w-full h-[200px] text-[20px] rounded-md bg-[#ECE8DD] p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" placeholder="Enter Your Location..." name="" id="" /> */}
                    {ele.stage === "PENDING"?<div className="w-full h-full flex flex-col justify-center items-center">
                                    <div className="flex flex-col w-[300px] items-end gap-2 justify-between">
                                        <h2 className="text-[20px] font-semibold text-slate-800">Enter OTP <span className="text-[16px]">And Take It From User</span></h2>
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
                                        {isClickedOnSendOtp !== ele._id?<button onClick={()=>{sendOtpToCustomer(ele, ele.carId, ele._id)}} className="px-4 mb-8 h-[50px] bg-[#E8E2E2] shadow-lg text-black rounded-md font-semibold text-[#fff] cursor-pointer">Send OTP..</button>: (
                                          <div className="flex text-[20px] w-[220px] justify-center h-[50px] mb-8 font-semibold text-slate-600 gap-2">
                                            <div className="">
                                                Resend OTP In:
                                            </div>
                                            <div className="w-[64px]">
                                                {Math.floor(timer / 60)}:
                                                {timer % 60 < 10 ? "0" + timer % 60 : timer % 60}
                                            </div>
                                          </div>
                                        )}
                                        <button onClick={()=>{deliverOrder(ele.carId, ele._id)}} disabled={isDisabled} className="px-4 py-2 w-full text-[20px] bg-[#0081C9] rounded-md font-semibold text-[#fff] cursor-pointer">Deliver Car</button>
                                    </div>
                            </div>:ele.stage === "ONGOING"?<h2 className="text-[15px] font-semibold">Order's <span className="text-[20px] font-bold text-[#7B8FA1] ">Otp Submitted</span></h2>:<h2 className="text-[24px] text-[#285430] font-bold uppercase">success</h2>} 
                    <p className="my-1 xs:my-4 text-slate-500 text-[13px] xs:text-lg leading-relaxed">
                    When delivering the vehicle to the customer, please initiate the process by 
                    clicking the "Send OTP" button, which will send the OTP to the customer. 
                    Upon receipt of the OTP, kindly request the customer to present it, and 
                    take proper video and photos of the vehicle's condition. This documentation 
                    will assist in future reference and ensure a seamless transfer process upon 
                    the customer's submission of the vehicle.
                    </p>
                    <em className="text-red-600 ">Note:- Clear All Your Dues</em>
                </div>
                {/*footer*/}
                <div className="flex items-center justify-end p-2 border-t border-solid border-slate-200 rounded-b">
                  {/* <button
                    className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={() => closeMe()}
                  >
                    Close
                  </button> */}
                  {ele.stage === "PENDING"?<button
                    className="bg-emerald-500 text-white active:bg-emerald-600 font-bold uppercase text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                    type="button"
                    onClick={()=>{deliverOrder(ele.carId, ele._id)}} disabled={isDisabled} 
                  >
                    Deliver Car
                  </button>:""}
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>

        </div>
    }
    function closeMe(){
        setShowOtpModal(false)
        clearAllIntervals()
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
        <div className="flex w-full flex-col">
            {orderHistory && orderHistory.map((ele)=>(
                <div key={ele._id} className="flex w-full p-4 flex-col items-start justify-around border-dashed border-b-2 border-slate-400">
                    <div className="flex w-full p-4 flex-row items-start justify-around">
                        <div className="flex gap-8">
                            <div className="cursor-pointer" >
                             <img className="md:h-[200px] h-[150px] w-[250px] md:w-[280px] lg:w-[340px] object-contain" src={ele.url !== "EMPTY"?ele.url:car} alt="" />
                            </div>
                            <div className="flex w-full flex-row justify-between">
                                <div className="flex w-full flex-col gap-6">
                                    <h2 className="text-[18px] md:text-[30px] font-semibold md:font-bold">{ele.carName}</h2>
                                    <h1 className="text-[14px] md:text-[18px] font-semibold">Booked Cars: <span className="text-[#CD0404]">{ele.numberOfCars}</span></h1>
                                    <div>
                                        <h1 className="text-[15px] 2md:text-[20px] hidden xs:block text- font-medium">Start Date: <span className="text-[#FFEA20]">{ele.orderDate.startDate}</span></h1>
                                        <h1 className="text-[15px] 2md:text-[20px] hidden xs:block text- font-medium">End Date:  <span className="text-[#CD0404]">{ele.orderDate.endDate}</span></h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {ele.stage ==="PENDING"?<div className="flex flex-col justify-between h-[100px]">
                            <div>
                                <button onClick={()=>{deleteOrder(ele.carId, ele._id)}} className="text:sm xs:text-lg w-[100px] md:w-[150px] py-2 bg-[#CD0404] rounded-md font-semibold text-[#fff]">Delete Order</button>
                            </div>
                        </div>:ele.stage === "ONGOING"?<h2 className="text-[20px] font-semibold">Order is <span className="text-[24px] font-bold uppercase text-[#5F9DF7]">on going</span></h2>:<h2 className="text-[24px] text-[#285430] font-bold uppercase">success</h2>}
                    </div>
                    <div className="w-full flex flex-col gap-2 ">
                        <h2 onClick={()=>{showLocation(ele._id, ele.orderDate.startDate, ele.orderDate.endDate, ele.carId, ele.stage)}} className="text-[20px] font-semibold cursor-pointer flex items-end">More Info <img className="w-[30px]" src={expand} alt="" /></h2>
                        <div id={ele._id} className={isVisibleId === ele._id?"flex flex-col flex-wrap xs:flex-nowrap w-full justify-around":"hidden"}>
                            <div className="flex w-full flex-wrap gap-2 sm:flex-nowrap justify-around">
                                <table class="table-auto w-1/2 text-left text-[14px] sm:text-[18px]">
                                    <thead>
                                        <tr class="bg-gray-900 text-white">
                                            <th class="px-1 py-1 2md:px-4 2md:py-2">Country</th>
                                            <th class="px-1 py-1 2md:px-4 2md:py-2">State</th>
                                            <th class="px-1 py-1 2md:px-4 2md:py-2">City</th>
                                            <th class="px-1 py-1 2md:px-4 2md:py-2">Deliver To Address</th>
                                            <th class="px-1 py-1 2md:px-4 2md:py-2">Price</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="bg-gray-100 font-semibold">
                                            <td class="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{ele.carLocation.country}</td>
                                            <td class="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{ele.carLocation.state}</td>
                                            <td class="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{ele.carLocation.city}</td>
                                            <td class="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{ele.address}</td>
                                            <td class="border px-1 py-1 2md:px-4 2md:py-2 uppercase">₹{ele.price}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                <table className="table-auto max-w-lg 2md:w-1/2 text-left block xs:hidden text-[14px] sm:text-[18px]">
                                    <thead>
                                        <tr class="bg-gray-900 text-white">
                                            <th className="px-1 py-1 2md:px-4 2md:py-2">Start Date</th>
                                            <th className="px-1 py-1 2md:px-4 2md:py-2">End Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr class="bg-gray-100 font-semibold">
                                            <td className="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{ele.orderDate.startDate}</td>
                                            <td className="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{ele.orderDate.endDate}</td>
                                        </tr>
                                    </tbody>
                                </table>
                                {/* {ele.stage === "PENDING"?<div className="w-1/5 h-full flex flex-col justify-between">
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
                                        {isClickedOnSendOtp !== ele._id?<button onClick={()=>{sendOtpToCustomer(ele, ele.carId, ele._id)}} className="px-4 mb-8  py-2 bg-[#E8E2E2] shadow-lg text-black rounded-md font-semibold text-[#fff] cursor-pointer">Send OTP..</button>: (
                                          <div className="flex text-[20px] font-semibold gap-2">
                                            Timer: {Math.floor(timer / 60)}:
                                            {timer % 60 < 10 ? "0" + timer % 60 : timer % 60}
                                          </div>
                                        )}
                                    </div>
                                    <button onClick={()=>{deliverOrder(ele.carId, ele._id)}} disabled={isDisabled} className="px-4 py-2 text-[20px] bg-[#0081C9] rounded-md font-semibold text-[#fff] cursor-pointer">Deliver Order</button>
                            </div>:ele.stage === "ONGOING"?<h2 className="text-[15px] font-semibold">Order's <span className="text-[20px] font-bold text-[#7B8FA1] ">Otp Submitted</span></h2>:<h2 className="text-[24px] text-[#285430] font-bold uppercase">success</h2>} */}
                            <div>
                                {ele.stage === "PENDING"?<button onClick={()=>{showOtpModalFunc(ele)}} className="px-4 py-2 text-[20px] bg-[#0081C9] rounded-md font-semibold text-[#fff] cursor-pointer">Deliver Car</button>:ele.stage === "COMPLETE"?<h2 className="text-[24px] text-[#285430] font-bold uppercase">Successful Delivery</h2>:<h2 className="text-[15px] font-semibold">Order is <span className="text-[20px] font-bold text-[#82CD47] ">Ongoing</span></h2>}
                            </div>
                            {showOtpModal?modalContent(ele):""}
                            </div>
                            {/* {ele.orderDate.endDate < new Date().toISOString().substr(0, 16)&& ele.stage === "PENDING"?deleteOrder(ele.carId, ele._id):""} */}
                            <h2 onClick={()=>{knowCustomer(ele.userId)}} className="text-[20px] pb-2 font-semibold cursor-pointer flex items-end">Know your Customer ?<img className="w-[30px]" src={expand} alt="" /></h2>
                            <div className={isVisibleId === ele._id && userId === ele.userId ? "block w-full":"hidden"}>
                                <table class="table-auto w-1/2 text-left text-[14px] sm:text-[18px]">
                                        <thead>
                                            <tr class="bg-gray-900 text-white">
                                                <th class="px-1 py-1 2md:px-4 2md:py-2 uppercase">Name</th>
                                                <th class="px-1 py-1 2md:px-4 2md:py-2 uppercase">Email</th>
                                                <th class="px-1 py-1 2md:px-4 2md:py-2 uppercase">Role</th>
                                                <th class="px-1 py-1 2md:px-4 xs:block hidden 2md:py-2 uppercase">ID</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr class="bg-gray-100 font-semibold">
                                                <td class="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{userName}</td>
                                                <td class="border px-1 py-1 2md:px-4 2md:py-2 ">{userEmail}</td>
                                                <td class="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{userRole}</td>
                                                <td class="border px-1 py-1 xs:block hidden 2md:px-4 2md:py-2 ">{userId}</td>
                                            </tr>
                                        </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
            </div>
            ))}
        </div>
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