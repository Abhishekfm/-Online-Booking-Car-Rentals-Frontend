import React from "react";
import { useContext } from "react";
import { MyContext } from "../contexts/MyContext";
import { NavBar } from "../component/NavBar";
import car from "../images/car.png"
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function OrdersOfThisCar(props){
    const [globalVariable, setGlobalVariable, carName, setCarName, carTotal, setCarTotal, carAvailable, setCarAvailable, carUrl, setCarUrl] = useContext(MyContext);
    const [customerNames, setCustomerNames] = useState({})
    const [totalCars, setTotalCars] = useState(0)
    const BaseUrl = "http://localhost:4000"
    const navigate = useNavigate()
    async function getName(id){
        try {
            const res = await axios.get(`${BaseUrl}/admin/getname/${id}`,{ withCredentials: true })
            if(!res){
                return 
            }else{
                console.log(res.data.user.name);
                return res.data.user.name;
            }
        } catch (error) {
            console.log(error);
        }
    }
    useEffect(() => {
        async function makeCustomerName() {
            let customerNames = {};
            for (let index = 0; index < globalVariable.length; index++) {
                const element = globalVariable[index].userId;
                if(customerNames[element]){
                    continue
                }
                await axios.get(`${BaseUrl}/admin/getname/${element}`,{ withCredentials: true }).then((res) => {
                        customerNames[element] = res.data.user.name;
                    });
            }
            if(globalVariable.length > 0){
                await axios.get(`${BaseUrl}/admin/gettotalcars/${globalVariable[0].carId}`,{ withCredentials: true }).then((res) => {
                    console.log(res);
                    setTotalCars(res.data.car.totalCars)
                });
            }
            console.log(customerNames);
            setCustomerNames(customerNames)
            console.log(globalVariable);
        }
        if(globalVariable !== "initial value"){
            makeCustomerName();
        }
    }, [globalVariable]);
    async function deleteThisOrder(carId, orderId){
        try {
            const res = await axios.delete(`${props.BaseUrl}/admin/deleteorderbyid/${carId}/${orderId}`,{withCredentials:true})
            if(!res){
                return
            }else{
                console.log(res);
                // setUserAndOrder(res.data.thisOrder.userId, customerName, customerEmail, customerRole, true)
                navigate("/admin")
                return
            }
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <>
        <div className="">
            <NavBar BaseUrl={props.BaseUrl}/>
            <div className="flex justify-around float-right p-4">
                <div className="text-end">
                    <h1 className="text-[22px] font-semibold underline">Total Cars: <span className="text-[#CD0404]">{carTotal}</span></h1>
                    <h1 className="text-[22px] font-semibold underline">Order Items: <span className="text-[#CD0404]">{globalVariable.length}</span></h1>
                </div>
            {/* <h1 className="text-[22px] font-semibold">{globalVariable[0].carId}</h1> */}
            </div>
            <div className="text-center w-full">
                <h1 className="text-[40px] font-bold">{carName}</h1>
            </div>
            <div className="flex justify-center h-[300px] w-full">
                <img src={carUrl?carUrl:car} className="object-fit" alt="" />
            </div>
            <div className="flex justify-around border-2 border-slate-500">
                <h1 className="text-[27px] font-semibold w-1/4 text-center ">User</h1>
                <h1 className="text-[27px] font-semibold border-r-2 border-l-2 w-1/4 text-center border-slate-500">StartDate</h1>
                <h1 className="text-[27px] font-semibold  border-r-2 border-l-0 w-1/4 text-center border-slate-500">EndDate</h1>
                <h1 className="text-[27px] font-semibold  w-1/4 text-center">Delete Order</h1>
            </div>
            {Object.keys(customerNames).length !== 0 &&globalVariable !== "initial value"&&globalVariable.map((ele)=>(
                <div key={ele._id} className="flex w-full border-t-0 h-[60px] border-2 border-slate-500 justify-between items-center font-semibold text-[18px] flex-row">
                    {console.log(customerNames[ele.userId])}
                    <h2 className="text-[20px] font-semibold h-full w-1/4 text-center ">{customerNames[ele.userId]}</h2>
                    <h2 className="text-[20px] font-semibold h-full border-r-2 border-l-2 w-1/4 text-center border-slate-500">{ele.orderDate.startDate}</h2>
                    <h2 className="text-[20px] font-semibold  h-full border-r-2 border-l-0 w-1/4 text-center border-slate-500">{ele.orderDate.endDate}</h2>
                    <div className="text-[20px] font-semibold h-full  w-1/4 text-center">
                        <button onClick={()=>{deleteThisOrder(ele.carId, ele._id)}} className="px-4 py-2 bg-[#CD0404] m-2 rounded-md font-semibold text-[#fff]">Delete Me</button>
                    </div>
                </div>
            ))}

        </div>
        </>
    )
}