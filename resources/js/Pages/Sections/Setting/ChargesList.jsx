import { Button, Group, NumberInput, Loader, Notification } from '@mantine/core';
import { useEffect, useState } from 'react';
import axios from 'axios';

const ChargesList = () => {
    const [dch, setDch] = useState({ per_km: 0, charge_upto: 0 });
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [notification, setNotification] = useState({ message: '', type: '' });

    // Fetch initial delivery charge
    const getCharge = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`/data/getdch`);
            setDch(res.data);
        } catch (err) {
            setNotification({ message: 'Failed to fetch delivery charges.', type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    // Handle update submission
    const handleSubmit = async () => {
        setUpdating(true);
        const fd = new FormData();
        fd.append('per_km', dch.per_km);
        fd.append('charge_upto', dch.charge_upto);

        try {
            const res = await axios.post(`/data/dch/update`, fd);
            setNotification({ message: res.data.message || 'Delivery charges updated successfully!', type: 'success' });
        } catch (err) {
            setNotification({ message: 'Failed to update delivery charges.', type: 'error' });
        } finally {
            setUpdating(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        getCharge();
    }, []);

    return (
        <div className="p-4">
            <h3 className="text-lg font-bold mb-4">Delivery Charge</h3>

            {loading ? (
                <Loader size="lg" variant="dots" />
            ) : (
                <div className="flex flex-col gap-4">
                    <NumberInput
                        label="Per KM Charge"
                        placeholder="Enter per KM charge"
                        value={dch.per_km}
                        onChange={(value) => setDch({ ...dch, per_km: value })}
                        min={0}
                        step={0.1}
                        precision={2}
                    />

                    <NumberInput
                        label="Charge Upto"
                        placeholder="Enter maximum charge"
                        value={dch.charge_upto}
                        onChange={(value) => setDch({ ...dch, charge_upto: value })}
                        min={0}
                        step={0.1}
                        precision={2}
                    />

                    <Group position="right">
                        <Button
                            disabled={dch.per_km <= 0 || dch.charge_upto <= 0 || updating}
                            onClick={handleSubmit}
                            loading={updating}
                        >
                            Update
                        </Button>
                    </Group>
                </div>
            )}

            {/* Notification Section */}
            {notification.message && (
                <Notification
                    title={notification.type === 'success' ? 'Success' : 'Error'}
                    color={notification.type === 'success' ? 'green' : 'red'}
                    onClose={() => setNotification({ message: '', type: '' })}
                    className="mt-4"
                >
                    {notification.message}
                </Notification>
            )}
        </div>
    );
};

export default ChargesList;
