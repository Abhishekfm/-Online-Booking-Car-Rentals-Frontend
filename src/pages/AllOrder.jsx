import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { NavBar } from "../component/NavBar";
import { PageNumber } from "../component/PageNumber";
import { AllOrdersComp } from "../component/AllOrdersComp";

export function AllOrder(props){
    const [skipNo, setSkipNo] = useState(0)
    const [numberOfPages, setNumberOfPages] = useState(0)
    const [orderHistory, setOrderHistory] = useState([])
    async function getOrder(){
        try {
            const res = await axios.post(`${props.BaseUrl}/admin/showorderdb`, { skipNo }, { withCredentials:true })
            if(!res){
                return
            } else{
                console.log(res);
                let page = Math.ceil(Number(res.data.totalLength)/5)
                setNumberOfPages(page)
                setOrderHistory(res.data.allFiveOrder)
            }
        } catch (error) {
            console.log(error);   
        }
    }
    async function getSuccessOrder(){
        try {
            const res = await axios.post(`${props.BaseUrl}/admin/success/orderdb`, { skipNo }, { withCredentials:true })
            if(!res){
                return
            } else{
                console.log(res);
                let page = Math.ceil(Number(res.data.totalLength)/5)
                setNumberOfPages(page)
                setOrderHistory(res.data.allFiveOrder)
            }
        } catch (error) {
            console.log(error);   
        }
    }
    async function getOrder(){
        try {
            const res = await axios.post(`${props.BaseUrl}/admin/showorderdb`, { skipNo }, { withCredentials:true })
            if(!res){
                return
            } else{
                console.log(res);
                let page = Math.ceil(Number(res.data.totalLength)/5)
                setNumberOfPages(page)
                setOrderHistory(res.data.allFiveOrder)
            }
        } catch (error) {
            console.log(error);   
        }
    }
    async function getOrder(){
        try {
            const res = await axios.post(`${props.BaseUrl}/admin/showorderdb`, { skipNo }, { withCredentials:true })
            if(!res){
                return
            } else{
                console.log(res);
                let page = Math.ceil(Number(res.data.totalLength)/5)
                setNumberOfPages(page)
                setOrderHistory(res.data.allFiveOrder)
            }
        } catch (error) {
            console.log(error);   
        }
    }
    useEffect(()=>{
        getOrder();
    },[skipNo])

    return(
        <>
        <NavBar BaseUrl={props.BaseUrl}/>
        <div className='w-full p-[10px]'>
          <img src="https://images.pexels.com/photos/6169033/pexels-photo-6169033.jpeg?auto=compress&cs=tinysrgb&w=600" className="w-full rounded-[20px] h-[350px] object-cover" alt="" />
        </div>
        <AllOrdersComp orderHistory={orderHistory} getOrder={getOrder} BaseUrl={props.BaseUrl} />
        <PageNumber setSkip={setSkipNo} pages={numberOfPages}/>
        </>
    )
}