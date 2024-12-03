import { Button, Modal, TextInput, Notification } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import axios from 'axios';

const NewAddress = ({ customer_id }) => {
    const [opened, { open, close }] = useDisclosure(false);
    const [loading, setLoading] = useState(false);
    const [formValid, setFormValid] = useState(false);
    const [info, setInfo] = useState({
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        pin: '',
        type: 'home'
    });
    const [error, setError] = useState('');

    const validateForm = () => {
        const { address_line_2, ...fieldsToValidate } = info;
        const isValid = Object.values(fieldsToValidate).every(field => field.trim() !== '');
        setFormValid(isValid);
        return isValid;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInfo(prev => ({ ...prev, [name]: value }));
        setError('');
        validateForm();
    };

    const validatePin = async (e) => {
        const pin = e.target.value;
        setInfo(prev => ({ ...prev, pin })); // Update state with the new PIN

        if (!/^\d{6}$/.test(pin)) {
            setError('Invalid PIN format. It must be a 6-digit number.');
            setFormValid(false);
            return;
        }

        try {
            const response = await axios.get(`/api/pin/check?pin=${pin}`);
            if (response.status === 200) {
                setFormValid(true);
            } else {
                setError('Invalid PIN. Please try again.');
                setFormValid(false);
            }
        } catch (error) {
            setError('Invalid PIN. Please try again.');
            console.error('Error validating PIN:', error);
            setFormValid(false);
        }
    };

    const handleSubmit = async () => {
        if (!validateForm()) return;

        setLoading(true);
        setError('');

        try {
            const response = await axios.post(`/customer/${customer_id}/address/store`, info);
            if (response.status === 200 || response.status === 201) {
                // Reset form state
                setInfo({
                    address_line_1: '',
                    address_line_2: '',
                    city: '',
                    state: '',
                    pin: '',
                    type: 'home'
                });
                close();
            } else {
                setError('Failed to add new address. Please try again.');
            }
        } catch (error) {
            setError('Error adding new address. Please try again.');
            console.error('Error adding new address:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setInfo({
            address_line_1: '',
            address_line_2: '',
            city: '',
            state: '',
            pin: '',
            type: 'home'
        });
        setError('');
        close();
    };

    return (
        <>
            <Button onClick={ open}>New Address</Button>
            <Modal opened={opened} onClose={handleClose} size={'xl'}>
                <div className="flex flex-col gap-2 p-4">
                    <h2 className='text-2xl'>Create Address</h2>
                    {error && <Notification color="red" onClose={() => setError('')}>{error}</Notification>}
                    <TextInput
                        label="Address Line 1"
                        name="address_line_1"
                        value={info.address_line_1}
                        onChange={handleInputChange}
                    />
                    <TextInput
                        label="Address Line 2"
                        name="address_line_2"
                        value={info.address_line_2}
                        onChange={handleInputChange}
                    />
                    <TextInput
                        label="City"
                        name="city"
                        value={info.city}
                        onChange={handleInputChange}
                    />
                    <TextInput
                        label="State"
                        name="state"
                        value={info.state}
                        onChange={handleInputChange}
                    />
                    <TextInput
                        label="Pincode"
                        name="pin"
                        value={info.pin}
                        onChange={handleInputChange}
                        onBlur={validatePin}
                    />
                    <div className="flex justify-end gap-3">
                        <Button color={'gray'} onClick={handleClose}>Cancel</Button>
                        <Button
                            loading={loading}
                            disabled={loading || !formValid}
                            onClick={handleSubmit}
                            color={'teal'}
                        >
                            Save Address
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
};

export default NewAddress;