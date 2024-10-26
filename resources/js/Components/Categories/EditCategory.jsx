import { useDisclosure } from '@mantine/hooks'
import { Modal, FileInput, InputLabel, TextInput, Button } from '@mantine/core';
import React, { useState, useEffect } from 'react';
import { XIcon } from 'lucide-react';

const EditCategory = ({ category, reload }) => {
    const [opened, { open, close }] = useDisclosure(false);

    const [formInfo, setFormInfo] = useState({
        name: '',
        description: '',
        icon: null,
        image: null,
        status: 1,
    });
    useEffect(() => {

        if (category) {
            setFormInfo({
                name: category.name,
                description: category.description,
                icon: category.icon_path ? { file: null, url: category.icon_path } : null, 
                image: category.image_path ? { file: null, url: category.image_path } : null,
                status: category.status,
            });
        }
    }, [category]);

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
        console.log(formInfo);
        console.log(fd);
        // axios.put(`/categories/${category.id}`, fd)
        //     .then(res => {
        //         if (reload) {
        //             reload();
        //             close();
        //         } else {
        //             window.location.reload();
        //         }
        //     })

        //     .catch(err => {
        //         console.error('Error updating category:', err.message);
        //     });
    };

    return (
        <>
            <button
                className="text-blue-500 hover:underline mr-2"
                onClick={open}
            >
                Edit
            </button>
            <Modal opened={opened} onClose={close} title={'Edit Category'}>
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
                                        {formInfo.icon.file ?
                                            <img src={formInfo.icon.url} alt="Icon Preview" className="object-fill h-28" />
                                            :
                                            <img src={' storage/' + formInfo.icon.url} alt="Icon Preview" className="object-fill h-28" />
                                        }
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
                            <InputLabel htmlFor="image-upload" className="w-full relative border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center h -32 cursor-pointer">
                                {formInfo.image ? (
                                    <div className="relative">
                                        {formInfo.image.file ?
                                            <img src={formInfo.image.url} alt="Image Preview" className="object-fill h-28" />
                                            :
                                            <img src={'storage/' + formInfo.image.url} alt="Image Preview" className="object-fill h-28" />
                                        }
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

                    <Button type="submit" className="mt-4 bg-blue-500 hover:bg-blue-600 text-white">
                        Update
                    </Button>
                </form>
            </Modal>
        </>
    )
}

export default EditCategory
