import React, { useEffect, useState } from 'react';
import { Button, Modal, Text, Group, Stack } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';

const AssignOrder = ({ trip }) => {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);

    // Fetch processed orders
    const getOrders = async () => {
        try {
            const res = await axios.get('/orders/processed/get');
            setOrders(res.data);
        } catch (err) {
            console.error("Error fetching orders:", err.message);
        }
    };

    useEffect(() => {
        getOrders();
    }, []);

    // Handle order assignment
    const addItem = async (order) => {
        const fd = new FormData();
        fd.append('trip_id', trip.id);
        fd.append('order_id', order.id);
        fd.append('status', 'out_of_delivery');
        fd.append('receivable_amount', order.payment_mode === 'cash' ? order.payable_amount : 0);

        try {
            const res = await axios.post('/trip/assign-order', fd);
            console.log("Order assigned successfully:", res.data);
            close(); // Close modal after successful assignment
        } catch (err) {
            console.error("Error assigning order:", err.message);
        }
    };

    return (
        <>
            <Button onClick={open}>Assign Orders</Button>
            <Modal opened={opened} onClose={close} title="Assign Orders">
                <Text>Select orders to assign:</Text>
                <Stack spacing="md" style={{ marginTop: '20px' }}>
                    {orders.map(order => (
                        <Group key={order.id} position="apart">
                            <Text>Order #{order.order_no}</Text>
                            <Button onClick={() => addItem(order)}>Assign</Button>
                        </Group>
                    ))}
                </Stack>
            </Modal>
        </>
    );
};

export default AssignOrder;