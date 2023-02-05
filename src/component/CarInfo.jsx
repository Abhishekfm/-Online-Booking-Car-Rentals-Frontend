import React from "react";

export function CarInfo(props){
    const calculateDifference = (start, end) => {
        const difference = new Date(end) - new Date(start);
        let days = Math.floor(difference / (1000 * 60 * 60 * 24));
        let hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        if(days < 0){
            days = 0
        }
        if(hours < 0){
            hours = 0
        }
        return `${days} days And ${hours} hours`;
      };
    return(
        <>
        <div className="flex rounded-[20px] h-max flex-col ml-8 m-2 bg-slate-100 gap-4 p-4 w-[350px]">
            <h1 className="text-[20px] font-semibold">Summary</h1>
            <div className="flex flex-col gap-2 p-2 border-dashed border-b-2 border-slate-400">
                <h1 className="text-[16px] text-slate-400 uppercase">Service Time</h1>
                <h2 className="text-[15px] font-semibold">Hourly</h2>
            </div>
            <div className="flex flex-col gap-2 p-2 border-dashed border-b-2 border-slate-400">
                <h1 className="text-[16px] text-slate-400 uppercase">Location</h1>
                <table class="table-auto w-1/2 text-left text-[18px]">
                        <thead>
                            <tr class="bg-gray-900 font-semibold text-white rounded-lg">
                                <th class="px-4 py-2">Country</th>
                                <th class="px-4 py-2">State</th>
                                <th class="px-4 py-2">City</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr class="bg-gray-100 text-[14px] font-semibold">
                                <td class="border px-4 py-2 uppercase">{props.country}</td>
                                <td class="border px-4 py-2 uppercase">{props.state}</td>
                                <td class="border px-4 py-2 uppercase">{props.city}</td>
                            </tr>
                        </tbody>
                </table>
            </div>
            <div className="flex flex-col gap-2 p-2 border-dashed border-b-2 border-slate-400">
                <h1 className="text-[16px] text-slate-400 uppercase">Start Date And Time</h1>
                <h2 className="text-[15px] font-semibold">{props?props.startDate:"aksmk"}</h2>
            </div>
            <div className="flex flex-col gap-2 p-2 border-dashed border-b-2 border-slate-400">
                <h1 className="text-[16px] text-slate-400 uppercase">End Date And Time</h1>
                <h2 className="text-[15px] font-semibold">{props?props.endDate:"ajhbd"}</h2>
            </div>
            <div className="flex flex-col gap-2 p-2 border-dashed border-b-2 border-slate-400">
                <h1 className="text-[16px] text-slate-400 uppercase">Total Time</h1>
                <h2 className="text-[15px] font-semibold">{calculateDifference(props.startDate, props.endDate)}</h2>
            </div>
        </div>
        </>
    )
}