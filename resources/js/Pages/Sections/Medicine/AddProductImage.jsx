import { ActionIcon, Modal, Button, Loader, Input } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { ImageIcon, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AddProductImage = ({ product, reload }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [existingImages, setExistingImages] = useState(product?.images || []);
    const [uploadedImages, setUploadedImages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (opened) {
            console.log("Existing images:", existingImages);
            console.log("Uploaded images:", uploadedImages);
        }
    }, [opened, existingImages, uploadedImages]);

    const handleUploadImages = (event) => {
        const files = Array.from(event.target.files);
        const newUploadedImages = files.map((file) => ({
            id: Date.now() + file.name,  // Unique ID for each image
            image_path: URL.createObjectURL(file),  // Temporary URL for preview
            file,  // Store the file for upload handling
        }));
        setUploadedImages((prev) => [...prev, ...newUploadedImages]);
    };

    const handleRemoveExistingImage = async (id) => {
        setIsLoading(true);
        try {
            await axios.delete(`/product-image/${id}`);
            setExistingImages((prev) => prev.filter((img) => img.id !== id));
            reload();
            handleClose();
        } catch (error) {
            console.error("Remove error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleUploadImage = async () => {
        setIsLoading(true);
        const formData = new FormData();

        uploadedImages.forEach((img) => formData.append('images[]', img.file)); // Note the use of 'images[]' to match the backend

        try {
            const response = await axios.post(`/product/${product.id}/product-image/new`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            reload();
            handleClose();
        } catch (error) {
            if (error.response) {
                console.error("Upload error:", error.response.data.message); // Log specific error message from server
            } else {
                console.error("Upload error:", error.message); // Log general error message
            }
        } finally {
            setIsLoading(false);
        }
    };

    // Handle closing the modal and clearing fields
    const handleClose = () => {
        setUploadedImages([]); // Clear uploaded images
        close(); // Close the modal
    };

    return (
        <>
            <ActionIcon onClick={open}>
                <ImageIcon />
            </ActionIcon>
            <Modal opened={opened} onClose={handleClose} size="70%">
                <div className="w-full">
                    {/* Upload New Images Section */}
                    <h4 className="mb-2">Upload New Images</h4>
                    <Input
                        type="file"
                        multiple
                        onChange={handleUploadImages}
                        accept="image/*"
                    />
                    {uploadedImages.length > 0 && (
                        <div className="flex flex-wrap gap-4 my-4">
                            {uploadedImages.map((img) => (
                                <div key={img.id} className="h-32 w-32 relative">
                                    <img src={img.image_path} alt="Uploaded" className="h-full w-full object-cover" />
                                    <Trash2
                                        className="absolute top-2 right-2 text-red-600 cursor-pointer"
                                        onClick={() => setUploadedImages((prev) => prev.filter((image) => image.id !== img.id))}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                    <Button onClick={handleUploadImage} disabled={isLoading || uploadedImages.length === 0} className="mt-2">
                        {isLoading ? <Loader size="sm" /> : "Upload Images"}
                    </Button>

                    <hr className="my-4" />

                    {/* Existing Images Section */}
                    {existingImages && existingImages.length > 0 && (
                        <div className="">
                            <h4 className="mb-2">Product Images</h4>
                            <div className="flex flex-wrap gap-4 my-4">
                                {existingImages.map((img) => (
                                    <div key={img.id} className="h-32 w-32 relative">
                                        <img src={'storage/' + img.image_path} alt="Product" className="h-full w-full object-cover" />
                                        <Trash2
                                            className="absolute top-2 right-2 text-red-600 cursor-pointer"
                                            onClick={() => handleRemoveExistingImage(img.id)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default AddProductImage;