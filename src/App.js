import React from "react";
import { LogIn } from "./pages/LogIn";
import { SignUp } from "./pages/SignUp";
import { SearchPage } from "./pages/SearchPage";
import { Admin } from "./pages/Admin";
import { Order } from "./pages/Order";
import { Users } from "./pages/Users";
import { OrdersOfThisCar } from "./pages/OrdersOfThisCar";
import { AllOrder } from "./pages/AllOrder";
import { Route, Routes} from "react-router-dom";
import { MyContext } from './contexts/MyContext';
import { useState } from "react";

export function App(){
    const [globalVariable, setGlobalVariable] = useState("initial value");
    const [user, setUser] = useState("");
    const [carName, setCarName] = useState("")
    const [carTotal, setCarTotal] = useState("")
    const [carAvailable, setCarAvailable] = useState("")
    const [ carUrl, setCarUrl] = useState("")
    const BaseUrl = "http://localhost:4000"
    return(
        <>
        <MyContext.Provider value={[globalVariable, setGlobalVariable, user, setUser, carName, setCarName, carTotal, setCarTotal, carAvailable, setCarAvailable, carUrl, setCarUrl]}>
            <Routes>
                <Route exact path="/signup" element={<SignUp BaseUrl={BaseUrl}/>} />
                <Route exact path="/login" element={<LogIn BaseUrl={BaseUrl}/>} />
                <Route exact path="/" element={<SearchPage BaseUrl={BaseUrl}/>} />
                <Route exact path="/admin" element={<Admin BaseUrl={BaseUrl}/>} />
                <Route exact path="/order" element={<Order BaseUrl={BaseUrl}/>} />
                <Route exact path="/users" element={<Users BaseUrl={BaseUrl}/>} />
                <Route exact path="/ordersofthiscar" element={<OrdersOfThisCar BaseUrl={BaseUrl}/>} />
                <Route exact path="/allorder" element={<AllOrder BaseUrl={BaseUrl}/>} />
            </Routes>
        </MyContext.Provider>
        </>
    )
}