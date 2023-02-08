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
    useEffect(()=>{
        const thisCar = JSON.parse(localStorage.getItem("thisCar"))
        if(thisCar){
            // const thisCar = {
            //     carName: ele.carName,
            //     totalCars: ele.totalCars,
            //     numberOfCars: ele.numberOfCars,
            //     url: ele.url,
            //     allOrder: res.data.orders
            // }
            console.log(thisCar)
            setTotalCars(thisCar.totalCars)
            setCarTotal(thisCar.totalCars)
            setGlobalVariable(thisCar.allOrder)
            return
        }
    },[])
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
                        customerNames[`email${element}`] = res.data.user.email
                        console.log(res.data.user)
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
            {/* <div className="flex justify-around border-2 border-slate-500">
                <h1 className="text-[27px] font-semibold w-1/4 text-center ">User</h1>
                <h1 className="text-[27px] font-semibold border-r-2 border-l-2 w-1/4 text-center border-slate-500">StartDate</h1>
                <h1 className="text-[27px] font-semibold  border-r-2 border-l-0 w-1/4 text-center border-slate-500">EndDate</h1>
                <h1 className="text-[27px] font-semibold  w-1/4 text-center">Delete Order</h1>
            </div> */}
            <table class="table-auto w-full text-left text-[18px]">
                    <thead>
                        <tr class="bg-gray-900 text-white">
                            <th class="px-4 py-2 uppercase">User</th>
                            <th class="px-4 py-2 uppercase">Email</th>
                            <th class="px-4 py-2 uppercase">StartDate</th>
                            <th class="px-4 py-2 uppercase">EndDate</th>
                            <th class="px-4 py-2 uppercase">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.keys(customerNames).length !== 0 &&globalVariable !== "initial value"&&globalVariable.map((ele)=>(
                                <tr key={ele._id} className="bg-gray-100 font-semibold">
                                    {console.log(customerNames[ele.userId])}
                                    <td className="border px-4 py-2 uppercase">{customerNames[ele.userId]}</td>
                                    <td className="border px-4 py-2">{customerNames[`email${ele.userId}`]}</td>
                                    <td className="border px-4 py-2 uppercase">{ele.orderDate.startDate}</td>
                                    <td className="border px-4 py-2 uppercase">{ele.orderDate.endDate}</td>
                                    {ele.stage === "PENDING"?<td class="border px-4 py-2 uppercase">
                                        <button onClick={()=>{deleteThisOrder(ele.carId, ele._id)}} className=" w-[100px] py-2 bg-[#CD0404] rounded-md font-semibold text-[#fff]">Delete Me</button>
                                    </td>:ele.stage === "ONGOING"?<h2 className="text-[20px] font-semibold">Order is <span className="text-[24px] font-bold uppercase text-[#5F9DF7]">on going</span></h2>:<h2 className="text-[20px] font-semibold">Order is <span className="text-[24px] font-bold uppercase text-[#285430]">Successfull</span></h2>}
                                </tr>
                                ))}
                    </tbody>
            </table>

        </div>
        </>
    )
}