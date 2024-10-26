import { FileInput, InputLabel, TextInput, Button } from '@mantine/core';
import React, { useState } from 'react';
import axios from 'axios';
import { XIcon } from 'lucide-react';

const AddCategory = ({ reload, setAddFormOpen }) => {
  const [formInfo, setFormInfo] = useState({
    name: '',
    description: '',
    icon: null,
    image: null,
    status: 1,
  });

  const handleFileChange = (file, type) => {
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setFormInfo((prev) => ({ ...prev, [type]: { file, url: fileUrl } }));
    }
  };

  const handleRemoveFile = (type) => {
    setFormInfo((prev) => ({ ...prev, [type]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const fd = new FormData();

    fd.append('name', formInfo.name);
    fd.append('description', formInfo.description);
    fd.append('status', formInfo.status);

    if (formInfo.icon) {
      fd.append('icon', formInfo.icon.file);
    }
    if (formInfo.image) {
      fd.append('image', formInfo.image.file);
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
    <div className="content">
      <div className="headings flex justify-between">
        <h1 className="text-2xl font-bold my-4">Categories</h1>
        <div className="actions flex gap-1">
          <Button color={'dark'} onClick={() => setAddFormOpen(false)}>Cancel</Button>
        </div>
      </div>
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
              {formInfo.icon ? (
                <div className="relative">
                  <img src={formInfo.icon.url} alt="Icon Preview" className="object-fill h-28" />
                  <div onClick={() => handleRemoveFile('icon')} className="absolute cursor-pointer top-1 right-1 bg-red-500 text-white rounded-full p-1">
                    <XIcon className='w-8' />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center flex-col items-center h-32 w-full">
                  <span className='text-xl font-semibold text-slate-700'>Upload Icon</span>
                  <span className="text-slate-800">(100 × 100)</span>
                  <span className="text-slate-600 text-xs">(jpg, png, svg)</span>
                </div>
              )}
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
              {formInfo.image ? (
                <div className="relative">
                  <img src={formInfo.image.url} alt="Image Preview" className="object-fill h-28" />
                  <div onClick={() => handleRemoveFile('image')} className="absolute cursor-pointer top-1 right-1 bg-red-500 text-white rounded-full p-1">
                    <XIcon className='w-8' />
                  </div>
                </div>
              ) : (
                <div className="flex justify-center flex-col items-center h-32 w-full">
                  <span className='text-xl font-semibold text-slate-700'>Upload Image</span>
                  <span className="text-slate-800">(336 × 280)</span>
                  <span className="text-slate-600 text-xs">(jpg, png)</span>
                </div>
              )}
              <FileInput
                id="image-upload"
                accept="image/*"
                onChange={(file) => handleFileChange(file, 'image')}
                className="hidden"
              />
            </InputLabel>
          </div>
        </div>

        <Button type="submit" className="mt-4" color={'green'}>
          Submit
        </Button>
      </form>
    </div>
  );

};


export default AddCategory;
