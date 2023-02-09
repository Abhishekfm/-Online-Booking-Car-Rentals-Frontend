import React from "react";
import car from "../images/car.png"
import axios from "axios";
import { useState } from "react";
import { isLux } from "../utils";
import pcar2 from "../images/pcar2.png"
import { ToastContainer, toast } from 'react-toastify';
// import ReactModal from "react-modal";

const customStyles = {
    content: {
      top: '50%',
      left: '50%',
      right: 'auto',
      bottom: 'auto',
      marginRight: '-50%',
      transform: 'translate(-50%, -50%)',
      width: '800px',
      height: '500px'
    }
};

export function CarList(props){
    const carData = props.carData
    const [isLoading, setIsLoading] = useState("")
    const [country, setCountry] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("")
    // console.log(carData);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [address, setAddress] = useState("");
    const [carRent, setCarRent] = useState("")
    
    const handleAddress = (e) => {
        setAddress(e.target.value);
    };
    
    const handleNext = () => {
      // Code to handle next button
      setModalIsOpen(false)
    };
    
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
                  Delivery Information: Address and Contact Number
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
                    {/* <input type="textarea" className="w-full h-[200px] text-[20px] rounded-md bg-[#ECE8DD] p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" placeholder="Enter Your Location..." name="" id="" /> */}
                    <div className="flex flex-col gap-1">
                        <label htmlFor="address" className="text-[15px] md:text-[20px] mb-4 font-semibold text-slate-500">Your Address must be in Country {country}, State {state} and City {city}</label>
                        <textarea id="address" maxLength={100} className="w-full h-[50px] md:h-[100px] resize-none text-[18px] rounded-md bg-[#ECE8DD] p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" onChange={(e)=>{setAddress(e.target.value)}} placeholder={`Enter Your Address in ${city}..`} name="" cols="30" rows="10"></textarea>
                    </div>
                    {/* <textarea id="address" maxLength={100} className="w-full h-[20px] resize-none text-[18px] rounded-md bg-[#ECE8DD] p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" placeholder={`Enter Your Phone Number`} name="" cols="30" rows="10"></textarea> */}
                    <div className="flex flex-col gap-">
                        <label htmlFor="phone" className="text-[15px] md:text-[20px] 2md:mb-4 font-semibold text-slate-500">Your Contact Number </label>
                        <input id="phone" maxLength={12} className="w-max h-[30px] md:h-[40px] resize-none text-[18px] rounded-md bg-[#ECE8DD] p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" placeholder={`Enter Your Contact Number`} type="text" inputMode="numeric" name=""/>
                    </div>
                    <p className="my-1 md:my-4 text-slate-500 text-md 2md:text-lg leading-relaxed">
                    Our agent will visit the address you provide to deliver the vehicle. 
                    They will ask for an OTP as confirmation. Please only provide the OTP 
                    if you have successfully received the vehicle. Failure to return the 
                    vehicle by the end date of your booking may result in additional charges.
                    </p>
                    <em className="text-red-600 text-[14px] 2md:text-lg">Note:- On End Date Deliver Vehicle on your nearest location of Mydrive App</em>
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
                    onClick={() => gotAddress()}
                  >
                    Rent Me
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>

        </div>
    );
    
    const calculateDifference = (start, end) => {
        const difference = new Date(end) - new Date(start);
        let days = Math.floor(difference / (1000 * 60 * 60 * 24));
        let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if(days < 0){
            days = 0
        }
        if(hours < 0){
            hours = 0
        }
        return [days, hours]
    };
    function preBook(elem){
        setCarRent(elem)
        setIsLoading(elem._id)
        setCountry(elem.carLocation.country)
        setState(elem.carLocation.state)
        setCity(elem.carLocation.city)
        setModalIsOpen(true)
    }
    function closeMe(){
        setCarRent("")
        setIsLoading("")
        setAddress("")
        // setCountry(elem.carLocation.country)
        // setState(elem.carLocation.state)
        // setCity(elem.carLocation.city)
        setModalIsOpen(false)
    }
    async function gotAddress(){
        if(!address){
            return
        }
        await rentMe(carRent)
    }
    async function rentMe(elem){
        try {
            if(props.startDate === props.endDate){
                console.log("Order Not Placed");
                toast.error("Order Not Placed Because Start and End Date Is Same")
                return
            }
            // setIsLoading(elem._id)
            // setCountry(elem.carLocation.country)
            // setState(elem.carLocation.state)
            // setCity(elem.carLocation.city)
            // setModalIsOpen(true)
            setAddress(address.trim())
            const res = await axios.post(`${props.BaseUrl}/u/bookcar`,{
                carId: elem._id,
                startDate: props.startDate,
                endDate: props.endDate,
                price: myPrice(elem.carName),
                address,
                url:elem.url || "EMPTY"
            },{ withCredentials:true })
            if(!res){
                setTimeout(() => {
                    setIsLoading("");
                    setModalIsOpen(false)
                    setAddress("")
                    props.showResults()
                    // startAdmin()
                }, 500);
                return
            }else{
                setTimeout(() => {
                    setIsLoading("");
                    setModalIsOpen(false)
                    setAddress("")
                    props.showResults()
                    // startAdmin()
                }, 500);
                console.log(res);
                // props.showResults();
            }
        } catch (error) {
            console.log(error);
        }
    }
    function myPrice(name){
        let [days, hours] = calculateDifference(props.startDate, props.endDate)
        let perHour = 100
        if(isLux(name)){
            perHour = 200
        }
        let finalPrice = Number(days) * 24 * perHour + Number(hours) * perHour
        console.log(finalPrice)
        return finalPrice
    }
    return(
        <>
        <ToastContainer/>
        <div  className={modalIsOpen ? "flex w-full gap-4 m-4 flex-col" : "flex w-full gap-4 m-4 flex-col"}>
        <div className="w-screen flex flex-col">
        {carData&&carData.map((ele)=>(
            <div className="flex w-full md:p-4 flex-row items-start justify-around border-dashed border-b-2 border-slate-400">
                <div className="">
                    {console.log(ele.url)}
                 <img className="md:h-[200px] h-[150px] w-[210px] md:w-[280px] lg:w-[340px] object-contain" src={ele.url? ele.url :isLux(ele.carName)?pcar2:car} alt="" />
                </div>
                <div className="flex w-[400px] lg:w-1/2 flex-row justify-between">
                    <div className="flex flex-col 2md:w-full">
                        <h2 className="text-[20px] lg:text-[30px] font-semibold">{ele.carName}</h2>
                        <h1 className="text-[20px] md:text-[30px] lg:text-[40px] text-[#F99417] font-semibold">₹{myPrice(ele.carName)}</h1>
                    </div>
                    <div>
                        {isLoading===ele._id?<button className="text-lg w-[100px] 2md:w-[120px] lg:w-[150px] rounded-[10px] font-semibold bg-[#1f1f1f] hover:bg-[#434242] text-white px-4 py-2">Renting...</button>:<button onClick={()=>{preBook(ele)}} className="lg:text-lg w-[100px] 2md:w-[120px] lg:w-[150px] rounded-[10px] font-semibold bg-[#1f1f1f] hover:bg-[#434242] text-white px-4 py-2">Rent Me</button>}
                    </div>
                </div>
            </div>
        ))}
        </div>
        {/* <ReactModal style={customStyles} className="" isOpen={modalIsOpen}>{modalContent}</ReactModal> */}
        {modalIsOpen? modalContent:""}
        <div className={props.showEmpty?"block w-full text-center":"hidden"}>
            <h1 className="text-[35px] font-bold">NO ORDERS!</h1>
        </div>
        </div>
        </>
    )
}