import { Button, Modal, Loader, Table, Text, Alert, Stack, Group } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import '@mantine/dates/styles.css';

dayjs.extend(utc);
dayjs.extend(timezone);

const AssignTrip = ({ order, reload }) => {
	const [opened, { open, close }] = useDisclosure(false);
	const [trips, setTrips] = useState([]);
	const [loading, setLoading] = useState(null);
	const [error, setError] = useState(null);
	const [selectedDate, setSelectedDate] = useState(null);

	// Fetch trips
	const getTrips = (date = null) => {
		setLoading('fetching');
		setError(null);
		// Construct URL with normalized date in IST
		const url = date ? `data/trips/all?date=${encodeURIComponent(date)}` : 'data/trips/all';

		axios
			.get(url)
			.then((res) => {
				setTrips(res.data);
			})
			.catch((err) => {
				setError(err.message);
			})
			.finally(() => {
				setLoading(null);
			});
	};

	// Fetch trips when modal opens
	useEffect(() => {
		if (opened) {
			getTrips();
		}
	}, [opened]);

	// Handle date changes
	const handleDateChange = (date) => {
		setSelectedDate(date);

		// Normalize date to IST and format as 'YYYY-MM-DD'
		const normalizedDate = dayjs(date).tz('Asia/Kolkata').format('YYYY-MM-DD');
		getTrips(normalizedDate);
	};

	// Render trips
	const renderTrips = () => {
		if (loading) {
			return <Loader />;
		}

		if (error) {
			return (
				<Alert color="red">
					{error}
				</Alert>
			);
		}

		if (trips.length === 0) {
			return <Text>No trips found for the selected date.</Text>;
		}

		return (
			<Table highlightOnHover>
				<thead>
					<tr>
						<th>Trip ID</th>
						<th>Driver</th>
						<th>Date</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{trips.map((trip) => {
						const tripDate = new Date(trip.trip_date);
						const today = new Date();
						today.setHours(0, 0, 0, 0);
						const yesterday = new Date(today);
						yesterday.setDate(today.getDate() - 1);

						return (
							<tr key={trip.id}>
								<td className='text-center'>{trip.id}</td>
								<td className='text-center'>{trip.user?.name || 'N/A'}</td>
								<td className='text-center'>{trip.trip_date}</td>
								<td className='text-center'>
									<Button
										size="xs"
										color="blue"
										disabled={tripDate < yesterday}
										onClick={() => assignTrip(order.id, trip.id)}
									>
										Assign
									</Button>
								</td>
							</tr>
						);
					})}
				</tbody>
			</Table>
		);
	};

	const assignTrip = async (orderId, tripId) => {
		const fd = new FormData();
		fd.append('trip_id', tripId);
		fd.append('order_id', orderId);
		fd.append('status', 'out_of_delivery');
		fd.append('receivable_amount', order.payment_mode === 'cash' ? order.payable_amount : 0);

		try {
			const res = await axios.post('/trip/assign-order', fd);
			console.log("Order assigned successfully:", res.data);
			close();
			reload();
		} catch (err) {
			console.error("Error assigning order:", err.message);
		}
	};

	return (
		<>
			<Button onClick={open} color="blue">Assign Trip</Button>
			<Modal opened={opened} onClose={close} title="Assign Trip" size="lg">
				<Stack spacing="md">
					<Group position="apart" align="end">
						<DatePickerInput
							label="Filter by Date"
							placeholder="Select a date"
							value={selectedDate}
							onChange={handleDateChange}
							clearable
						/>
						<Button onClick={() => getTrips()} variant="outline">
							Reset Filter
						</Button>
					</Group>
					{renderTrips()}
				</Stack>
			</Modal>
		</>
	);
};

export default AssignTrip;
