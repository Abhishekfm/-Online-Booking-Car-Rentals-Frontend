import axios from "axios";
import React from "react";
import { useState } from "react";

export const Admin = () => {
    const [image, setImage] = useState("")
    const uploadImage = async() => {
         // Get the file from the event
        const file = image
        console.log(file);
        let url;
        // Upload the file to Cloudinary
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'carimagecloud');
        formData.append('cloud_name', 'dl7dfvlz8')
        formData.append("api_key", process.env.CLOUD_API_KEY);

        await fetch('https://api.cloudinary.com/v1_1/dl7dfvlz8/image/upload', {
          method: 'POST',
          body: formData,
        })
          .then((response) => response.json())
          .then((data)=>{
            url = data.url
            console.log(data);
          }).catch((err)=>{
            console.log(err);
          })
          console.log(url);
    }
    return(
        <>
        <div>
            <input type="file" onChange={(e) => {setImage(e.target.files[0])}} />
            <button className="Upload this document" onClick={uploadImage}>Upload</button>
        </div>
        </>
    )
}