import MasterLayout from '@/Layouts/MasterLayout';
import React, { useState, useEffect } from 'react';
import { DatePicker } from '@mantine/dates';
import { Button, Card, Text } from '@mantine/core';
import axios from 'axios';

const OrdersList = (props) => {
  const [trips, setTrips] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getTrips = () => {
    let fd = new FormData();
    // Append selected date to FormData
    if (selectedDate) {
      fd.append('date', selectedDate.toISOString().split('T')[0]);
    }

    axios.post('/data/delivery/trips', fd)
      .then(res => {
        setTrips(res.data);
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getTrips();
  }, [selectedDate]);


  const handleOrderDelivered = (id) => {
    axios.post(`/data/delivery/trips/${id}/deliver`)
      .then(res => {
        getTrips(); // Refresh the trips list
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  const handleOrderCancelled = (id) => {
    axios.post(`/data/delivery/trips/${id}/cancel`)
      .then(res => {
        getTrips(); // Refresh the trips list
      })
      .catch(err => {
        console.log(err.message);
      });
  };

  return (
    <MasterLayout {...props}>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Orders List</h1>

        <DatePicker
          value={selectedDate}
          onChange={setSelectedDate}
          label="Select Date"
          className="mb-4"
        />

        <div className="grid grid-cols-1 gap-4">
          {trips.length > 0 ? (
            trips.map(trip => (
              <Card key={trip.id} shadow="sm" padding="lg">
                <Text weight={500}>Trip ID: {trip.id}</Text>
                <Text>Date: {trip.date}</Text>
                <Text>Orders: {trip.trip_items.length} items</Text>
              </Card>
            ))
          ) : (
            <Text>No trips found for the selected date.</Text>
          )}
        </div>
      </div>
    </MasterLayout>
  );
};

export default OrdersList;