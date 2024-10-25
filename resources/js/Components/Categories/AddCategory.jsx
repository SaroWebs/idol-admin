import { FileInput, InputLabel, TextInput, Button } from '@mantine/core';
import { XIcon } from 'lucide-react';
import React, { useState } from 'react';
import axios from 'axios';

const AddCategory = ({ reload }) => {
  const [formInfo, setFormInfo] = useState({
    name: '',
    description: '',
    icon: null,
    image: null,
    status: 1,
  });

  const handleFileChange = (file, type) => {
    if (file) {
      if (type === 'icon') {
        setFormInfo((prev) => ({ ...prev, icon: file }));
      } else if (type === 'image') {
        setFormInfo((prev) => ({ ...prev, image: file }));
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();
    
    fd.append('name', formInfo.name);
    fd.append('description', formInfo.description);
    fd.append('status', formInfo.status);

    if (formInfo.icon) {
      fd.append('icon', formInfo.icon);
    }
    if (formInfo.image) {
      fd.append('image', formInfo.image);
    }

    axios.post('/categories/new', fd)
      .then(res => {
        console.log('Category added:', res.data);
        if (reload) {
          reload();
        } else {
          window.location.reload();
        }
      })
      .catch(err => {
        console.error('Error uploading category:', err.message);
      });
  };

  return (
    <form onSubmit={handleSubmit} className="p-2">
      <div className="grid grid-cols-2 gap-2">
        <TextInput
          label="Category Name"
          withAsterisk
          placeholder="Category Name"
          value={formInfo.name}
          onChange={(e) => setFormInfo({ ...formInfo, name: e.target.value })}
        />
        <TextInput
          label="Description"
          placeholder="Description"
          value={formInfo.description}
          onChange={(e) => setFormInfo({ ...formInfo, description: e.target.value })}
        />

        {/* Icon Upload */}
        <div className="w-full">
          <InputLabel htmlFor="icon-upload" className="w-full relative border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center h-32 cursor-pointer">
            <FileInput
              id="icon-upload"
              accept="image/*"
              onChange={(file) => handleFileChange(file, 'icon')}
              className="hidden"
            />
          </InputLabel>
        </div>

        {/* Image Upload */}
        <div className="w-full">
          <InputLabel htmlFor="image-upload" className="w-full relative border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center h-32 cursor-pointer">
            <FileInput
              id="image-upload"
              accept="image/*"
              onChange={(file) => handleFileChange(file, 'image')}
              className="hidden"
            />
          </InputLabel>
        </div>
      </div>

      <Button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
        Submit
      </Button>
    </form>
  );
};

export default AddCategory;
