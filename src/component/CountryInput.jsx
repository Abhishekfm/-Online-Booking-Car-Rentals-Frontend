// country-input.js
import React, { useState, useEffect } from 'react';
import countryData from "../allCountries.json"
import { ErrorContext } from '../contexts/ErrorContext';
import { useContext } from 'react';

export function CountryInput(props) {
  const [countries, setCountries] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(true);
  const [clickedOnSuggestion, setClickedOnSuggestion] = useState(false)
  // const { countryError } = useContext(ErrorContext);

  useEffect(() => {
    async function fetchData() {
      const data = countryData;
      setCountries(data);
    }
    fetchData();
  }, []);

  function handleInputChange(event) {
    setShow(true)
    const value = event.target.value;
    setInputValue(value);
    setSuggestions(
      countries.filter((country) =>
        country.name.toLowerCase().startsWith(value.toLowerCase().trim())
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
        props.onInputChange(suggestions[0].name, suggestions[0].code);
        props.setCountry(suggestions[0].name)
        props.setCode(suggestions[0].code)
        setInputValue(suggestions[0].name)
    }
  }
  function fillIn(country) {
    console.log("bhook");
    console.log(country);
    setClickedOnSuggestion(true)
    setShow(false)
    // props.setCountry(country.name)
    // props.setCode(country.code)
    setInputValue(country.name)
  }
  return (
    <>
      <label className='text-lg font-semibold' htmlFor="cntry">Your Country:</label>
      <input
        type="text"
        id='cntry'
        className="text-[20px] rounded-md p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" 
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder="Enter a country name"
      />
      {/* {countryError?
              <label className="text-[#DC0000] absolute left-[20px] bottom-[-20px]">Country Cant be Empty</label>:""} */}
      <div className="flex flex-col rounded-md text-black shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] max-h-[200px] overflow-y-scroll text-[18px] w-full bg-white top-[80px] left-[0px] absolute">
      {suggestions.length > 0 && show && (
        <ul >
          {suggestions.map((country) => (
            <li className="text-start cursor-pointer hover:bg-[#D8D9CF] pl-2 text-[18px] text-black" onMouseDown={()=>{props.onInputChange(country.name, country.code); fillIn(country)}} key={country.code}>{country.name}</li>
          ))}
        </ul>
      )}
      </div>
    </>
  );
}