import { useState, useEffect } from 'react';
import axios from 'axios';
import Papa from 'papaparse'
import Resizer from "react-image-file-resizer";

import { UpsertDATA, LinkUPSERTS, ImageLink } from 'src/hooks/upsert/upsert-data'

import * as Imp from './importants'

export const imagetoRESIZE = async (file) => {
    return new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        700, // maxWidth
        700, // maxHeight
        "JPEG", // compressFormat
        300, // quality
        0, // rotation
        (uri) => {
          resolve(uri);
        },
        "base64" // outputType
      );
    });
  };

export const imagetoUPLOAD = async (IMG,TITLE) =>{

          const byteString = atob(IMG.split(',')[1]);
          const mimeType = IMG.split(',')[0].split(':')[1].split(';')[0];
          const arrayBuffer = new ArrayBuffer(byteString.length);
          const intArray = new Uint8Array(arrayBuffer);
          
          for (let i = 0; i < byteString.length; i++) {
            intArray[i] = byteString.charCodeAt(i);
          }
  
          const blob = new Blob([arrayBuffer], { type: mimeType });
          
          const originalFileName = TITLE+'.jpg'; // Adjust filename as needed
          const originalFileType = blob.type; // Retrieve type from Blob
      
          const newFile = new File([blob], originalFileName, { type: originalFileType });
  
          return newFile;

}

export const imageUPLOADS = async (type,file,title) => {
 
  try {
    
    const newFile     = await imagetoUPLOAD(file,title);

    const formData = new FormData();

    formData.append('image', newFile);

    const response = await axios.post(ImageLink(type), formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response
  } catch (error) {

    console.error('Upload failed');
    
  }

};
