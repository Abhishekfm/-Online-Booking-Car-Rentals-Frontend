import { useState } from 'react';

export function MyForm({onInputChange}) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    // Calculate the minimum end date (5 hours after start date)
    const minEndDate = new Date(event.target.value);
    minEndDate.setHours(minEndDate.getHours() + 5);
    // Calculate the maximum end date (30 days after start date)
    const maxEndDate = new Date(event.target.value);
    maxEndDate.setDate(maxEndDate.getDate() + 30);
    // Update the min and max attributes of the end date input field
    document.getElementById('end-date').min = minEndDate.toISOString().substr(0, 16);
    document.getElementById('end-date').max = maxEndDate.toISOString().substr(0, 16);
    onInputChange(event.target.value,"")
    setEndDate("")
  }

  const handleEndDateChange = (event) => {
    if(!startDate){
        return
    }
    setEndDate(event.target.value);
    onInputChange(startDate, event.target.value)
  }

  return (
    <form className='w-full flex gap-4'>
      <div className='flex flex-col'>
      <label className='text-lg font-semibold' htmlFor="start-date">Start Date:</label>
      <input 
        type="datetime-local" 
        className="text-[20px] rounded-md p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0"
        id="start-date" 
        value={startDate} 
        onChange={handleStartDateChange}
        required
        min={new Date().toISOString().substr(0, 16)}
      />
      </div>
      <div className='flex flex-col'>
      <label className='text-lg font-semibold' htmlFor="end-date">End Date:</label>
      <input 
        type="datetime-local" 
        className="text-[20px] rounded-md p-2 focus:shadow-[0_3px_10px_rgb(0,0,0,0.2)] focus:border-0 focus:outline-0"
        id="end-date" 
        value={endDate} 
        onChange={handleEndDateChange}
        required
      />
      </div>
    </form>
  );
}
