import axios from "axios";
import React from "react";
import { useState } from "react";
import countryData from "../allCountries.json"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
let stateData = []
let cityData = []
const setStateData = async (countryCode) => {
    const res = await axios.get(`https://laravel-world.com/api/states?filters%5Bcountry_code%5D=${countryCode}&fields=cities`)
    if(!res){
        return
    }
    stateData = res.data.data
}
const setCityData = async (countryCode, state) => {
    const res = await axios.get(`https://laravel-world.com/api/states?filters%5Bcountry_code%5D=${countryCode}&fields=cities`)
    cityData = res.data.data
    cityData = cityData.filter(ele => {
        return ele.name.toLowerCase() === state.toLowerCase()
    })
    if(cityData.length > 1){
        cityData = []
        return
    }
    cityData = cityData[0].cities
}

const getCode = (country) => {
    const myres = countryData.find(ele => {
        return ele.name.toLowerCase() === country.toLowerCase()
    })
    if(!myres.code){
        return "";
    }
    return myres.code
}

export function SearchPage({BaseUrl}){
    const [country, setCountry] = useState("")
    const [state, setState] = useState("")
    const [city, setCity] = useState("")
    const [countryCode, setCountryCode] = useState("")
    const [startDate, setStartDate] = useState("")
    const [endDate, setEndDate] = useState("")
    const [countryError, setCountryError] = useState(false)
    const [stateError, setStateError] = useState(false)
    const [cityError, setCityError] = useState(false)
    const [startError, setStartError] = useState(false)
    const [endError, setEndError] = useState(false)
    
    //Countrty suggestion when typing
    const countrySuggestion = async(location)=>{
        if(state || city){
            setCity("")
            setState("")
        }
        setCountry(location)
        setCountryError(false)
    }
    const fillCountry = (val)=>{
        setCountry(val.name)
        setCountryCode(val.code)
    }
    // ---------------
    //StateSuggestion with 2 helper function 
    //getCode function with one argument which is country and it is returning the code 
    // and by that code an api which return all state with country code
    const stateSuggestion = async(location)=>{
        if(city){
            setCity("")
        }
        if(!country){
            setCountryError(true)
            setState("")
            return
        }
        const myCode = getCode(country)
        if(!myCode){
            setCountryError(true)
            return
        }
        setCountryError(false)
        setStateError(false)
        setState(location)
        setCountryCode(myCode)
        await setStateData(myCode)
    }
    const fillState = (val)=>{
        setState(val.name)
    }

    //For City

    const citySuggestion = async(location)=>{
        if(!country || !state){
            if(!country && !state){
                setCountryError(true)
                setStateError(true)
            }else if(!state){
                setStateError(true)
            }else{
                setCountryError(true)
            }
            setCity("")
            return
        }
        setCity(location)
        // const myCode = getCode(country)
        const myCode = countryCode
        setStateError(false)
        setCountryError(false)
        setCityError(false)
        await setCityData(myCode, state)
    }
    const fillCity = (val) => {
        console.log(val);
        setCity(val.name)
        return
    }
    const restrictStart = (val) =>{
        console.log(val)
        setStartDate(val)
    }

    const restrictEnd = (val) => {
        if(!startDate){
            setStartError(true)
            return
        }
        setEndDate(val)
    }

    const getCurrentDate = ()=>{
        var DateTime = new Date()
        let day = DateTime.getDate()
        let month = DateTime.getMonth() + 1
        let year  = DateTime.getFullYear()
        let hr = DateTime.getHours()
        let min = DateTime.getMinutes()
        month = String(month).length > 1 ? month: "0"+month 
        day = String(day).length > 1 ? day: "0"+day
        hr = String(hr).length > 1 ? hr: "0"+hr
        min = String(min).length > 1 ? min: "0"+min
        const fullDate = year+"-"+month+"-"+day+"T"+hr+":"+min
        console.log(fullDate);
        return fullDate;
    }

    const minEndDate = ()=>{
        if(!startDate){
            return
        }
        let fullDate = startDate.split("T")
        let fulltime = fullDate[1].split(":")
        let fullhr = Number(fulltime[0]) + 5
        fullhr = String(fullhr).length > 1 ? fullhr : "0"+fullhr
        console.log("endDate");
        console.log(fullDate[0] + "T" + fullhr + ":" + fulltime[1]);
        return fullDate[0] + "T" + fullhr + ":" + fulltime[1]
    }

    const maxEndDate = () =>{
        if(!startDate){
            return
        }
        let fullDate = startDate.split("T")
        let stDate = fullDate[0].split("-")
        let futureDate = Number(stDate[2])
        let futureMonthDate = Number(stDate[1])
        let futureYearDate = Number(stDate[0])
        function daysInMonth (month, year) {
            return new Date(year, month, 0).getDate();
        }
        let daysInThisMonth = daysInMonth(Number(stDate[1]),Number(stDate[0]))
        console.log(daysInThisMonth);
        if(futureDate === 1 && daysInThisMonth === 31){
            futureDate = futureDate + 30 
        }else{
            futureDate = (futureDate + 30) % daysInThisMonth
            if(futureMonthDate === 12){
                futureYearDate += 1
                futureMonthDate = 1
            }
            futureMonthDate += 1
        }
        futureMonthDate = String(futureMonthDate).length > 1?futureMonthDate:"0"+futureMonthDate
        futureDate = String(futureDate).length > 1?futureDate:"0"+futureDate
        let finalFutureDate = futureYearDate + "-" + futureMonthDate + "-" + futureDate + "T" + fullDate[1]
        console.log(finalFutureDate);
        return finalFutureDate
    }

    const showResults = async ()=>{
        try {
            if(!country || !state || !city || !startDate || !endDate){
                setCountryError(true)
                setStateError(true)
                setCityError(true)
                setStartError(true)
                setEndError(true)
                toast.error("Provide All Details")
                return
            }
            if(! await checkTheDetails(country, state, city, startDate, endDate)){
                setCountry("")
                setState("")
                setCity("")
                setStartDate("")
                setEndDate("")
                return
            }
            const res = await axios.post(`${BaseUrl}/u/getallcar`,{
                country,
                state,
                city,
                startDate,
                endDate
            },{withCredentials:true})
            if(!res){
                return
            }else{
                console.log(res);
            }
        } catch (error) {
            console.log(error);
        }
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
                        {countryError?
                            <label className="text-[#DC0000] absolute left-[20px] bottom-[-20px]">Country Cant be Empty</label>:""}
                        <div className="flex flex-col text-black max-h-[200px] overflow-y-scroll text-[18px] w-full bg-white top-[80px] left-[0px] absolute">
                            {countryData && countryData.filter((item) => {
                                const searchTerm = country.toLowerCase()
                                const fullCountry = item.name.toLowerCase()
                                return searchTerm && fullCountry.startsWith(searchTerm) && searchTerm !== fullCountry 
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
                        {stateError?
                            <label className="text-[#DC0000] absolute left-[20px] bottom-[-20px]">State Cant be Empty</label>:""}
                        <div className="flex flex-col text-black max-h-[200px] overflow-y-scroll w-full text-[18px] bg-white top-[80px] w-full left-[0px] absolute">
                            {stateData && stateData.filter((item) => {
                                const searchTerm = state.toLowerCase()
                                const stateCountry = item.name.toLowerCase()
                                return searchTerm && stateCountry.startsWith(searchTerm) && searchTerm !== stateCountry 
                            }).map((item)=>{
                                return(<div key={item.name} className="text-start cursor-pointer pl-2 border-2 text-[18px] border-slate-400 text-black" onClick={()=>{fillState(item)}}>
                                    {item.name}
                                </div>)
                            })}
                        </div>
                    </div>
                    <div className="flex flex-col relative">
                        <h2>Your City</h2>
                        <input className="text-[20px] rounded-md p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" type="text" placeholder="City" value={city} onChange={(event)=>{citySuggestion(event.target.value)}} />
                        <div className="flex flex-col text-black max-h-[200px] overflow-y-scroll w-full text-[18px] bg-white top-[80px] left-[0px] absolute">
                            {cityData && cityData.filter((item) => {
                                const searchTerm = city.toLowerCase()
                                const cityCountry = item.name.toLowerCase()
                                return searchTerm && cityCountry.startsWith(searchTerm) && searchTerm !== cityCountry 
                            }).map((item)=>{
                                return(<div key={item.name} className="text-start cursor-pointer pl-2 border-2 text-[18px] border-slate-400 text-black" onClick={()=>{fillCity(item)}}>
                                    {item.name}
                                </div>)
                            })}
                        </div>
                        {cityError?
                            <label className="text-[#DC0000] absolute left-[20px] bottom-[-20px]">State Cant be Empty</label>:""}
                    </div>
                    <div className="flex flex-col justify-around ">
                        <h2>Start Date</h2>
                        <input className="text-[20px] rounded-md p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" type="datetime-local" value={startDate} min={getCurrentDate()} onChange={(event) =>{restrictStart(event.target.value)}} />
                        {startError?
                            <label className="text-[#DC0000] absolute left-[20px] bottom-[-20px]">Start Date Cant be Empty</label>:""}
                    </div>
                    <div className="flex flex-col justify-around ">
                        <h2>End Date</h2>
                        <input className="text-[20px] rounded-md p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" type="datetime-local" value={endDate} min={minEndDate()} max={maxEndDate()} name="" id="" onChange={(event)=>{restrictEnd(event.target.value)}} />
                        {endError?
                            <label className="text-[#DC0000] absolute left-[20px] bottom-[-20px]">End Date Cant be Empty</label>:""}
                    </div>
                    <div className="">
                        <button className="bg-[#3A4F7A] h-[50px] px-8 rounded-lg shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] z-10 text-lg text-white" onClick={showResults} >Search</button>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}


async function checkTheDetails(country, state, city, startDate, endDate){
    // console.log(`Country:${country}`);
    // console.log(`State:${state}`);
    // console.log(`City:${city}`);
    // console.log(`startDate:${startDate}`);
    // console.log(`endDate:${endDate}`);
    // console.log(`countryData:${countryData}`);
    // console.log(`stateData:${stateData}`);
    // console.log(`cityData:${cityData}`);
    const countryExist = countryData.find(ele =>{
        return ele.name.toLowerCase() === country.toLowerCase()
    })
    if(!countryExist){
        return false
    }
    const res = await axios.get(`https://laravel-world.com/api/states?filters%5Bcountry_code%5D=${countryExist.code}&fields=cities`)
    if(!res){
        return false
    }
    stateData = res.data.data
    const stateExist = stateData.find(ele => {
        return ele.name.toLowerCase() === state.toLowerCase()
    })
    console.log(stateExist);
    if(!stateExist){
        return false
    }
    const allCities = stateExist.cities
    const cityExist = allCities.find(ele => {
        return ele.name.toLowerCase() === city.toLowerCase()
    })
    if(!cityExist){
        return false
    }
    console.log(cityExist);
    if(checkTheDetailsForDate(startDate,endDate)){
        return true
    }
    return false
}

function checkTheDetailsForDate(startDate,endDate){
    const [sday, smon, syear, shh, smm] = breakMe(startDate)
    const [eday, emon, eyear, ehh, emm] = breakMe(endDate)
    if(sday === eday && smon === emon){
        if((ehh-shh) >= 2){
            return true
        }else{
            return false
        }
    }
    return true
}

function breakMe(dt){
    const [date, time] = dt.split("T")
    const [year, mon, day] = date.split("-")
    const [hh, mm] = time.split(":")
    return [ Number(day), Number(mon), Number(year), Number(hh), Number(mm) ]
}