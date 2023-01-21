import axios from "axios";
import React from "react";
import { useState } from "react";
import { NavBar } from "../component/NavBar";
import {OrderCars} from "../component/OrderCars"
import Banner from "../images/Banner.jpg"


export function Order({ BaseUrl }){
    
    return(
        <>
        <div>
            <NavBar BaseUrl={BaseUrl}  />
            <OrderCars BaseUrl={BaseUrl} />
        </div>
        </>
    )
}