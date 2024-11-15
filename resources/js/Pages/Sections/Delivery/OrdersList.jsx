import MasterLayout from '@/Layouts/MasterLayout';
import React, { useState, useEffect } from 'react';
import { DatePickerInput } from '@mantine/dates';
import { Button, Card, Stack, Text } from '@mantine/core';
import axios from 'axios';
import dayjs from 'dayjs';
import '@mantine/dates/styles.css';


const OrdersList = (props) => {
  const [trips, setTrips] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(null); // Track which action is loading


  const getTrips = () => {
    const user_id = props.auth?.user?.id;
    let fd = new FormData();
    if (selectedDate && user_id) {
      const refine = dayjs(selectedDate).add(1, 'day').toDate()
      fd.append('date', refine.toISOString().split('T')[0]);
      axios.post(`/data/delivery/trips/${user_id}`, fd)
        .then(res => {
          setTrips(res.data);
        })
        .catch(err => {
          console.log(err.message);
        });
    } else {
      console.log("check if the date is present or not");
    }

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

  const handleAction = (id, action) => {
    setLoading(action);
    axios.post(`/order/${id}/${action}`)
      .then(res => {
        console.log(res.data);
        getTrips();
      })
      .catch(err => {
        console.log(err);
      })
      .finally(() => setLoading(null));
  };

  const formattedAddress = (address) => {
    const add_str = address.address_line_1 + ', ' + address.address_line_2 + ', ' + address.city + ', ' + address.pin;
    return add_str;
  }

  return (
    <MasterLayout {...props}>
      <div className="p-6 bg-gray-200 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Orders List</h1>

        <div className="flex">
          <DatePickerInput
            value={selectedDate}
            onChange={setSelectedDate}
            label="Select Date"
            className="mb-4"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {(trips && trips.length > 0) ? (
            trips.map(trip => (
              <Card key={trip.id} shadow="sm" padding="lg" className='bg-white'>
                <div className="flex justify-between">
                  <Text weight={500}>Trip ID: {trip.id}</Text>
                  <Text>Date: {trip.trip_date}</Text>
                </div>

                <hr className='my-6' />

                <Stack>
                  {trip.trip_items.map(item => (
                    <div className="mb-4" key={item.id}>
                      <div className="p-3 rounded-md shadow-md text-sm">
                        <div className="">
                          <p className="text-xl font-bold">Order No: {item.order.order_no}</p>
                          <div className="font-bold">Amount: {item.receivable_amount}</div>
                          <div className="font-bold">Payment Mode: {item.order.payment_mode}</div>
                          <div className="font-bold">Payment Status: {item.order.payment_status}</div>
                        </div>
                        <hr className="my-2" />
                        <div className="flex justify-between">
                          <div className="">
                            <p><b>Customer:</b> {item.order.customer.name}</p>
                            <p><b>Phone:</b> {item.order.customer.phone}</p>
                            <p><b>Shipping Address:</b> {formattedAddress(item.order.customer_address)}</p>
                          </div>

                          <div className="actions">
                            {item.order.status == 'cancelled' && <Button disabled>Cancelled</Button>}

                            {item.order.status == 'delivered' && <Button disabled>Delivered</Button>}

                            {item.order.status == 'onway' &&
                              (<>
                                <Button onClick={() => handleAction(item.order_id, 'cancel')}>Cancel Order</Button>
                                <Button onClick={() => handleAction(item.order_id, 'deliver')}>Deliver</Button>
                              </>)
                            }
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </Stack>
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