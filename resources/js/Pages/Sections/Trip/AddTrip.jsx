import { Button, Modal, Select, TextInput, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import axios from 'axios'; // Make sure to import axios
import '@mantine/dates/styles.css';

const AddTrip = (props) => {
    const { drivers } = props;

    const [formData, setFormData] = useState({
        tripDate: null,
        selectedDriver: '',
        instructions: '',
    });
    const [opened, { open, close }] = useDisclosure(false);

    const handleChange = (field) => (value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        axios.post('/trip/new', {
            trip_date: formData.tripDate,
            user_id: formData.selectedDriver,
            instructions: formData.instructions
        })
            .then(res => {
                console.log(res.data);
                close();
            }).catch(error => {
                console.error('Error adding trip:', error.message);
            });
    };

    // Format drivers for Select component
    const driverOptions = drivers.map(driver => ({
        value: String(driver.id),
        label: driver.name
    }));

    return (
        <>
            <Button onClick={open}>Add Trip</Button>

            <Modal
                opened={opened}
                onClose={close}
                title="Add New Trip"
            >
                <Text mb="md">Please fill out the form below to add a new trip.</Text>

                <DatePickerInput
                    label="Trip Date"
                    placeholder="Select trip date"
                    value={formData.tripDate}
                    onChange={handleChange('tripDate')}
                    required
                    minDate={new Date()} // Ensures the date is today or in the future
                />
                <Select
                    label="Select Driver"
                    placeholder="Choose a driver"
                    value={formData.selectedDriver}
                    onChange={handleChange('selectedDriver')}
                    data={driverOptions} // Use the formatted driver options
                    required
                />
                <TextInput
                    label="Instructions (optional)"
                    placeholder="Enter any special instructions"
                    value={formData.instructions}
                    onChange={(event) => handleChange('instructions')(event.currentTarget.value)}
                />
                <Button onClick={handleSubmit} mt="md">
                    Submit
                </Button>
            </Modal>
        </>
    );
};

export default AddTrip;