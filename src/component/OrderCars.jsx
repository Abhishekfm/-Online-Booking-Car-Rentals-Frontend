import axios from "axios";
import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import Banner from "../images/Banner.jpg"
import car from "../images/car.png"
import banner4 from "../images/banner4.jpg"
import banner5 from "../images/banner5.jpg"
import { MyContext } from "../contexts/MyContext";

export function OrderCars({ BaseUrl }){
    const [showEmpty, setShowEmpty] = useState(false)
    const [user, setUser ] = useContext(MyContext)
    const [allOrder, setAllOrder] = useState([])
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
                <div className={!showEmpty?"flex w-full p-4 flex-row items-start justify-around border-dashed border-b-2 border-slate-400":"hidden"}>
                    <div>
                     <img className="h-[200px] w-[340px] object-cover" src={car} alt="" />
                    </div>
                    <div className="flex w-1/2 flex-row justify-between">
                    <div className="flex flex-col h-[200px] justify-between w-full">
                        <h2 className="text-[30px] font-bold">{ele.carName}</h2>
                        <h1 className="text-[20px] text- font-medium">Start Date: <span className="text-[#FFEA20]">{ele.orderDate.startDate}</span></h1>
                        <h1 className="text-[20px] font-medium">End Date:  <span className="text-[#CD0404]">{ele.orderDate.endDate}</span></h1>
                    </div>
                    <div className="flex flex-col items-center w-[200px]">
                        <h1 className="text-[20px] font-semibold">Price: 20000</h1>
                        <button onClick={()=>{deleteMe(ele.carId, ele._id)}} className="text-lg rounded-[10px] font-semibold bg-[#CD0404] text-white px-4 py-2">Delete Order</button>
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