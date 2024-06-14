import React, { useState, useRef } from 'react';
import axios from 'axios';

export default function UploadItem() {
    const [file, setFile] = useState(null);
    
    const UPLOAD_ENDPOINT = 'https://13.211.65.106/pokerapp/upserting/uploads.php';
    
    const handleSubmit = async (e) => {
        e.preventDefault(); 
        let res = await uploadFile(file);
        console.log(res.data);
    }
    
    const uploadFile = async(file) => { 
       const formData = new FormData();        
       formData.append('avatar',file)
        
        return  await axios.post(UPLOAD_ENDPOINT, formData,{
            headers: {
                'content-type': 'multipart/form-data'
            }
        });
    }

    const handleOnChange = (e) => {
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
    }

    return (

    <form onSubmit={handleSubmit}>
        <h1>React File Upload</h1>
        <input type="file" onChange={handleOnChange} />
        <button type="submit">Upload File</button>
    </form>

	)
}

