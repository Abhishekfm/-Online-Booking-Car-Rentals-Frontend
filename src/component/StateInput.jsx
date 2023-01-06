// country-input.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function StateInput(props) {
  const [state, setState] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [show, setShow] = useState(true);
  const [clickedOnSuggestion, setClickedOnSuggestion] = useState(false)
  // console.log(props.countryCode);
  const countryCode = props.countryCode

  useEffect(() => {
    async function fetchData() {
        const res = await axios.get(`https://laravel-world.com/api/states?filters%5Bcountry_code%5D=${props.countryCode}&fields=cities`)
        const data = res.data.data;
        setState(data);
        console.log(props.countryCode);
    }
    fetchData();
  }, []);

  function handleInputChange(event) {
    if(!countryCode){
        setInputValue("")
        return
    }
    setShow(true)
    const value = event.target.value;
    setInputValue(value);
    setSuggestions(
      state.filter((country) =>
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
    // console.log(suggestions.map((s) => s.name.toLowerCase()));
    setShow(false)
    // console.log(suggestions.map((s) => s.name.toLowerCase()).includes(inputValue.toLowerCase()));
    if (!suggestions.map((s) => s.name.toLowerCase()).includes(inputValue.toLowerCase().trim())) {
      // Reset the input value to an empty string if it is not in the list of suggestions
      setInputValue('');
      // Call the onInputChange callback and pass an empty string as the value
      props.onStateChange('');
    }else{
        props.onStateChange(suggestions[0].name,suggestions[0].cities);
        setInputValue(suggestions[0].name)
    }
  }
  const fillIn = (state) =>{
    console.log(state);
    setInputValue(state.name)
    setShow(false)
    setClickedOnSuggestion(true)
    // props.onStateChange(state.name, state.cities)
  }
  return (
    <>
      <label className='text-lg font-semibold' htmlFor="st">Your State:</label>
      <input
        type="text"
        id='st'
        className="text-[20px] rounded-md p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" 
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder="Enter a state name"
      />
      <div className="flex flex-col rounded shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] text-black max-h-[200px] overflow-y-scroll text-[18px] w-full bg-white top-[80px] left-[0px] absolute">
      {suggestions.length > 0 && show && (
        <ul>
          {suggestions.map((state) => (
            <li className="text-start cursor-pointer hover:bg-[#D8D9CF] pl-2 text-[18px] text-black" onMouseDown={()=>{props.onStateChange(state.name, state.cities); fillIn(state)}} key={state.id}>{state.name}</li>
          ))}
        </ul>
      )}
      </div>
    </>
  );
}