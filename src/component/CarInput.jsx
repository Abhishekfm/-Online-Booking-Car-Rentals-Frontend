import React from "react";
import { useState } from "react";
import listOfAllCar from "../carList.js";


export function CarInput(props){
    const [inputValue, setInputValue] = useState("")
    const [show, setShow] = useState(true)
    const [suggestions, setSuggestions] = useState([])
    const [clickedOnSugestion, setClickedOnSuggestion] = useState(false)

    function handleInputChange(event){
        setShow(true)
        const value = event.target.value
        setInputValue(value)
        console.log(listOfAllCar);
        setSuggestions(
            listOfAllCar.filter((ele) => 
            ele.toLowerCase().includes(value.toLowerCase())
            )
        )
    }

    function handleInputBlur(){
        if(clickedOnSugestion){
            setClickedOnSuggestion(false)
            return
        }
        setShow(false)
        console.log(suggestions);
        console.log(suggestions.map(ele => ele.toLowerCase()).includes(inputValue.trim().toLowerCase()));
        if(!suggestions.map(ele => ele.toLowerCase()).includes(inputValue.trim().toLowerCase())){
            console.log("i am in");
            setInputValue("")
            props.onCarChange("")
        }else{
            //add to prop
            props.onCarChange(inputValue)
        }
    }

    function fillIn(car){
        setInputValue(car)
    }
    
    return(
        <>
            <label className='text-lg font-semibold' htmlFor="st">Car Name:</label>
            <input
              type="text"
              id='st'
              className="text-[20px] rounded-md p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0" 
              value={inputValue}
              onChange={handleInputChange}
              onBlur={handleInputBlur}
              placeholder="Enter a car name"
            />
            <div className="flex flex-col text-black max-h-[200px] overflow-y-scroll text-[18px] w-full bg-white top-[80px] left-[0px] absolute">
            {suggestions.length > 0 && show && (
              <ul>
                {suggestions.map((car) => (
                  <li className="text-start cursor-pointer hover:bg-[#D8D9CF] pl-2 border-2 text-[18px] border-slate-400 text-black" onMouseDown={()=>{props.onCarChange(car); fillIn(car)}} >{car}</li>
                ))}
              </ul>
            )}
            </div>
        </>
    )
}