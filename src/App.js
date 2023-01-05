import React from "react";
import { LogIn } from "./pages/LogIn";
import { SignUp } from "./pages/SignUp";
import { SearchPage } from "./pages/SearchPage";
import { Admin } from "./pages/Admin";
import { Route, Routes} from "react-router-dom";

export function App(){
    const BaseUrl = "http://localhost:4000"
    return(
        <>
        <Routes>
            <Route exact path="/" element={<SignUp BaseUrl={BaseUrl}/>} />
            <Route exact path="/login" element={<LogIn BaseUrl={BaseUrl}/>} />
            <Route exact path="/home" element={<SearchPage BaseUrl={BaseUrl}/>} />
            <Route exact path="/admin" element={<Admin BaseUrl={BaseUrl}/>} />
        </Routes>
        
        </>
    )
}