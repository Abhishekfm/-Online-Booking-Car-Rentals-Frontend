// country-input.js
import React, { useState, useEffect } from 'react';

export function CityInput(props) {
  const [cities, setCities] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(true);
  const [clickedOnSuggestion, setClickedOnSuggestion] = useState(false)

  useEffect(() => {
    async function fetchData() {
      const data = props.cityData;
      console.log(data);
      setCities(data);
    }
    fetchData();
  }, []);

  function handleInputChange(event) {
    if(!props.stName){
        return
    }
    setShow(true)
    const value = event.target.value;
    setInputValue(value);
    setSuggestions(
      cities.filter((city) =>
        city.name.toLowerCase().startsWith(value.toLowerCase().trim())
      )
    );
    // Call the onInputChange callback and pass the input value as an argument
    // onInputChange(value);
  }
  function handleInputBlur() {
    if(clickedOnSuggestion){
      setClickedOnSuggestion(false)
      return
    }
    // Check if the input value is in the list of suggestions
    
    // console.log();
    // console.log(suggestions.map((s) => s.name.toLowerCase()));
    setShow(false)
    console.log(suggestions.map((s) => s.name.toLowerCase()).includes(inputValue.toLowerCase().trim()));
    if (!suggestions.map((s) => s.name.toLowerCase()).includes(inputValue.toLowerCase().trim())) {
      // Reset the input value to an empty string if it is not in the list of suggestions
      setInputValue('');
      // Call the onInputChange callback and pass an empty string as the value
      props.onInputChange('');
    }else{
        if(suggestions.length === 1){
            props.onInputChange(suggestions[0].name);
            setInputValue(suggestions[0].name)
        }
    }
  }
  function fillIn(ct) {
    console.log("bhook");
    console.log(ct);
    setClickedOnSuggestion(true)
    setShow(false)
    // props.setCountry(country.name)
    // props.setCode(country.code)
    setInputValue(ct.name)
  }
  return (
    <>
        <label className='text-lg font-semibold' htmlFor="ct">Your City:</label>
      <input
        type="text"
        id='ct'
        className="text-[20px] rounded-md p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" 
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder="Enter a City name"
      />
      <div className="flex flex-col text-black max-h-[200px] overflow-y-scroll text-[18px] w-full bg-white top-[80px] left-[0px] absolute">
      {suggestions.length > 0 && show && (
        <ul>
          {suggestions.map((city) => (
            <li className="text-start cursor-pointer hover:bg-[#D8D9CF] pl-2 border-2 text-[18px] border-slate-400 text-black" onMouseDown={()=>{props.onInputChange(city.name); fillIn(city)}} key={city.id}>{city.name}</li>
          ))}
        </ul>
      )}
      </div>
    </>
  );
}