<<<<<<< HEAD
import { Button } from '@mantine/core';
import axios from 'axios';
import React from 'react';

const ExportMedicine = () => {

  const handleExport = async () => {
    try {
      const response = await axios.get('/products/export', {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'products_export.csv');
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error("Error exporting data:", error);
    }
  };

  return (
    <Button onClick={handleExport} color={'orange'}>Export</Button>
  );
};

export default ExportMedicine;
=======
import { Button } from '@mantine/core'
import React from 'react'

const ExportMedicine = () => {
  const handleExport=()=>{
    // export csv to 
  }
  return (
    <>
      <Button onClick={handleExport} color={'orange'}>Export</Button>
    </>
  )
}

export default ExportMedicine
>>>>>>> 300597030a64cea06392d2d1db56898b18393714
