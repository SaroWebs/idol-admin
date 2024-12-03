import { Button, Modal, Select, TextInput, Text } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import axios from 'axios';
import '@mantine/dates/styles.css';

// Extend dayjs with timezone plugins
dayjs.extend(utc);
dayjs.extend(timezone);

const AddTrip = (props) => {
    const { drivers } = props;
    const [opened, { open, close }] = useDisclosure(false);

    const [formData, setFormData] = useState({
        tripDate: null,
        selectedDriver: '',
        instructions: '',
    });

    const handleChange = (field) => (value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSubmit = () => {
        const tripDate = formData.tripDate
            ? dayjs(formData.tripDate)
                  .tz('Asia/Kolkata') // Normalize to IST
                  .format('YYYY-MM-DD') // Format as 'YYYY-MM-DD'
            : null;

        const payload = {
            trip_date: tripDate,
            user_id: formData.selectedDriver,
            instructions: formData.instructions,
        };

        axios
            .post('/trip/new', payload)
            .then((res) => {
                console.log('Trip added successfully:', res.data);
                close();
            })
            .catch((error) => {
                console.error('Error adding trip:', error.message);
            });
    };

    const driverOptions = drivers.map((driver) => ({
        value: String(driver.id),
        label: driver.name,
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
                    onChange={(date) => handleChange('tripDate')(date)}
                    required
                    minDate={new Date()}
                />

                <Select
                    label="Select Driver"
                    placeholder="Choose a driver"
                    value={formData.selectedDriver}
                    onChange={handleChange('selectedDriver')}
                    data={driverOptions}
                    required
                />

                <TextInput
                    label="Instructions (optional)"
                    placeholder="Enter any special instructions"
                    value={formData.instructions}
                    onChange={(event) =>
                        handleChange('instructions')(event.currentTarget.value)
                    }
                />

                <Button onClick={handleSubmit} mt="md">
                    Submit
                </Button>
            </Modal>
        </>
    );
};

export default AddTrip;
