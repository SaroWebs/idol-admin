import React, { useEffect } from 'react';
import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';

const AssignOrder = (props) => {
    const { trip } = props;
    const [orders, setOrders] = useState([]);
    const [opened, { open, close }] = useDisclosure(false);

    const getOrders = () => {
        axios.get('/orders/processed/get')
            .then(res => {
                setOrders(res.data);
            })
            .catch(err => {
                console.log(err.message);
            });
    }
    useEffect(() => {
        getOrders()
    }, [])

    const addItem=()=>{
        // trip_id, order_id, status='out_of_delivery', receivable_amount=order.payable_amount if order.payment_mode == 'cash'
        axios.post('/trip/assignOrder',fd)
        .then(res=>{
            console.log(res.data);
        })
        .catch(err=>{
            console.log(err.message);
        })
    }
    return (
        <>
            <Button onClick={open}>Assign Order</Button>
            <Modal
                opened={opened}
                onClose={close}
            >
                {/* select order (order_id, order_no) */}
            </Modal>
        </>
    );
}

export default AssignOrder;