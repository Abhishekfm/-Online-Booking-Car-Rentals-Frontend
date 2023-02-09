import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import car from "../images/car.png"
import expand from "../images/expand.png"
import banner5 from "../images/banner5.jpg"
import { MyContext } from "../contexts/MyContext";
import { PageNumber } from "./PageNumber";

export function OrderCars({ BaseUrl }){
    const [showEmpty, setShowEmpty] = useState(false)
    const [user, setUser ] = useContext(MyContext)
    const [allOrder, setAllOrder] = useState([])
    let intervalIds = [];
    //added
    const [fine, setFine] = useState("")
    const [isVisibleId, setIsVisibleId] = useState(null);
    const [getDbOtp, setGetDbOtp] = useState(0);
    const [otp, setOtp] = useState(Array(6).fill(''));
    const [timer, setTimer] = useState(30);
    const [isClickedOnSendOtp, setIsClickedOnSendOtp] = useState("")
    const [isOtpVerified, setIsOtpVerified] = useState("")
    const [showOtpModal, setShowOtpModal] = useState(false)
    const [skipNo2, setSkipNo2] = useState(0)
    const [numberOfPages2, setNumberOfPages2] = useState(0)

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
    const modalContent = (ele) => {
        return <div>
            <div
            className="justify-center items-center flex overflow-x-hidden backdrop-blur-sm overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none"
          >
            <div className="relative w-auto my-6 mx-auto max-w-[320px] xs:max-w-lg sm:max-w-xl">
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex items-start justify-between p-1 xs:p-5 border-b border-solid border-slate-200 rounded-t">
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
                    {ele.stage === "ONGOING"?<div className="w-full h-full flex flex-col justify-center items-center">
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
                                    {isClickedOnSendOtp !== ele._id?<button onClick={()=>{sendOtpToAdmin(ele, ele.carId, ele._id)}} className="px-4 mb-8 h-[50px] bg-[#E8E2E2] shadow-lg text-black rounded-md font-semibold text-[#fff] cursor-pointer">Send OTP..</button>: (
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
                                    <button onClick={()=>{deliverOrder(ele.carId, ele._id)}} disabled={isDisabled} className="px-4 py-2 text-[20px] w-full bg-[#0081C9] rounded-md font-semibold text-[#fff] cursor-pointer">Deliver Car</button>
                                </div>
                            </div>:ele.stage === "PENDING"?<h2 className="text-[15px] font-semibold">Order is <span className="text-[20px] font-bold text-[#82CD47] ">Still Pending</span></h2>:<h2 className="text-[24px] text-[#285430] font-bold uppercase">success</h2>}
                    <p className="my-1 xs:my-4 text-slate-500 text-[13px] xs:text-lg leading-relaxed">
                    Before delivery of the vehicle, please click on the "Send OTP" button. 
                    This will generate the OTP, which will be received by our agent. Upon delivery, 
                    it is necessary to provide the OTP and settle any outstanding debts or fines. 
                    Our agent will inspect the condition of the vehicle and release the OTP only 
                    after confirming its satisfactory state.
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
                  {ele.stage === "ONGOING"?<button
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

    async function deleteOrder(carId, orderId){
        try {
            const res = await axios.delete(`${BaseUrl}/admin/deleteorderbyid/${carId}/${orderId}`,{ withCredentials:true })
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
            },{ withCredentials:true })
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
    function calculateFine(ele) {
        let endDate = new Date(ele.orderDate.endDate);
        let now = new Date()

        if (endDate < now) {
            let diff = (now - endDate) / (1000 * 60 * 60);
            console.log(diff)
            // setFine(String(Math.ceil(diff * 200)));
            // console.log(fine)
            return Math.ceil(diff * 100)
        }
        return 0
    }
    function clearAllIntervals() {
        intervalIds.forEach(intervalId => {
          clearInterval(intervalId);
        });
        intervalIds = [];
    }
    async function sendOtpToAdmin(ele, carId, orderId){
        try {
            setIsClickedOnSendOtp(orderId);
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
            
            const sbjct = "Recieve The Vehicle"
            const f = calculateFine(ele);
            const msg = `This is your one-time password. Give This OTP to our Customer. 
            When you recieve ${ele.carName} car ${Number(f) === 0?"":`and fine of ₹${f} and Customer is fined because Customer have used the Vehicle for more than ${Math.floor(f/200)} Hour`}`
            const res = await axios.get(`${BaseUrl}/u/sendotp/${orderId}/${sbjct}/${msg}`,{ withCredentials:true })
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
            const res = await axios.get(`${BaseUrl}/u/myorder/${skipNo2}`, { withCredentials:true })
            if(!res){
                return
            }else{
                console.log(res)
                if(res.data.allFiveOrder.length <= 0){
                    setShowEmpty(true)
                }else{
                    setShowEmpty(false)
                }
                let page = Math.ceil(Number(res.data.totalLength)/5)
                setNumberOfPages2(page)
                setAllOrder(res.data.allFiveOrder)
                console.log(res);
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(()=>{
        myOrders()
    },[skipNo2])
    async function deleteMe(carId, orderId){
        try {
            const res = await axios.delete(`${BaseUrl}/u/deleteorder/${carId}/${orderId}`,{ withCredentials:true })
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
    function showOtpModalFunc(ele){
        setShowOtpModal(true)
    }
    return(
        <>
        <div className="flex flex-col gap-2">
            <div className='w-full h-[70px] sm:h-[110px] p-[10px]'>
              <img src={banner5} className="w-full rounded-[10px] 2md:rounded-[20px] h-[200px] 2md:h-[350px] object-cover" alt="" />
            </div>
            <div className='w-full h-[100px] 2md:h-[230px] text-center sm:pt-[10px]'>
                <h1 className="text-[40px] 2md:text-[50px] font-extrabold drop-shadow-lg text-white drop-shadow-lg">My Orders</h1>
            </div>
            {allOrder&&allOrder.map((ele)=>(
                <div className={!showEmpty?"flex w-full p-4 flex-col items-start justify-around border-dashed border-b-2 border-slate-400":"hidden"}>
                    <div className="flex w-full p-4 flex-row h-full items-start justify-around ">
                        <div>
                         <img className="md:h-[200px] h-[150px] w-[250px] md:w-[280px] lg:w-[340px] object-contain" src={ele.url !== "EMPTY"?ele.url:car} alt="" />
                        </div>
                        <div className="flex w-[400px] lg:w-1/2 flex-row h-full justify-between">
                            <div className="flex flex-col 2md:h-[200px] gap-2 justify-between 2md:w-full">
                                <h2 className="text-[18px] md:text-[30px] font-semibold md:font-bold">{ele.carName}</h2>
                                <h1 className="text-[15px] 2md:text-[20px] hidden xs:block text- font-medium">Start Date: <span className="text-[#FFEA20]">{ele.orderDate.startDate}</span></h1>
                                <h1 className="text-[15px] 2md:text-[20px] hidden xs:block font-medium">End Date:  <span className="text-[#CD0404]">{ele.orderDate.endDate}</span></h1>
                            </div>
                            {ele.stage ==="PENDING"?<div className="flex flex-col justify-between h-[100px]">
                            <div className="flex flex-col items-center 2md:w-[200px]">
                                <h1 className="text-[15px] sm:text-[20px] font-semibold">Price: ₹{ele.price}</h1>
                                <button onClick={()=>{deleteMe(ele.carId, ele._id)}} className="text:sm xs:text-lg py-2 w-[100px] lg:w-[150px] rounded-[10px] font-semibold bg-[#CD0404] text-white 2md:px-4 2md:py-2">Delete Order</button>
                            </div>
                            </div>:ele.stage === "ONGOING"?<h2 className="text-[20px] font-semibold">Order is <span className="text-[20px] sm:text-[24px] font-bold uppercase text-[#5F9DF7]">on going</span></h2>:<h2 className="text-[20px] sm:text-[24px] text-[#285430] font-bold uppercase">success</h2>}
                        </div>
                    </div>
                    <div className="w-full flex flex-col gap-2 ">
                        <h2 onClick={()=>{showLocation(ele._id, ele.orderDate.startDate, ele.orderDate.endDate, ele.carId, ele.stage)}} className="text-[15px] sm:text-[20px] font-semibold cursor-pointer flex items-end">More Info <img className="w-[30px]" src={expand} alt="" /></h2>
                        <div id={ele._id} className={isVisibleId === ele._id?"flex w-full flex-wrap gap-2 xs:gap-0 xs:flex-nowrap justify-around":"hidden"}>
                            <table className="table-auto max-w-lg 2md:w-1/2 text-left text-[18px]">
                                <thead>
                                    <tr class="bg-gray-900 text-white">
                                        <th className="px-1 py-1 2md:px-4 2md:py-2">Country</th>
                                        <th className="px-1 py-1 2md:px-4 2md:py-2">State</th>
                                        <th className="px-1 py-1 2md:px-4 2md:py-2">City</th>
                                        {ele.address?<th className="px-4 py-2">Recieving Address</th>:""}
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="bg-gray-100 font-semibold">
                                        <td className="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{ele.carLocation.country}</td>
                                        <td className="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{ele.carLocation.state}</td>
                                        <td className="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{ele.carLocation.city}</td>
                                        {ele.address?<td className="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{ele.address}</td>:""}
                                    </tr>
                                </tbody>
                            </table>
                            <table className="table-auto max-w-lg 2md:w-1/2 text-left block xs:hidden text-[18px]">
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
                            <div>
                            {ele.stage === "ONGOING"?<button onClick={()=>{showOtpModalFunc(ele)}} className="px-4 py-2 text-[20px] bg-[#0081C9] rounded-md font-semibold text-[#fff] cursor-pointer">Deliver Car</button>:ele.stage === "COMPLETE"?<h2 className="text-[24px] text-[#285430] font-bold uppercase">Successful Delivery</h2>:<h2 className="text-[15px] font-semibold">Order is <span className="text-[20px] font-bold text-[#82CD47] ">Still Pending</span></h2>}
                            </div>
                            {showOtpModal?modalContent(ele):""}
                            {/* {ele.stage === "ONGOING"?<div className="w-1/5 h-full flex flex-col justify-between">
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
                                    {isClickedOnSendOtp !== ele._id?<button onClick={()=>{sendOtpToAdmin(ele, ele.carId, ele._id)}} className="px-4 mb-8  py-2 bg-[#E8E2E2] shadow-lg text-black rounded-md font-semibold text-[#fff] cursor-pointer">Send OTP..</button>: (
                                      <div className="flex text-[20px] font-semibold gap-2">
                                        Timer: {Math.floor(timer / 60)}:
                                        {timer % 60 < 10 ? "0" + timer % 60 : timer % 60}
                                      </div>
                                    )}
                                </div>
                                <button onClick={()=>{deliverOrder(ele.carId, ele._id)}} disabled={isDisabled} className="px-4 py-2 text-[20px] bg-[#0081C9] rounded-md font-semibold text-[#fff] cursor-pointer">Deliver Order</button>
                            </div>:ele.stage === "PENDING"?<h2 className="text-[15px] font-semibold">Order is <span className="text-[20px] font-bold text-[#82CD47] ">Still Pending</span></h2>:<h2 className="text-[24px] text-[#285430] font-bold uppercase">success</h2>} */}
                            {/* {ele.orderDate.endDate < new Date().toISOString().substr(0, 16)&& ele.stage === "PENDING"?deleteOrder(ele.carId, ele._id):""} */}
                        </div>
                    </div>
                </div>
            ))}
            <div className={showEmpty?"block w-full text-center":"hidden"}>
                <h1 className="text-[35px] font-bold">NO ORDERS!</h1>
            </div>
            <PageNumber setSkip={setSkipNo2} pages={numberOfPages2}/>
        </div>
        </>
    )
}