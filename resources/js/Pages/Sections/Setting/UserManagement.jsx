import { Button, Modal, TextInput, Select, Notification, Table } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';
import React, { useEffect, useState } from 'react';

const UserManagement = (props) => {
  const roleCode = props.auth.role_code; // 0(superadmin), 1(Admin), 2(manager), 4(Driver/Delivery)
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const getData = () => {
    axios.get('/data/users')
      .then((res) => {
        setUsers(res.data);
      })
      .catch((err) => {
        setError(err.message);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Users</h2>
        <AddNewUser roleCode={roleCode} roles={props.roles} reload={getData} />
      </div>
      {error && <Notification color="red">{error}</Notification>}
      {/* User table to display user data */}
      <Table highlightOnHover withColumnBorders className="border rounded-md shadow-sm">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Name</Table.Th>
          <Table.Th>Email</Table.Th>
          <Table.Th>Role</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {users.map((user) => (
          <Table.Tr key={user.id}>
            <Table.Td>{user.name}</Table.Td>
            <Table.Td>{user.email}</Table.Td>
            <Table.Td>{user.role?.name}</Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
    </div>
  );
};

export default UserManagement;

const AddNewUser = ({ roleCode, roles, reload }) => {
  const [opened, { open, close }] = useDisclosure(false);
  const [formValues, setFormValues] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    user_role_id: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (role) => {
    setFormValues((prev) => ({ ...prev, user_role_id: role }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/data/users', formValues);
      reload(); // Refresh user list
      close();
      setFormValues({ name: '', email: '', phone: '', password: '', user_role_id: '' });
    } catch (err) {
      console.error('Failed to create user', err);
    } finally {
      setLoading(false);
    }
  };

  // Filter roles based on roleCode
  const filteredRoles = roles.filter((role) => role.code > roleCode);

  return (
    <>
      <Button onClick={open}>Create User</Button>
      <Modal opened={opened} onClose={close} title="Add New User">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Name"
            placeholder="User's name"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            required
            mb="sm"
          />
          <TextInput
            label="Email"
            placeholder="User's email"
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            required
            mb="sm"
          />
          <TextInput
            label="Phone"
            placeholder="User's phone number"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
            required
            mb="sm"
          />
          <TextInput
            label="Password"
            placeholder="User's password"
            type="password"
            name="password"
            value={formValues.password}
            onChange={handleChange}
            required
            mb="sm"
          />
          <Select
            label="Role"
            placeholder="Select role"
            value={formValues.user_role_id}
            onChange={handleRoleChange}
            data={filteredRoles.map((role) => ({
              value: role.id.toString(),
              label: role.name,
            }))}
            required
            mb="sm"
          />
          <Button type="submit" fullWidth loading={loading}>
            Submit
          </Button>
        </form>
      </Modal>
    </>
  );
};
