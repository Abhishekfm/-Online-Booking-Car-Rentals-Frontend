import React from "react";

export function CarInfo(){
    return(
        <>
        <div className="flex rounded-[20px] h-[420px] flex-col ml-8 m-2 bg-slate-100 gap-4 p-4 w-[350px]">
            <h1 className="text-lg">Summary</h1>
            <div className="flex flex-col gap-2 p-2 border-dashed border-b-2 border-slate-400">
                <h1 className="text-[16px] text-slate-400 uppercase">Service Time</h1>
                <h2 className="text-[15px]">Hourly</h2>
            </div>
            <div className="flex flex-col gap-2 p-2 border-dashed border-b-2 border-slate-400">
                <h1 className="text-[16px] text-slate-400 uppercase">Start Date And Time</h1>
                <h2 className="text-[15px]">17-jan-2023, 01:20 Pm</h2>
            </div>
            <div className="flex flex-col gap-2 p-2 border-dashed border-b-2 border-slate-400">
                <h1 className="text-[16px] text-slate-400 uppercase">End Date And Time</h1>
                <h2 className="text-[15px]">27-jan-2023, 01:20 Pm</h2>
            </div>
            <div className="flex flex-col gap-2 p-2 border-dashed border-b-2 border-slate-400">
                <h1 className="text-[16px] text-slate-400 uppercase">Total Time</h1>
                <h2 className="text-[15px]">2 days And 5 hours</h2>
            </div>
        </div>
        </>
    )
}