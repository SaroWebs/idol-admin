import React, { useState, useEffect } from 'react';
import { Modal, Table, Button, TextInput, Checkbox } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';

const PincodeList = () => {
  const [items, setItems] = useState([]);

  // Fetch data
  const getData = () => {
    axios
      .get('/data/pincode/list')
      .then((res) => {
        setItems(res.data);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const rows = items.map((item) => (
    <Table.Tr key={item.id}>
      <Table.Td>{item.pin}</Table.Td>
      <Table.Td>{Number(item.distance).toFixed(2)} km</Table.Td>
      <Table.Td>{item.description || '-'}</Table.Td>
      <Table.Td>{item.active ? 'Active' : 'Inactive'}</Table.Td>
      <Table.Td>
        <div className="flex gap-2">
          <EditItem item={item} reload={getData} />
        </div>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="w-full my-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Available Delivery Regions</h3>
        <NewRegion reload={getData} />
      </div>
      <div className="content">
        <Table striped highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Pincode</Table.Th>
              <Table.Th>Distance</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Status</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>
    </div>
  );
};

const EditItem = ({ item, reload }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [formData, setFormData] = useState({
    pin: item.pin,
    distance: item.distance,
    description: item.description || '',
    active: item.active,
  });

  const handleSubmit = () => {
    axios
      .put(`/data/pincode/edit/${item.id}`, formData)
      .then(() => {
        reload();
        close();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <>
      <Button onClick={open} variant="outline" color="blue" size="xs">
        Edit
      </Button>
      <Modal opened={opened} onClose={close} title="Edit Region">
        <form onSubmit={(e) => e.preventDefault()}>
          <TextInput
            label="Pincode"
            value={formData.pin}
            onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
            required
          />
          <TextInput
            label="Distance (km)"
            value={formData.distance}
            onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) || 0 })}
            required
          />
          <TextInput
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Checkbox
            label="Active"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Save</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

const NewRegion = ({ reload }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [formData, setFormData] = useState({
    pin: '',
    distance: 0,
    description: '',
    active: true,
  });

  const handleSubmit = () => {
    axios
      .post('/data/pincode/create', formData)
      .then(() => {
        reload();
        close();
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <>
      <Button onClick={open} variant="filled" color="blue">
        Add New Region
      </Button>
      <Modal opened={opened} onClose={close} title="Add New Region">
        <form onSubmit={(e) => e.preventDefault()}>
          <TextInput
            label="Pincode"
            value={formData.pin}
            onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
            required
          />
          <TextInput
            label="Distance (km)"
            value={formData.distance}
            onChange={(e) => setFormData({ ...formData, distance: parseFloat(e.target.value) || 0 })}
            required
          />
          <TextInput
            label="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <Checkbox
            label="Active"
            checked={formData.active}
            onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
          />
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="default" onClick={close}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Add</Button>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default PincodeList;
