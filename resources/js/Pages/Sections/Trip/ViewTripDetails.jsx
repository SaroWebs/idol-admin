import React from 'react';
import { ActionIcon, Modal, Text, Divider } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import AssignOrder from './AssignOrder'; // Make sure to import your AssignOrder component
import {EyeIcon} from 'lucide-react'

const ViewTripDetails = (props) => {
    const { trip } = props;
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <ActionIcon onClick={open} variant="filled" color='cyan' aria-label="View">
                <EyeIcon className='w-4' />
            </ActionIcon>
            <Modal
                opened={opened}
                onClose={close}
                size={'xl'}
                title={<Text size="lg" weight={500}>Trip Details</Text>}
            >
                <div className="flex flex-col">
                    <div className="mb-4">
                        <Text size="md"><strong>Trip Date:</strong> {trip.trip_date}</Text>
                        <Text size="md"><strong>Driver:</strong> {trip.user?.name || 'N/A'}</Text>
                        <Text size="md"><strong>Total Collection:</strong> ${trip.total_collection}</Text>
                        <Text size="md"><strong>Total Orders:</strong> {trip.total_orders}</Text>
                        <Text size="md"><strong>Instructions:</strong> {trip.instructions || 'None'}</Text>
                    </div>
                    <Divider my="sm" />
                    <div className="flex justify-between mb-4">
                        <h2 className="text-3xl font-bold">Orders</h2>
                        <AssignOrder trip={trip} />
                    </div>
                    <div>
                        {trip.trip_items && trip.trip_items.length > 0 ? (
                            trip.trip_items.map((item) => (
                                <div key={item.id} className="p-2 border-b border-gray-300">
                                    <Text size="md"><strong>Order ID:</strong> {item.order_id}</Text>
                                    <Text size="md"><strong>Status:</strong> {item.status}</Text>
                                    <Text size="md"><strong>Receivable Amount:</strong> ${item.receivable_amount}</Text>
                                </div>
                            ))
                        ) : (
                            <Text size="md" color="gray">No Orders Assigned</Text>
                        )}
                    </div>
                </div>
            </Modal>
        </>
    );
}

export default ViewTripDetails;