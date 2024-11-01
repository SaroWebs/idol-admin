import React, { useEffect, useState } from 'react';
import { Button, Modal, Select, Loader, Notification } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import axios from 'axios';

const AssignOrder = (props) => {
    const { trip, reload } = props;
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [opened, { open, close }] = useDisclosure(false);

    const getOrders = () => {
        setLoading(true);
        axios.get('/orders/processed/get')
            .then(res => {
                setOrders(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.log(err.message);
                setLoading(false);
            });
    };

    useEffect(() => {
        getOrders();
    }, []);

    const addItem = () => {
        if (!selectedOrder) {
            return; // Optionally show a notification that no order is selected
        }

        setLoading(true);
        const fd = new FormData();
        fd.append('trip_id', trip.id);
        fd.append('order_id', selectedOrder.id);
        fd.append('status', 'out_of_delivery');
        fd.append('receivable_amount', selectedOrder.payment_mode === 'cash' ? selectedOrder.payable_amount : 0);

        axios.post('/trip/assign-order', fd)
            .then(res => {
                console.log(res.data);
                reload(); // Reload the parent component data
                close();
                // Optionally show a success notification
            })
            .catch(err => {
                console.log(err.message);
                // Optionally show an error notification
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <Button onClick={open}>Assign Order</Button>
            <Modal
                opened={opened}
                onClose={close}
                title="Assign Order"
            >
                {loading ? (
                    <Loader />
                ) : (
                    <>
                        <Select
                            label="Select Order"
                            placeholder="Select an order"
                            onChange={(value) => setSelectedOrder(value)}
                            data={orders.map(order => ({
                                value: order.id,
                                label: `${order.order_no} - ${order.customer_name}`, // Customize the label as needed
                            }))}
                        />
                        <Button onClick={addItem} disabled={!selectedOrder || loading}>
                            Assign
                        </Button>
                    </>
                )}
            </Modal>
        </>
    );
}

export default AssignOrder;