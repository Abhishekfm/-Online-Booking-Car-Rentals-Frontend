import React, { useState } from "react";
// import { useContext } from "react";
// import { ErrorContext } from "../contexts/ErrorContext.jsx";
import { NavBar } from "../component/NavBar.jsx";
import { CarInput } from "../component/CarInput.jsx";
import { CountryInput } from "../component/CountryInput.jsx";
import { StateInput } from "../component/StateInput.jsx";
import { CityInput } from "../component/CityInput.jsx";
import { CarList } from "../component/CarList.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export function Admin({ BaseUrl }) {
  const [countryCodeValue, setCountryCodeValue] = useState("");
  const [countryNameValue, setCountryNameValue] = useState("");
  const [stateNameValue, setStateValue] = useState(null);
  const [citiesValue, setCitiesValue] = useState([]);
  const [cityName, setCityName] = useState("");
  const [carData, setCarData] = useState([]);
  const [image, setImage] = useState("")
  const [numberOfCars, setNumberOfCars] = useState(0)
  const [carName, setCarName] = useState("")
  const [url, setUrl] = useState("")
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

  function updateNumberOfCar(val){
    if(val === '-'||val < 0 || val > 100){
      return
    }
    setNumberOfCars(val)
  }

  const uploadImage = async () => {
    // Get the file from the event
    const file = image;
    console.log(file);
    let url;
    // Upload the file to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "carimagecloud");
    formData.append("cloud_name", process.env.CLOUD_NAME);
    formData.append("api_key", process.env.CLOUD_API_KEY);

    await fetch("https://api.cloudinary.com/v1_1/dl7dfvlz8/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        url = data.url;
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
    setUrl(url);
  };
  const showResults = async () => {
    try {
      if (
        !countryNameValue ||
        !stateNameValue ||
        !cityName ||
        !numberOfCars
      ) {
        // setCountryError(true)
        // setStateError(true)
        // setCityError(true)
        // setStartError(true)
        // setEndError(true)
        toast.error("Provide All Details");
        return;
      }
      await uploadImage()
      if(!url){
        return
      }
      console.log(url);
      const res = await axios.post(
        `${BaseUrl}/admin/createcar`,
        {
          carName,
          carLocation:{country: countryNameValue,
          state: stateNameValue,
          city: cityName},
          numberOfCars,
          url
        },
        { withCredentials: true }
      );
      if (!res) {
        return;
      } else {
        console.log(res);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <>
        <ToastContainer containerId={"toast1"} limit={1} />
        <div className="flex flex-col h-[800px] bg-[#BAD7E9]">
          <NavBar/>
          <div className="flex flex-col items-center gap-[20px]">
            <div>
              <h1 className="text-[50px] font-extrabold text-[#F9ED69] drop-shadow-lg">
                Search To <span className="text-[#3A4F7A]">Rent</span> A Car
              </h1>
            </div>
            <div className="flex flex-row justify-around w-full gap-8 flex-wrap items-end">
              <div className="flex flex-col relative">
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
              <div className="flex flex-col relative">
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
              <div className="flex flex-col relative">
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
              <div className="flex flex-col relative">
                <CarInput 
                onCarChange={setCarName}
                />
              </div>
              <div className="flex flex-col">
                <label className='text-lg font-semibold' htmlFor="noOfCars">Number Of Cars:</label>
                <input id="noOfCars" className="text-[20px] rounded-md p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" value={numberOfCars} onChange={(e)=>{updateNumberOfCar(e.target.value)}} type="number" min={1} max={100} placeholder="Number Of Cars" />
              </div>
              <div className="flex flex-row items-end">
                <div>
                <label className="text-lg font-semibold " htmlFor="slctfile">Select Photo of car:</label>
                <input
                    id="slctfile"
                    type="file"
                    className="block w-full file:text-xl file:font-semibold text-lg file:decoration-none text-gray-900 border h-[50px] file:h-full rounded-lg cursor-pointer bg-gray-50 file:text-white file:outline-none file:bg-slate-600 file:border-slate-600 file:placeholder-white" 
                    // aria-describedby="file_input_help" 
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                    }}
                  />
                </div>
                <div>
                <button className="bg-[#3A4F7A] h-[50px] font-bold px-8 rounded-lg shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] z-10 text-lg text-white" onClick={showResults}>
                  Upload
                </button>
              </div>
              </div>
            </div>
            <div>
              <CarList carData={carData} />
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
