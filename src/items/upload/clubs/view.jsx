import { useState, useEffect } from 'react';
import Papa from 'papaparse'
import axios from 'axios';


import Resizer from "react-image-file-resizer";

import * as Fnc from 'src/hooks/functions'
import * as Cls from 'src/hooks/classes'

import {Chip,Button,Container,Alert,Box,Divider} from '@mui/material';
import { Icon } from '@iconify/react';
import Grid from '@mui/material/Unstable_Grid2';

import { UpsertDATA, LinkUPLOAD } from 'src/hooks/upsert/upsert-data'

// ----------------------------------------------------------------------

export default function UploadClubs({ReData}) {

    const dataView  = localStorage.getItem('slk-dataview')

    const [csvData, setCsvData] = useState([]);

    const handleFileUpload = (event) => {
      const file = event.target.files[0];
      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        complete: (results) => {
          console.log('Parsed CSV result:', results.data);
          setCsvData(results.data);
          ReData(results.data)
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
        }
      });
    };

    async function proceedSubmit(i,ii) {
      console.log(UpsertDATA(i))
      try {
        
        const response = await axios.post(LinkUPLOAD(ii),UpsertDATA(i));

        const feed =  response.data;
        
        console.log(JSON.stringify(feed,null,2))

      } catch (error) {
        alert("FAILED CSV ! "+error)
      }

    }

    const UploadCSV = () => {
        
        const csvdatas = {
                            JSONType: 'CLUB',
                            JSONData: csvData,
                        }

        proceedSubmit(csvdatas,'clubs')
        console.log(JSON.stringify(csvdatas,null,2))

    };
    
    const imagetoRESIZE = async (file) => {
      return new Promise((resolve) => {
        Resizer.imageFileResizer(
          file,
          350, // maxWidth
          350, // maxHeight
          "JPEG", // compressFormat
          100, // quality
          0, // rotation
          (uri) => {
            resolve(uri);
          },
          "base64" // outputType
        );
      });
    };

    const [selectedFile, setSelectedFile] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
  
    const handleFileChanges = async (event) => {
      const file = event.target.files[0];
      const resizedFile = await imagetoRESIZE(file);
      setSelectedFile(resizedFile);
      setUploadError(null);
      console.log(resizedFile);
    };
    
    const imagetoFILE = (fileData,fileTitle) => {
        const byteString = atob(fileData.split(',')[1]);
        const mimeType = fileData.split(',')[0].split(':')[1].split(';')[0];
        const arrayBuffer = new ArrayBuffer(byteString.length);
        const intArray = new Uint8Array(arrayBuffer);
        
        for (let i = 0; i < byteString.length; i++) {
          intArray[i] = byteString.charCodeAt(i);
        }

        const blob = new Blob([arrayBuffer], { type: mimeType });
        
        const originalFileName = fileTitle+'.jpg'; // Adjust filename as needed
        const originalFileType = blob.type; // Retrieve type from Blob
    
        const newFile = new File([blob], originalFileName, { type: originalFileType });

        return newFile;
    };

    const handleUpload = async () => {

      if (!selectedFile) {
        setUploadError('Please select an image to upload');
        return;
      }
  
      setIsUploading(true);
  
      try {

        const newFile = imagetoFILE(selectedFile,'titled');

        const formData = new FormData();
        formData.append('image', newFile);
  
        const response = await axios.post('https://54.252.185.246/poker/uploads/images.php', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
  
        console.log(response.data); // Handle successful upload (optional)
        setSelectedFile(null); // Clear selected file state
      } catch (error) {
        console.error('Upload failed:', error);
        setUploadError(error.message || 'Upload error');
      } finally {
        setIsUploading(false);
      }
    };
    
  return (
    <>

    <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
        <Chip
          size='small'
          label="Club Template"
          onDelete={()=>{}}
          onClick={()=>Fnc.downloadFile('/csv/','CSV_CLUB.csv')}
          sx={{'&:hover': { cursor: 'pointer' },border: '1px none violet'}}
          deleteIcon={<Icon icon="line-md:download-outline-loop" color='violet' width={'25'} />}
          variant="outlined"
        />
    </Box>

    <Box component="section" style={{color:'violet'}} sx={{ p: 2, border: '1px dashed grey',color: 'primary.main' }}>
        <input type="file" accept=".csv" className='InputFile' onChange={handleFileUpload} />
    </Box>
    
    <Chip
        label="Upload File"
        onClick={()=>UploadCSV()}
        sx={{'&:hover': { cursor: 'pointer' },border: '1px none violet',marginTop:'10px'}}
        icon={<Icon icon="line-md:upload-outline-loop" color='violet' width={'25'} />}
        variant="outlined"
      />
        <Divider sx={{ borderStyle: 'dashed', m: 1 }} />
        <Divider sx={{ borderStyle: 'dashed', m: 1 }} />
        <Divider sx={{ borderStyle: 'dashed', m: 1 }} />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '5px' }}>
        <Chip
          size='small'
          label="Club Template"
          onDelete={()=>{}}
          onClick={()=>Fnc.downloadFile('/csv/','CSV_CLUB.csv')}
          sx={{'&:hover': { cursor: 'pointer' },border: '1px none violet'}}
          deleteIcon={<Icon icon="line-md:download-outline-loop" color='violet' width={'25'} />}
          variant="outlined"
        />
    </Box>


    <div>
      <input type="file" accept='.jpeg, .jpg, .png' onChange={handleFileChanges} />
      <button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </button>
      {uploadError && <p style={{ color: 'red' }}>{uploadError}</p>}
    </div>
    <img src={selectedFile} alt="Preview" />
    </>



  );
}

