import React from "react";
import car from "../images/car.png"

export function CarList(props){
    const carData = props.carData
    console.log(carData);
    return(
        <>
        {carData&&carData.map((ele)=>(
            <div key={(ele._id).toString()}>
                <h1 className="text-4xl">{ele.carName}</h1>
                <img src={car} alt="" />
            </div>
        ))}
        </>
    )
}