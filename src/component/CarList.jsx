import React from "react";
import car from "../images/car.png"
import axios from "axios";

export function CarList(props){
    const carData = props.carData
    console.log(carData);
    async function rentMe(elem){
        try {
            if(props.startDate === props.endDate){
                console.log("Order Not Placed");
                return
            }
            const res = await axios.post(`${props.BaseUrl}/u/bookcar`,{
                carId: elem._id,
                startDate: props.startDate,
                endDate: props.endDate
            },{ withCredentials: true })
            if(!res){
                return
            }else{
                console.log(res);
                props.showResults();
            }
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <div className="flex w-full gap-4 m-4 flex-col">
        {carData&&carData.map((ele)=>(
            <div className="flex w-full p-4 flex-row items-start justify-around border-dashed border-b-2 border-slate-400">
                <div>
                 <img className="h-[200px] w-[340px] object-cover" src={ele.url? ele.url :car} alt="" />
                </div>
                <div className="flex w-1/2 flex-row justify-between">
                <div className="flex flex-col">
                    <h2 className="text-[30px] font-semibold">{ele.carName}</h2>
                    <h1 className="text-[40px] font-bold">20000 ₹</h1>
                </div>
                <div>
                    <button onClick={()=>{rentMe(ele)}} className="text-lg rounded-[10px] font-semibold bg-[#1f1f1f] text-white px-4 py-2">Rent Me</button>
                </div>
                </div>
            </div>
        ))}
    </div>
    )
}