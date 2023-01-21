import React from "react";
import car from "../images/car.png"
import axios from "axios";
import { useState } from "react";

export function CarList(props){
    const carData = props.carData
    const [isLoading, setIsLoading] = useState("")
    console.log(carData);
    async function rentMe(elem){
        try {
            if(props.startDate === props.endDate){
                console.log("Order Not Placed");
                return
            }
            setIsLoading(elem._id)
            const res = await axios.post(`${props.BaseUrl}/u/bookcar`,{
                carId: elem._id,
                startDate: props.startDate,
                endDate: props.endDate
            },{ withCredentials: true })
            if(!res){
                setTimeout(() => {
                    setIsLoading("");
                    props.showResults()
                    // startAdmin()
                }, 500);
                return
            }else{
                setTimeout(() => {
                    setIsLoading("");
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
                    {isLoading===ele._id?<button className="text-lg w-[150px] rounded-[10px] font-semibold bg-[#5B8FB9] text-white px-4 py-2">Renting...</button>:<button onClick={()=>{rentMe(ele)}} className="text-lg w-[150px] rounded-[10px] font-semibold bg-[#5B8FB9] text-white px-4 py-2">Rent Me</button>}
                </div>
                </div>
            </div>
        ))}
        <div className={props.showEmpty?"block w-full text-center":"hidden"}>
            <h1 className="text-[35px] font-bold">NO ORDERS!</h1>
        </div>
        </div>
    )
}