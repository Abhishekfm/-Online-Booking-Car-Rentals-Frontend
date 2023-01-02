import React from "react";
import { LogIn } from "./pages/LogIn";
import { SignUp } from "./pages/SignUp";
import { Route, Routes} from "react-router-dom";

export function App(){
    return(
        <>
        <Routes>
            <Route exact path="/" element={<SignUp/>} />
            <Route exact path="/login" element={<LogIn/>} />
        </Routes>
        
        </>
    )
}