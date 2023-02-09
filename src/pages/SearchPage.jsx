import React, { useState } from "react";
import { useEffect } from "react";
// import { useContext } from 'react';
// import { ErrorContext } from '../contexts/ErrorContext.jsx';
import Banner from "../images/Banner.jpg";
import { NavBar } from "../component/NavBar.jsx";
import { CountryInput } from "../component/CountryInput.jsx";
import { CityInput } from "../component/CityInput.jsx";
import { MyForm } from "../component/DateInput.jsx";
import { CarInfo } from "../component/CarInfo";
import { CarList } from "../component/CarList.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { StateInput } from "../component/StateInput.jsx";
import axios from "axios";
import { PageNumber } from "../component/PageNumber";

export function SearchPage({ BaseUrl }) {
  const [countryCodeValue, setCountryCodeValue] = useState("");
  const [countryNameValue, setCountryNameValue] = useState("");
  const [stateNameValue, setStateValue] = useState("");
  const [citiesValue, setCitiesValue] = useState([]);
  const [cityName, setCityName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [carData, setCarData] = useState([]);
  const [showEmpty, setShowEmpty] = useState(false);
  const [skipNo2, setSkipNo2] = useState(0)
  const [numberOfPages2, setNumberOfPages2] = useState(0)
  const [reloaded, setReloaded] = useState(true);
  //   const { countryError } = useContext(ErrorContext);
  //   const { setCountryError } = useContext(ErrorContext);
  //   const { setStateError } = useContext(ErrorContext);

  function handleInputChange(name, code) {
    setCountryCodeValue(code);
    setCountryNameValue(name);
    setStateValue(null);
    // setCountryError(false)
    setCityName("");
    console.log("Country Code in search 2 " + countryNameValue);
    console.log("Country Name in search 2 " + countryCodeValue);
  }
  function handleStateChange(name, cities) {
    setStateValue(name);
    setCitiesValue(cities);
    // setStateError(false)
    setCityName("");
    console.log("State Name in search 2" + name);
    console.log(citiesValue);
  }
  function cityChange(name) {
    setCityName(name);
  }

  function handleDateChange(sd, ed) {
    setStartDate(sd);
    setEndDate(ed);
    console.log(startDate);
    console.log(endDate);
  }

  //   function showResults(){
  //     return
  //   }

  const showResults = async () => {
    try {
      if (
        !countryNameValue ||
        !stateNameValue ||
        !cityName ||
        !startDate ||
        !endDate
      ) {
        // setCountryError(true)
        // setStateError(true)
        // setCityError(true)
        // setStartError(true)
        // setEndError(true)
        // toast.error(`Provide All search Details`);

        return;
      }
      const res = await axios.post(
        `${BaseUrl}/u/getallcar`,
        {
          country: countryNameValue,
          state: stateNameValue,
          city: cityName,
          startDate: startDate,
          endDate: endDate,
          skipNo2
        },
        { withCredentials:true }
      );
      if (!res) {
        return;
      } else {
        console.log(res.data.allFiveCar);
        setReloaded(false)
        if (res.data.allFiveCar.length <= 0) {
          setShowEmpty(true);
        } else {
          setShowEmpty(false);
        }
        let page = Math.ceil(Number(res.data.totalLength)/5)
        setNumberOfPages2(page)
        setCarData(res.data.allFiveCar);
        localStorage.setItem('carList', JSON.stringify(res.data.allFiveCar));
      }
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   // Load the values from local storage when the page loads
  //   const storedCountryCodeValue = localStorage.getItem("countryCodeValue");
  //   const storedCountryNameValue = localStorage.getItem("countryNameValue");
  //   const storedStateNameValue = localStorage.getItem("stateNameValue");
  //   const storedCityName = localStorage.getItem("cityName");
  //   const storedStartDate = localStorage.getItem("startDate");
  //   const storedEndDate = localStorage.getItem("endDate");
  //   // console.log(storedCountryNameValue)
  //   // console.log(storedCountryCodeValue)
  //   // console.log(storedStateNameValue)
  //   // console.log(storedCityName)
  //   let count = 0

  //   if (storedCountryCodeValue) {
  //     count += 1;
  //     setCountryCodeValue(storedCountryCodeValue);
  //   }
  //   if (storedCountryNameValue) {
  //     count += 1;
  //     setCountryNameValue(storedCountryNameValue);
  //   }
  //   if (storedStateNameValue) {
  //     count += 1;
  //     setStateValue(storedStateNameValue);
  //   }
  //   if (storedCityName) {
  //     count += 1;
  //     setCityName(storedCityName);
  //   }
  //   if (storedStartDate && new Date(storedStartDate).toISOString().substr(0, 16) < new Date().toISOString().substr(0, 16)) {
  //     // count += 1;
  //     setStartDate(storedStartDate)
  //   }else{
  //     setStartDate(new Date().toISOString().substr(0, 16))
  //   }
  //   if ( storedEndDate && new Date(storedEndDate).toISOString().substr(0, 16) > new Date().toISOString().substr(0, 16)) {
  //     // count += 1;
  //     setEndDate(storedStartDate)
  //   }else{
  //     let date = new Date();
  //     date.setDate(date.getDate() + 1);
  //     let newDate = date.toISOString().substr(0, 16);
  //     setEndDate(newDate)
  //   }
  //   async function fd(){
  //     await showResults()
  //   }
  //   if(storedCountryCodeValue && storedCountryNameValue && storedCityName && storedStateNameValue && count === 4){
  //     console.log("Show Results called")
  //     console.log(count)
  //     console.log(storedCountryNameValue)
  //     console.log(storedCountryCodeValue)
  //     console.log(storedStateNameValue)
  //     console.log(storedCityName)
  //     setCountryCodeValue(storedCountryCodeValue);
  //     setCountryNameValue(storedCountryNameValue);
  //     setStateValue(storedStateNameValue);
  //     setCityName(storedCityName);
  //     console.log(`Provide All search Details country:${countryNameValue},state:${stateNameValue},city:${cityName},Start Date:${startDate},End Date:${endDate}`)
  //     fd()
  //   }
  //   // showResults()
  // }, []);
  useEffect(() => {
    const loadValuesFromLocalStorage = () => {
        const storedCountryCode = localStorage.getItem("countryCodeValue");
        const storedCountryName = localStorage.getItem("countryNameValue");
        const storedStateName = localStorage.getItem("stateNameValue");
        const storedCity = localStorage.getItem("cityName");
        const storedStart = localStorage.getItem("startDate");
        const storedEnd = localStorage.getItem("endDate");
        const storedObject = localStorage.getItem('carList');
        const cars = JSON.parse(storedObject);

        if (storedCountryCode) {
            setCountryCodeValue(storedCountryCode);
        }
        if (storedCountryName) {
            setCountryNameValue(storedCountryName);
        }
        if (storedStateName) {
            setStateValue(storedStateName);
        }
        if (storedCity) {
            setCityName(storedCity);
        }

        if(cars){
          setCarData(cars);
        }
        // if(cars && !storedCountryName && !storedStateName && !storedCity){
        //   console.log("pta nhi")
        //   setShowEmpty(true);
        //   return
        // }
        if (storedStart && new Date(storedStart) > new Date()) {
          // count += 1;
          console.log("this one")
          
          setStartDate(storedStart)
        }else{
          setStartDate(new Date().toISOString().substr(0, 16))
        }
        console.log(new Date())
        if ( storedEnd && new Date(storedEnd) > new Date()) {
          // count += 1;
          setEndDate(storedStart)
        }else{
          let date = new Date();
          date.setDate(date.getDate() + 1);
          let newDate = date.toISOString().substr(0, 16);
          setEndDate(newDate)
        }
      }

      const showResultsIfAllDataExists = async () => {
        if (countryCodeValue && countryNameValue && cityName && stateNameValue) {
            console.log(`Provide All search Details country :${countryCodeValue}, state:${stateNameValue}, city:${cityName}, Start Date:${startDate}, End Date:${endDate}`)
            console.log("showResultsIfAllDataExists: calling showResults");
            await showResults();
            console.log("showResultsIfAllDataExists: showResults called");
        }
      };
    

      loadValuesFromLocalStorage();
      showResultsIfAllDataExists();
  }, []);

  useEffect(()=>{
    showResults()
  },[skipNo2])


  useEffect(() => {
    // Store the values in local storage when they change
    localStorage.setItem("countryCodeValue", countryCodeValue);
    localStorage.setItem("countryNameValue", countryNameValue);
    localStorage.setItem("stateNameValue", stateNameValue);
    localStorage.setItem("cityName", cityName);
    localStorage.setItem("startDate", startDate);
    localStorage.setItem("endDate", endDate);
  }, [countryCodeValue, countryNameValue, stateNameValue, cityName, startDate, endDate]);

  return (
    <div>
      <>
        <ToastContainer containerId={"toast1"} limit={1} />
        <div className="flex flex-col h-[800px] bg-[#Ffffff]">
          <NavBar BaseUrl={BaseUrl} />
          <div className="flex flex-col items-center gap-[20px]">
            <div className="w-full h-[70px] sm:h-[110px] p-[10px]">
              <img
                src={Banner}
                className="w-full rounded-[10px] 2md:rounded-[20px] h-[200px] sm:h-[300px] 2md:h-[350px] object-cover"
                alt=""
              />
            </div>
            <div className="w-full h-[100px] sm:h-[170px] 2md:h-[230px] text-center md:pt-[10px]">
              <h1 className="text-[30px] 2md:text-[50px] uppercase font-extrabold text-slate-800 drop-shadow-lg">
                Search To <span className="text-slate-800">Rent</span> A Car
              </h1>
            </div>
            <div className="flex flex-row flex-wrap gap-4 justify-around w-full items-end">
              <div className="flex w-[150px] md:w-[220px] flex-col relative">
                <CountryInput
                  onInputChange={handleInputChange}
                  countryCode={countryCodeValue}
                  setCode={setCountryCodeValue}
                  setCountry={setCountryNameValue}
                />
                {/* <p>You entered: {countryCodeValue}</p>
                        <p>You entered: {countryNameValue}</p> */}
                {/* {countryError?
                            <label className="text-[#DC0000] absolute left-[20px] bottom-[-20px]">Country Cant be Empty</label>:""} */}
              </div>
              <div className="flex flex-col w-[150px] md:w-[220px] relative">
                {/* <h2>Your State</h2> */}
                <StateInput
                  key={countryNameValue}
                  onStateChange={handleStateChange}
                  countryCode={countryCodeValue}
                />
                {/* <p>You entered: {stateNameValue}</p> */}
                {/* <p>You entered: {citiesValue}</p> */}
                {/* {stateError?
                            <label className="text-[#DC0000] absolute left-[20px] bottom-[-20px]">State Cant be Empty</label>:""}
                        */}
              </div>
              <div className="flex w-[150px] md:w-[220px] flex-col relative">
                <CityInput
                  key={stateNameValue}
                  cityData={citiesValue}
                  stName={stateNameValue}
                  onInputChange={cityChange}
                />
                {/* <p>City Name: {cityName}</p> */}
                {/* {cityError?
                            <label className="text-[#DC0000] absolute left-[20px] bottom-[-20px]">State Cant be Empty</label>:""} */}
              </div>
              <div className="flex">
                <MyForm onInputChange={handleDateChange} />
                {/* <p>Start date: {startDate}</p>
                        <p>End date: {endDate}</p> */}
              </div>
              <div className="">
                <button
                  className="bg-[#3A4F7A] h-[50px] px-8 rounded-lg shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] z-10 text-lg text-white"
                  onClick={showResults}
                >
                  Search
                </button>
              </div>
            </div>
            <div className="w-full mt-[40px] 2md:mt-[100px] flex flex-wrap 2md:flex-nowrap flex-row">
              <CarInfo country={countryNameValue}
                state={stateNameValue}
                city={cityName}
                startDate={startDate}
                endDate={endDate}
              />
              <CarList
                className="w-full"
                showEmpty={showEmpty}
                showResults={showResults}
                startDate={startDate}
                endDate={endDate}
                BaseUrl={BaseUrl}
                carData={carData}
              />
            </div>
            {!reloaded?<PageNumber setSkip={setSkipNo2} pages={numberOfPages2}/>:
            <h2 className="text-[24px] text-slate-500">Kindly Please Search To Find All Results</h2> }
          </div>
        </div>
      </>
    </div>
  );
}
