import React from "react";
import { useContext } from "react";
import { MyContext } from "../contexts/MyContext";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";

export function OrdersOfThisCar(props){
    const [globalVariable, setGlobalVariable] = useContext(MyContext);
    const [customerNames, setCustomerNames] = useState({})
    const [totalCars, setTotalCars] = useState(0)
    const BaseUrl = "http://localhost:4000"
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
            console.log(globalVariable[0].carId);
            await axios.get(`${BaseUrl}/admin/gettotalcars/${globalVariable[0].carId}`,{ withCredentials: true }).then((res) => {
                console.log(res);
                setTotalCars(res.data.car.totalCars)
            });
            console.log(customerNames);
            setCustomerNames(customerNames)
            console.log(globalVariable);
        }
        if(globalVariable !== "initial value"){
            makeCustomerName();
        }
    }, [globalVariable]);
    return(
        <>
        <div className="h-full">
            <div className="flex justify-around">
            <h1 className="text-[30px] font-semibold">{globalVariable[0].carName}</h1>
            <div>
            {totalCars>0?<h1>Total Cars: {totalCars}</h1>:<h1>Total Cars: 0</h1>}
            <h1>Order Items: {globalVariable.length}</h1>
            </div>
            {/* <h1 className="text-[22px] font-semibold">{globalVariable[0].carId}</h1> */}
            </div>
            <div className="flex justify-around">
            <h1 className="text-[22px] font-semibold">User</h1>
            <h1 className="text-[22px] font-semibold">StartDate</h1>
            <h1 className="text-[22px] font-semibold">EndDate</h1>
            </div>
            {Object.keys(customerNames).length !== 0 &&globalVariable !== "initial value"&&globalVariable.map((ele)=>(
                <div key={ele._id} className="flex w-full gap-4 justify-between h-[400px] font-semibold text-[18px] justify-around flex-row">
                    {console.log(customerNames[ele.userId])}
                    <h2>{customerNames[ele.userId]}</h2>
                    <h2>{ele.orderDate.startDate}</h2>
                    <h2>{ele.orderDate.endDate}</h2>
                </div>
            ))}

        </div>
        </>
    )
}