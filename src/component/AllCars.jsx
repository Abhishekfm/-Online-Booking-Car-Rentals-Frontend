import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import car from "../images/car.png"
import { PageNumber } from "./PageNumber";
import plus from "../images/plus.png"
import minus from "../images/minus-sign.png"
import expand from "../images/expand.png"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../contexts/MyContext";
import { useContext } from "react";


export function AllCars(props){
    const carData = props.carData
    const numberOfEntry = Number(props.totalEntry);
    const [numberOfPages, setNumberOfPages] = useState(0)
    const [globalVariable, setGlobalVariable, carName, setCarName, carTotal, setCarTotal, carAvailable, setCarAvailable, carUrl, setCarUrl ] = useContext(MyContext);
    // const [clickMoreInfo, setMoreInfo] = useState(1)
    const [isVisibleId, setIsVisibleId] = useState(null);
    const [isLoading, setIsLoading] = useState(null)
    const navigate = useNavigate()
    function startAdmin() {
        if(numberOfEntry > 0){
            setNumberOfPages(Math.ceil(numberOfEntry/5))
            console.log(numberOfEntry);
            console.log(numberOfPages);
        }
        console.log(`numberOfEntry:${numberOfEntry}`);
        console.log(`numberOfPages:${numberOfPages}`);
    }
    useEffect(()=>{
        startAdmin()
    },[props.totalEntry])
    console.log(carData);
    async function addOneMoreCar(carId){
        try {
            const res = await axios.get(`${props.BaseUrl}/admin/addcaratsamelocation/${carId}`,
            { withCredentials: true }
            )
            if(!res){
                return
            }else{
                console.log(res);
                props.reRendor()
            }
        } catch (error) {
            console.log(error);
        }
    }
    async function decOneMoreCar(carId){
        try {
            const res = await axios.get(`${props.BaseUrl}/admin/decrementcaratsamelocation/${carId}`,
            { withCredentials: true }
            )
            if(!res){
                return
            }else{
                console.log(res);
                props.reRendor()
            }
        } catch (error) {
            console.log(error);
        }
    }

    async function showLocation(carId){
        if(isVisibleId === carId){
            setIsVisibleId(null)
            return
        }
        setIsVisibleId(carId)
    }
    async function deleteCar(carId){
        try {
            setIsLoading(carId)
            console.log(carId);
            console.log(isLoading);
            const res = await axios.delete(`${props.BaseUrl}/admin/deletecar/${carId}`,
            { withCredentials: true }
            )
            if(!res){
                setTimeout(() => {
                    setIsLoading("");
                }, 500);
                return
            }else{
                setTimeout(() => {
                    setIsLoading("");
                    props.reRendor()
                    startAdmin()
                }, 500);
                console.log(res);
                // props.reRendor()
            }
        } catch (error) {
            console.log(error);
        }
    }
    async function showOrderOfCar(ele){
        try {
            let carId = ele._id
            const res = await axios.get(`${props.BaseUrl}/admin/getordersofcar/${carId}`,
            { withCredentials: true }
            )
            if(!res){
                console.log(res);
                return
            }else{
                console.log(res);
                setCarName(ele.carName)
                setCarTotal(ele.totalCars)
                setCarAvailable(ele.numberOfCars)
                setCarUrl(ele.url)
                setGlobalVariable(res.data.orders)
                const thisCar = {
                    carName: ele.carName,
                    totalCars: ele.totalCars,
                    numberOfCars: ele.numberOfCars,
                    url: ele.url,
                    allOrder: res.data.orders
                }
                localStorage.setItem("thisCar", JSON.stringify(thisCar))
                navigate("/ordersofthiscar")
                // props.reRendor()
            }
        } catch (error) {
            console.log(error);
        }
    }
    return(
        <div className="w-full">
            <div className="flex w-full gap-4 flex-col">
                {carData&&carData.map((ele)=>(
                    <div className="flex flex-col items-center border-dashed border-b-2 border-slate-400">
                        <div key={ele._id} className="flex w-full p-4 flex-row items-start justify-between md:justify-around ">
                            <div className="flex w-[400px] md:w-1/2 gap-4">
                                <div className="cursor-pointer" onClick={()=>{showOrderOfCar(ele)}} >
                                 <img className="md:h-[200px] h-[150px] w-[100px] xs:w-[250px] md:w-[280px] lg:w-[340px] object-contain" src={ele.url? ele.url :car} alt="" />
                                </div>
                                <div className="flex w-1/2 flex-row justify-between">
                                    <div className="flex flex-col gap-6">
                                        <h2 className="text-[18px] md:text-[30px] font-semibold md:font-bold">{ele.carName}</h2>
                                        <h1 className="text-[14px] md:text-[18px] font-semibold">Available Cars: <span className="text-[#CD0404]">{ele.numberOfCars}</span></h1>
                                        <h1 className="text-[14px] md:text-[18px] font-semibold">Total Cars: <span className="text-[#CD0404]">{ele.totalCars}</span></h1>
                                        <h2 onClick={()=>{showLocation(ele._id)}} className="text-[15px] sm:text-[20px] cursor-pointer flex items-end">More Info <img className="w-[30px]" src={expand} alt="" /></h2>
                                        {/* <div id={ele._id} className={isVisibleId === ele._id?"block":"hidden"}>
                                            <p className="text-[20px]">Country: {ele.carLocation.country}</p>
                                            <p className="text-[20px]">State: {ele.carLocation.state}</p>
                                            <p className="text-[20px]">City: {ele.carLocation.city}</p>
                                        </div> */}
                                    </div>
                                </div>
                            </div>
                            <div className="flex w-[100px] xs:w-[150px] flex-col justify-between h-[100px]">
                                <div>
                                    {isLoading === ele._id?<button className="py-2 w-full bg-[#CD0404] rounded-md font-semibold text-[#fff]">Deleting....</button>:<button onClick={()=>{deleteCar(ele._id)}} className="py-2 w-full bg-[#CD0404] rounded-md font-semibold text-[#fff]">Delete</button>}
                                </div>
                                <div className="flex flex-row items-center w-[100px] xs:w-[150px] justify-between">
                                    <button onClick={()=>{addOneMoreCar(ele._id)}} className="transition ease-in-out delay-10 hover:-translate-y-2 hover:scale-125 duration-300 rounded-[10px] w-[15px] md:w-[20px] font-semibold text-[#000]"><img src={plus} alt="" /></button>
                                    <p className=" font-semibold text-[20px] md:text-[25px]">{ele.numberOfCars}</p>
                                    <button onClick={()=>{decOneMoreCar(ele._id)}} className="transition ease-in-out delay-10 hover:-translate-y-2 hover:scale-125 duration-300 rounded-[10px] w-[15px] md:w-[20px] font-semibold text-[#000]"><img src={minus} alt="" /></button>
                                </div>
                            </div>
                        </div>
                        <table className={isVisibleId === ele._id?"block text-center table-auto text-left text-[18px]":"hidden"}>
                            <thead>
                                <tr class="bg-gray-900 text-white">
                                    <th class="px-1 py-1 2md:px-4 2md:py-2">Country</th>
                                    <th class="px-1 py-1 2md:px-4 2md:py-2">State</th>
                                    <th class="px-1 py-1 2md:px-4 2md:py-2">City</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr class="bg-gray-100 font-semibold">
                                    <td class="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{ele.carLocation.country}</td>
                                    <td class="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{ele.carLocation.state}</td>
                                    <td class="border px-1 py-1 2md:px-4 2md:py-2 uppercase">{ele.carLocation.city}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                ))}
            </div>
            {/* {numberOfPages ? <PageNumber setSkip={props.nom} pages={numberOfPages}/>: ""} */}
            <PageNumber setSkip={props.nom} pages={numberOfPages}/>
        </div>
    )
}