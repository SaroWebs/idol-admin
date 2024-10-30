<<<<<<< HEAD
import { Button, Modal, FileInput, Progress, Notification, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import axios from 'axios';

const ImportMedicine = () => {
  const [opened, { open, close }] = useDisclosure(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [progress, setProgress] = useState(0);
  const [notification, setNotification] = useState(null);

  const handleFileChange = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      showNotification('Please select a file to upload', 'red');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await uploadFile(formData);
      resetForm();
      showNotification('File uploaded successfully!', 'green');
    } catch (error) {
      showNotification('Error uploading file: ' + error.message, 'red');
    }
  };

  const uploadFile = async (formData) => {
    await axios.post('/api/import-medicine', formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        setProgress(percentCompleted);
      },
    });
  };

  const showNotification = (message, color) => {
    setNotification({ message, color });
  };

  const resetForm = () => {
    setFile(null);
    setFileName('');
    setProgress(0);
  };

  return (
    <>
      <Button color="purple" onClick={open}>Import</Button>
      <Modal title="Import Medicine" opened={opened} onClose={close} size="60%">
        <div className="w-full">
          <FileInput
            label="Upload CSV File"
            placeholder="Select a file..."
            onChange={handleFileChange}
            accept=".csv"
          />
          {fileName && <Text mt="sm">{`Selected file: ${fileName}`}</Text>}
          <Button onClick={handleUpload} disabled={!file} mt="md">Upload</Button>
          {progress > 0 && <Progress value={progress} mt="md" />}
          {notification && (
            <Notification
              title="Notification"
              color={notification.color}
              onClose={() => setNotification(null)}
              mt="md"
            >
              {notification.message}
            </Notification>
          )}
=======
import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks'
import React from 'react'

const ImportMedicine = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleUpload=()=>{
    // upload to /product/import
  }
  return (
    <>
      <Button onClick={open} color={'purple'}>Import</Button>
      <Modal onClose={close} opened={opened} size={'60%'}>
        <div className="">
        {/* input csv file*/}
        {/* uploaded file information  */}
        {/* upload button */}
        {/* upload progress */}
>>>>>>> 300597030a64cea06392d2d1db56898b18393714
        </div>
      </Modal>
    </>
  );
};

export default ImportMedicine;