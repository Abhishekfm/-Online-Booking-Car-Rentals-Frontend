import React, { useState } from 'react';
// import { useContext } from 'react';
// import { ErrorContext } from '../contexts/ErrorContext.jsx';
import Banner from "../images/Banner.jpg"
import { NavBar } from '../component/NavBar.jsx';
import { CountryInput } from '../component/CountryInput.jsx';
import { CityInput } from '../component/CityInput.jsx';
import { MyForm } from '../component/DateInput.jsx';
import { CarInfo } from '../component/CarInfo';
import { CarList } from '../component/CarList.jsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StateInput } from '../component/StateInput.jsx';
import axios from 'axios';

export function SearchPage({BaseUrl}) {
  const [countryCodeValue, setCountryCodeValue] = useState('');
  const [countryNameValue, setCountryNameValue] = useState('');
  const [stateNameValue, setStateValue] = useState(null)
  const [citiesValue, setCitiesValue] = useState([])
  const [cityName, setCityName] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [carData, setCarData] = useState([])
//   const { countryError } = useContext(ErrorContext);
//   const { setCountryError } = useContext(ErrorContext);
//   const { setStateError } = useContext(ErrorContext);

  function handleInputChange(name, code) {
    setCountryCodeValue(code);
    setCountryNameValue(name)
    setStateValue(null)
    // setCountryError(false)
    setCityName("")
    console.log( "Country Code in search 2 " + countryNameValue);
    console.log( "Country Name in search 2 " + countryCodeValue);
  }
  function handleStateChange(name, cities){
    setStateValue(name)
    setCitiesValue(cities)
    // setStateError(false)
    setCityName("")
    console.log("State Name in search 2" + name);
    console.log(citiesValue);
  }
  function cityChange(name){
    setCityName(name)
  }

  function handleDateChange(sd, ed){
    setStartDate(sd)
    setEndDate(ed)
    console.log(startDate);
    console.log(endDate);
  }

//   function showResults(){
//     return
//   }

  const showResults = async ()=>{
    try {
        if(!countryNameValue || !stateNameValue || !cityName || !startDate || !endDate){
            // setCountryError(true)
            // setStateError(true)
            // setCityError(true)
            // setStartError(true)
            // setEndError(true)
            toast.error("Provide All Details")
            return
        }
        const res = await axios.post(`${BaseUrl}/u/getallcar`,{
            country:countryNameValue,
            state:stateNameValue,
            city:cityName,
            startDate:startDate,
            endDate:endDate
        },{withCredentials:true})
        if(!res){
            return
        }else{
            console.log(res.data.allCar);
            setCarData(res.data.allCar)
        }
    } catch (error) {
        console.log(error);
    }
}

  return (
    <div>
      <>
        <ToastContainer containerId={'toast1'} limit={1}/>
        <div className="flex flex-col h-[800px] bg-[#Ffffff]">
            <NavBar/>
            <div className="flex flex-col items-center gap-[20px]">
                <div className='w-full h-[110px] p-[10px]'>
                  <img src={Banner} className="w-full rounded-[20px] h-[350px] object-cover" alt="" />
                </div>
                <div className='w-full h-[230px] text-center pt-[10px]'>
                    <h1 className="text-[50px] font-extrabold text-slate-800 drop-shadow-lg">Search To <span className="text-slate-800">Rent</span> A Car</h1>
                </div>
                <div className="flex flex-row justify-around w-full items-end">
                    <div className="flex flex-col relative">
                        <CountryInput  onInputChange={handleInputChange} countryCode={countryCodeValue} setCode={setCountryCodeValue} setCountry={setCountryNameValue} />
                        {/* <p>You entered: {countryCodeValue}</p>
                        <p>You entered: {countryNameValue}</p> */}
                        {/* {countryError?
                            <label className="text-[#DC0000] absolute left-[20px] bottom-[-20px]">Country Cant be Empty</label>:""} */}
                    </div>
                    <div className="flex flex-col relative">
                        {/* <h2>Your State</h2> */}
                        <StateInput key={countryNameValue} onStateChange={handleStateChange} countryCode={countryCodeValue} />
                        {/* <p>You entered: {stateNameValue}</p> */}
                        {/* <p>You entered: {citiesValue}</p> */}
                        {/* {stateError?
                            <label className="text-[#DC0000] absolute left-[20px] bottom-[-20px]">State Cant be Empty</label>:""}
                        */}
                    </div>
                    <div className="flex flex-col relative">
                        <CityInput key={stateNameValue} cityData={citiesValue} stName={stateNameValue} onInputChange={cityChange} />
                        {/* <p>City Name: {cityName}</p> */}
                        {/* {cityError?
                            <label className="text-[#DC0000] absolute left-[20px] bottom-[-20px]">State Cant be Empty</label>:""} */}
                    </div>
                    <div className='flex'>
                        <MyForm onInputChange={handleDateChange}/>
                        {/* <p>Start date: {startDate}</p>
                        <p>End date: {endDate}</p> */}
                    </div>
                    <div className="">
                        <button className="bg-[#3A4F7A] h-[50px] px-8 rounded-lg shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] z-10 text-lg text-white" onClick={showResults} >Search</button>
                    </div>
                </div>
                <div className='w-full mt-[100px] flex flex-row'>
                  <CarInfo/>
                  <CarList className="w-full" carData={carData}/>
                </div>
            </div>
        </div>
        </>
    </div>

  );
}
