import React, { useState } from "react";
// import { useContext } from "react";
// import { ErrorContext } from "../contexts/ErrorContext.jsx";
import banner2 from "../images/banner2.jpg"
import { NavBar } from "../component/NavBar.jsx";
import { CarInput } from "../component/CarInput.jsx";
import { CountryInput } from "../component/CountryInput.jsx";
import { StateInput } from "../component/StateInput.jsx";
import { CityInput } from "../component/CityInput.jsx";
import { AllCars } from "../component/AllCars.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useEffect } from "react";

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
  const [skipNo, setSkipNo] = useState(0)
  const [totalEntriesInCarDb, setTotalEntriesInCarDb] = useState(0)
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

  async function uploadImage() {
    // Get the file from the event
    const file = image;
    if(!file){
      return
    }
    let url;
    // Upload the file to Cloudinary
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "carimagecloud");
    formData.append("cloud_name", process.env.CLOUD_NAME);
    formData.append("api_key", process.env.CLOUD_API_KEY);

    fetch("https://api.cloudinary.com/v1_1/dl7dfvlz8/image/upload", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        url = data.url;
        setUrl(url)
        console.log(data);
      })
      .catch((err) => {
        console.log(err);
      });
    setUrl(url);
    console.log(url);
  };
  async function showResults (){
    try {
      if (!countryNameValue || !stateNameValue || !cityName || !numberOfCars) {
        toast.error("Provide All Details");
        return;
      }
      await uploadImage()
      let res;
      if(!url){
        if(image){
          
        }
        console.log("no url")
        res = await axios.post(`${BaseUrl}/admin/createcar`,{
            carName,
            carLocation:{country: countryNameValue,
            state: stateNameValue,
            city: cityName},
            numberOfCars
          },{ withCredentials:true });
      }else{
        console.log(url)
        res = await axios.post(`${BaseUrl}/admin/createcar`,{
            carName,
            carLocation:{country: countryNameValue,
            state: stateNameValue,
            city: cityName},
            numberOfCars,
            url
          },{ withCredentials:true });
      }
      if (!res) {
        return;
      } else {
        console.log(res);
        await showData()
      }
    } catch (error) {
      console.log(error);
    }
  };

  async function showData(){
    try {
      console.log(skipNo);
      const res = await axios.post(`${BaseUrl}/admin/showcardb`,{
          skipNo
        },{ withCredentials:true });
      if(!res){
        return
      }else{
        setCarData(res.data.allCar)
        setTotalEntriesInCarDb(res.data.totalLength)
      }
    // do something with the data
    } catch (error) {
      // handle error
      console.log(error);
    }
  }
  //calling one time only
  useEffect(() => {
    const fetchData = async () => {
      try {
          console.log(skipNo);
          const res = await axios.post(
            `${BaseUrl}/admin/showcardb`,
            {
              skipNo
            },
            { withCredentials:true }
          );
          if(!res){
            return
          }else{
            setCarData(res.data.allCar)
            setTotalEntriesInCarDb(res.data.totalLength)
          }
        // do something with the data
      } catch (error) {
        // handle error
        console.log(error);
      }
    };
    fetchData();
  }, [skipNo, totalEntriesInCarDb]);
  return (
    <div className="w-full">
      <>
        <ToastContainer containerId={"toast1"} limit={1} />
        <div className="flex flex-col w-full h-[800px] bg-white">
          <NavBar BaseUrl={BaseUrl}/>
          <div className="flex flex-col items-center gap-[20px]">
            <div className='w-full h-[70px] sm:h-[120px] p-[10px]'>
              <img src={banner2} className="w-full rounded-[10px] 2md:rounded-[20px] h-[200px] sm:h-[300px] 2md:h-[350px] object-cover" alt="" />
            </div>
            <div className="w-full h-[100px] sm:h-[170px] 2md:h-[230px] text-center pt-[0px] ">
              <h1 className="text-[40px] 2md:text-[50px] drop-shadow-lg font-extrabold text-white drop-shadow-lg">
                 Admin DashBoard
              </h1>
            </div>
            <div className="flex flex-row justify-around w-full gap-8 flex-wrap items-end">
              <div className="flex flex-col w-[150px] md:w-[220px] relative">
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
              <div className="flex w-[150px] md:w-[220px] flex-col relative">
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
              <div className="flex flex-col w-[150px] md:w-[220px] relative">
                <CarInput 
                onCarChange={setCarName}
                />
              </div>
              <div className="flex flex-col w-[150px] md:w-[220px]">
                <label className='text-lg font-semibold' htmlFor="noOfCars">Number Of Cars:</label>
                <input id="noOfCars" className="text-[20px] rounded-md p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] bg-[#ECE8DD] focus:border-0 focus:outline-0" value={numberOfCars} onChange={(e)=>{updateNumberOfCar(e.target.value)}} type="number" min={1} max={100} placeholder="Number Of Cars" />
              </div>
              <div className="flex flex-row gap-4 md:gap-0 items-end">
                <div>
                <label className="text-lg font-semibold " htmlFor="slctfile">Select Photo of car:</label>
                <input
                    id="slctfile"
                    type="file"
                    className="block w-[200px] md:w-full bg-[#ECE8DD] file:text-xl file:font-semibold text-lg file:decoration-none text-gray-900 border h-[50px] file:h-full rounded-lg cursor-pointer file:text-white file:outline-none file:bg-slate-600 file:border-slate-600 file:placeholder-white" 
                    // aria-describedby="file_input_help" 
                    onChange={(e) => {
                      setImage(e.target.files[0]);
                    }}
                  />
                </div>
                <div>
                <button className="bg-[#3A4F7A] h-[50px] font-bold px-8 rounded-lg shadow-[rgba(50,_50,_105,_0.15)_0px_2px_5px_0px,_rgba(0,_0,_0,_0.05)_0px_1px_1px_0px] z-10 text-lg text-white" onClick={showResults}>
                  ADD CAR
                </button>
              </div>
              </div>
            </div>
            <div className="w-full">
              {carData && totalEntriesInCarDb ?<AllCars reRendor={showData} carData={carData} nom={setSkipNo} BaseUrl={BaseUrl} totalEntry={totalEntriesInCarDb}/>:""}
              {/* <PageNumber nom={setSkipNo} totalEntry={totalEntriesInCarDb} /> */}
            </div>
          </div>
        </div>
      </>
    </div>
  );
}
