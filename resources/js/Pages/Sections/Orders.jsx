import BreadcrumbsComponent from '@/Components/BreadcrumbComponent';
import MasterLayout from '@/Layouts/MasterLayout';
import { Head } from '@inertiajs/react';
import { Loader, Text, Badge, ActionIcon, Button, Tabs, Table, Modal } from '@mantine/core'; // Import Loader and Badge
import { useDisclosure } from '@mantine/hooks';
import { EyeIcon, PencilIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const Orders = (props) => {
	const [ordersData, setOrderData] = useState({
		new: {},
		processed: {},
		completed: {},
		incomplete: {}
	});
	const [orderCounts, setOrderCount]=useState({
		new:0,
		processed: 0,
		completed: 0,
		incomplete: 0
	})
	const [activeStep, setActiveStep] = useState('new');
	const [loading, setLoading] = useState(false); // Loading state for data fetching

	const getData = () => {
		setLoading(true); // Start loading
		axios.get(`data/orders?status=${activeStep || 'new'}`)
			.then(res => {
				setOrderData({
					...ordersData,
					[activeStep]: res.data.orders
				});
				setOrderCount(res.data.counts)
			})
			.finally(() => setLoading(false)); // Stop loading after fetching data
	}

	useEffect(() => {
		getData();
	}, [activeStep]);


	// Reusable table component
	const OrdersTable = ({ data }) => {
		if (!data || data.length === 0) {
			return <Text>No orders found for this status.</Text>; // Empty state message
		}

		return (
			<Table>
				<Table.Thead>
					<Table.Tr>
						<Table.Th>Order No</Table.Th>
						<Table.Th>Customer Name</Table.Th>
						<Table.Th>Customer Address</Table.Th>
						<Table.Th>Email</Table.Th>
						<Table.Th>Phone No</Table.Th>
						<Table.Th>Payment Mode</Table.Th>
						<Table.Th>Actions</Table.Th>
					</Table.Tr>
				</Table.Thead>
				<Table.Tbody>
					{data.map(element => (
						<Table.Tr key={element.id}>
							<Table.Td>{element.order_no}</Table.Td>
							<Table.Td>{element.customer?.name}</Table.Td>
							<Table.Td>
								{[
									element.customer_address?.address_line_1,
									element.customer_address?.address_line_2,
									element.customer_address?.city,
									element.customer_address?.state,
									element.customer_address?.pin ? `(${element.customer_address.pin})` : ''
								].filter(Boolean).join(', ')}
							</Table.Td>

							<Table.Td>{element.customer?.email}</Table.Td>
							<Table.Td>{element.customer?.phone}</Table.Td>
							<Table.Td>
								<span className="capitalize">
									{element.payment_mode}
								</span>
							</Table.Td>
							<Table.Td>
								<div className="flex gap-2">
									<ViewOrder order={element} reload={getData} />

								</div>
							</Table.Td>
						</Table.Tr>
					))}
				</Table.Tbody>
			</Table>
		);
	};

	return (
		<MasterLayout {...props}>
			<Head title="Orders" />

			<div className="p-6">
				<BreadcrumbsComponent
					items={[
						{ title: 'Home', href: '/' },
						{ title: 'Orders', href: '#' },
					]}
				/>
				<div className="mt-8">
					<div className="flex justify-between items-center">
						<h1 className="text-3xl font-bold">List of Orders</h1>
						<p><Button>Create Order</Button></p>
					</div>

					<hr className="my-6" />

					<div className="w-full">
						<Tabs value={activeStep} onChange={setActiveStep}>
							<Tabs.List>
								<Tabs.Tab value="new">
									New Orders {orderCounts.new > 0 && <Badge>{orderCounts.new}</Badge>}
								</Tabs.Tab>
								<Tabs.Tab value="processed">
									Processed Orders {orderCounts.processed > 0 && <Badge>{orderCounts.processed}</Badge>}
								</Tabs.Tab>
								<Tabs.Tab value="completed">
									Completed Orders {orderCounts.completed > 0 && <Badge>{orderCounts.completed}</Badge>}
								</Tabs.Tab>
								<Tabs.Tab value="incomplete">
									Incomplete/Failed/Returned {orderCounts.incomplete > 0 && <Badge>{orderCounts.incomplete}</Badge>}
								</Tabs.Tab>
							</Tabs.List>

							{/* Loading state */}
							{loading ? (
								<div className="flex justify-center items-center my-6">
									<Loader size="lg" /> {/* Show loader while fetching */}
								</div>
							) : (
								// Render the correct tab content
								<>
									<Tabs.Panel value="new">
										<OrdersTable data={ordersData?.new?.data} />
									</Tabs.Panel>
									<Tabs.Panel value="processed">
										<OrdersTable data={ordersData?.processed?.data} />
									</Tabs.Panel>
									<Tabs.Panel value="completed">
										<OrdersTable data={ordersData?.completed?.data} />
									</Tabs.Panel>
									<Tabs.Panel value="incomplete">
										<OrdersTable data={ordersData?.incomplete?.data} />
									</Tabs.Panel>
								</>
							)}
						</Tabs>
					</div>
				</div>
			</div>
		</MasterLayout>
	);
};

export default Orders;

const ViewOrder = ({ order, reload }) => {
	const [opened, { open, close }] = useDisclosure(false);
	const [loading, setLoading] = useState(null); // Track which action is loading

	const handleAction = (action) => {
		setLoading(action);
		axios.post(`/order/${order.id}/${action}`)
			.then(res => {
				console.log(res.data);
				reload();
				close();
			})
			.catch(err => {
				console.log(err);
			})
			.finally(() => setLoading(null));
	};

	const approveOrder = () => handleAction('approve');
	const cancelOrder = () => {
		let confirmed = window.confirm('Are you sure?');
		if (confirmed) handleAction('cancel');
	};
	const processOrder = () => handleAction('process');
	const assignTrip = () => handleAction('assignTrip');
	const generateInvoice = () => handleAction('generateInvoice');

	return (
		<>
			<ActionIcon variant="filled" color="cyan" aria-label="View" onClick={open}>
				<EyeIcon className="w-4" />
			</ActionIcon>
			<Modal opened={opened} onClose={close} size="70%">
				<div>
					<div className="grid grid-cols-3 gap-2 text-md my-4">
						<div className="customer">
							<h2><b>Name: </b>{order.customer?.name}</h2>
							<h2><b>Phone: </b>{order.customer?.phone}</h2>
							<h2><b>Email: </b>{order.customer?.email}</h2>
							<h2><b>Status: </b><span className="uppercase text-green-700">{order.status}</span></h2>
						</div>
						<div className="address">
							<p><b>Shipping Address: </b>
								{[
									order.customer_address?.address_line_1,
									order.customer_address?.address_line_2,
									order.customer_address?.city,
									order.customer_address?.state,
									order.customer_address?.pin ? `(${order.customer_address.pin})` : ''
								].filter(Boolean).join(', ')}
							</p>
						</div>
						<div className="order">
							<h3><b>Order Number:</b> {order.order_no}</h3>
							<h4><b>Total Amount:</b> {order.payable_amount}</h4>
						</div>
					</div>
					<div className="flex justify-end gap-2 my-4">
						{(order.status === 'pending' || order.status === 'placed') && (
							<>
								<Button onClick={approveOrder} color="teal" loading={loading === 'approve'}>Approve Order</Button>
								<Button onClick={cancelOrder} color="red" loading={loading === 'cancel'}>Cancel Order</Button>
							</>
						)}
						{order.status === 'approved' && (
							<>
								<Button onClick={processOrder} color="blue" loading={loading === 'process'}>Process Order</Button>
								<Button onClick={cancelOrder} color="red" loading={loading === 'cancel'}>Cancel Order</Button>
							</>
						)}
						{order.status === 'processed' && (
							<>
								<Button onClick={assignTrip} color="purple" loading={loading === 'assignTrip'}>Assign Trip</Button>
								<Button onClick={generateInvoice} color="orange" loading={loading === 'generateInvoice'}>Generate Invoice</Button>
							</>
						)}
						{order.status === 'onway' && (
							<Button color="orange">Invoice</Button>
						)}
					</div>
					<div className="border p-2 my-4">
						<Table>
							<Table.Thead>
								<Table.Tr>
									<Table.Th>Product Name</Table.Th>
									<Table.Th>Price</Table.Th>
									<Table.Th>Quantity</Table.Th>
									<Table.Th>Total Amount</Table.Th>
									<Table.Th>Status</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>
								{order.order_items.map((item, index) => (
									<Table.Tr key={index}>
										<Table.Td>{item.product?.name}</Table.Td>
										<Table.Td>{item.product?.offer_price}</Table.Td>
										<Table.Td>{item.quantity}</Table.Td>
										<Table.Td>{item.price}</Table.Td>
										<Table.Td>
											<span className="capitalize">
												{item.statuses?.find(status => status.active === 1)?.status}
											</span>
										</Table.Td>
									</Table.Tr>
								))}
							</Table.Tbody>
						</Table>
					</div>
				</div>
			</Modal>
		</>
	);
};

