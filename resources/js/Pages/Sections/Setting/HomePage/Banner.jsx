import { Button, Modal, TextInput, FileInput, Loader, Notification } from '@mantine/core';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDisclosure } from '@mantine/hooks';

const Banner = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/data/core-images/banner`);
      setItems(res.data || []);
    } catch (err) {
      setError("Failed to fetch banners.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (id) => {
    if (!window.confirm("Are you sure you want to remove this banner?")) return;
    try {
      await axios.delete(`/data/core-images/banner/${id}`);
      setItems((prevItems) => prevItems.filter(item => item.id !== id));
    } catch (err) {
      console.error("Failed to delete banner", err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className={'text-2xl font-bold'}>Banner Sliders</h2>
        <AddBanner reload={getData} />
      </div>
      {error && <Notification color="red" title="Error">{error}</Notification>}
      <div className="grid grid-cols-4 gap-3">
        {loading ? (
          <Loader />
        ) : (
          items.map((item) => (
            <div key={item.id} className="rounded overflow-hidden shadow">
              <img src={'storage/' + item.image_url} alt={item.heading || "Banner"} className="w-full h-48 object-cover" />
              <div className="p-2 flex justify-between items-center">
                <span>{item.heading}</span>
                <Button color="red" size="xs" onClick={() => handleRemove(item.id)}>Remove</Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

const AddBanner = ({ reload }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file) return alert("Please select an image");

    setLoading(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    axios.post(`/core-image/banner/new`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then(res => {
        reload();
        close();
        setFile(null);
        setTitle("");
      })
      .catch(err => {
        console.error("Failed to add banner", err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      <Button onClick={open}>Add Banner</Button>
      <Modal opened={opened} onClose={close} title="Add New Banner">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Title"
            placeholder="Banner title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            mb="sm"
          />
          <FileInput
            label="Banner Image"
            placeholder="Upload image"
            value={file}
            onChange={setFile}
            required
            accept="image/*"
            mb="sm"
          />
          <Button type="submit" loading={loading} fullWidth>
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
};

export default Banner;
