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

  const getStatus = async (itemId) => {
    try {
      const response = await axios.get(`/order_item/${itemId}/status/get`);
      return response.data.status;
    } catch (error) {
      console.error("Error fetching status", error);
      return "Unknown";
    }
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
                  {trip.trip_items.map(item => {
                    return (
                      <div className="mb-4 rounded-md shadow-md" key={item.id}>
                        <div className="p-3 text-sm">
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

                            <div className="actions flex gap-2">
                              {item.order.status == 'cancelled' && <Button disabled>Cancelled</Button>}
                              {item.order.status == 'delivered' && <Button disabled>Delivered</Button>}
                              {item.order.status == 'returned' && <Button disabled>Returned</Button>}

                              {(!['delivered', 'returned', 'cancelled'].includes(item.order.status)) && 
                                (<>
                                  <Button onClick={() => handleAction(item.order_id, 'cancel')}>Cancel Order</Button>
                                  <Button onClick={() => handleAction(item.order_id, 'deliver')}>Deliver</Button>
                                </>)
                              }
                            </div>

                          </div>
                          {/* show order items */}
                          <OrderDetails order={item.order} getStatus={getStatus} />
                        </div>
                      </div>
                    );
                  })}
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


const OrderDetails = ({ order, getStatus }) => {
  const [details, setDetails] = useState(order);



  const cancelOrderItem = (itemId) => {
    const reason = prompt('Please provide a reason to cancel the item:');
    if (reason && reason.trim() !== '') {
      axios.post(`order-item/${itemId}/cancel`, { reason })
        .then(res => {
          alert('The item has been successfully canceled.');
        })
        .catch(err => {
          alert('Failed to cancel the item. Please try again later.');
        });
    } else {
      alert('Cancellation reason is required.');
    }
  };


  useEffect(() => {
    const fetchStatuses = async () => {
      const updatedOrderItems = await Promise.all(order.order_items.map(async (item) => {
        const status = await getStatus(item.id); // Fetch status for each item
        return { ...item, status }; // Add status to each item
      }));

      setDetails({
        ...order,
        order_items: updatedOrderItems, // Update order_items with the new statuses
      });
    };

    if (order.order_items) {
      fetchStatuses(); // Fetch statuses when the order items change
    }
  }, [order]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border-b px-4 py-2 text-left">Product</th>
              <th className="border-b px-4 py-2 text-left">MRP</th>
              <th className="border-b px-4 py-2 text-left">Offer Price</th>
              <th className="border-b px-4 py-2 text-left">QTY</th>
              <th className="border-b px-4 py-2 text-left">Total</th>
              <th className="border-b px-4 py-2 text-left">Status</th>
              <th className="border-b px-4 py-2 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {details.order_items && details.order_items.map((item, index) => {
              const status = item.status || "Loading...";
              const cancellable = status != 'delivered' && status != 'returned' && status != 'cancelled';
              return (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="border-b px-4 py-2">{item.product?.name}</td>
                  <td className="border-b px-4 py-2">{item.product?.price}</td>
                  <td className="border-b px-4 py-2">{item.product?.offer_price}</td>
                  <td className="border-b px-4 py-2">{item.quantity}</td>
                  <td className="border-b px-4 py-2">{item.price}</td>
                  <td className="border-b px-4 py-2">{status}</td>
                  <td className="border-b px-4 py-2">{cancellable ? <button onClick={() => cancelOrderItem(item.id)}>Cancel</button> : null}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
