import axios from "axios";
import React from "react";
import { useState } from "react";
import countryData from "../allCountries.json"
import { lookup } from "country-data";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
let stateData = []
const setStateData = async (countryCode) => {
    const res = await axios.get(`https://laravel-world.com/api/states?filters%5Bcountry_code%5D=${countryCode}&fields=cities`)
    console.log(res);
    stateData = res.data.data
}

const getCode = (country) => {
    const myres = countryData.find(ele => {
        return ele.name.toLowerCase() === country.toLowerCase()
    })
    return myres.code
}

export function SearchPage({BaseUrl}){
    const [country, setCountry] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("")
    const [countryCode, setCountryCode] = useState("")

    const countrySuggestion = async(location)=>{
        setCountry(location)
    }

    const fillCountry = (val)=>{
        setCountry(val.name)
        setCountryCode(val.code)
    }

    const stateSuggestion = async(location)=>{
        if(!country){
            toast.clearWaitingQueue({ containerId: "toast1" });
            toast.error("First enter country")
            setState("")
            return
        }
        setState(location)
        const myCode = getCode(country)
        await setStateData(myCode)
    }
    const fillState = (val)=>{
        setState(val.name)
    }

    return(
        <>
        <ToastContainer containerId={'toast1'} limit={1}/>
        <div className="flex flex-col h-[800px] bg-[#BAD7E9]">
            <div className="flex flex-col items-center gap-[20px]">
                <div>
                    <h1 className="text-[50px] font-extrabold text-[#F9ED69] drop-shadow-lg">Search To <span className="text-[#3A4F7A]">Rent</span> A Car</h1>
                </div>
                <div className="flex flex-row justify-around w-full items-end">
                    <div className="flex flex-col relative">
                        <h2>Your Country</h2>
                        <input className="text-[20px] rounded-md p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" type="text" value={country} placeholder="Country" onChange={(event)=>{countrySuggestion(event.target.value)}}/>
                        <div className="flex flex-col text-black max-h-[200px] overflow-x-scroll text-[18px] bg-white top-[80px] left-[0px] absolute">
                            {countryData && countryData.filter((item) => {
                                const searchTerm = country.toLowerCase()
                                const fullCountry = item.name.toLowerCase()
                                return searchTerm && fullCountry.includes(searchTerm) && searchTerm !== fullCountry 
                            }).map((item)=>{
                                return(<div key={item.name} className="text-start cursor-pointer pl-2 border-2 text-[18px] border-slate-400 text-black" onClick={()=>{fillCountry(item)}}>
                                    {item.name}
                                </div>)
                            })}
                        </div>
                    </div>
                    <div className="flex flex-col relative">
                        <h2>Your State</h2>
                        <input className="text-[20px] rounded-md p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" type="text" placeholder="State" value={state} onChange={(event)=>{stateSuggestion(event.target.value)}} />
                        <div className="flex flex-col text-black max-h-[200px] overflow-y-scroll text-[18px] bg-white top-[80px] w-full left-[0px] absolute">
                            {stateData && stateData.filter((item) => {
                                const searchTerm = state.toLowerCase()
                                const stateCountry = item.name.toLowerCase()
                                return searchTerm && stateCountry.includes(searchTerm) && searchTerm !== stateCountry 
                            }).map((item)=>{
                                return(<div key={item.name} className="text-start cursor-pointer pl-2 border-2 text-[18px] border-slate-400 text-black" onClick={()=>{fillState(item)}}>
                                    {item.name}
                                </div>)
                            })}
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h2>Your City</h2>
                        <input className="text-[20px] rounded-md p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" type="text" placeholder="City"/>
                    </div>
                    <div className="flex flex-col justify-around ">
                        <h2>Start Date</h2>
                        <input className="text-[20px] rounded-md p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" type="datetime-local" name="" id="" />
                    </div>
                    <div className="flex flex-col justify-around ">
                        <h2>End Date</h2>
                        <input className="text-[20px] rounded-md p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" type="datetime-local" name="" id="" />
                    </div>
                    <div className="">
                        <button className="bg-[#3A4F7A] h-[50px] px-8 rounded-lg shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] z-10 text-lg text-white" >Search</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}