import BreadcrumbsComponent from '@/Components/BreadcrumbComponent'
import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import { Button, Table, TextInput, Select, Pagination, Modal } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import React, { useState, useEffect } from 'react'

const Customers = (props) => {

	const [customerData, setCustomerData] = useState(null)
	const [isLoading, setIsLoading] = useState(false);
	const [pageProps, setPageProps] = useState({
		page: 1,
		per_page: 20,
		sort_by: 'name',
		order: 'asc',
		search: ''
	})

	const getData = () => {
		setIsLoading(true);
		axios.get('data/customers', { params: pageProps })
			.then(res => {
				setCustomerData(res.data);
			}).catch(error => {
				console.log(error.message);
			}).finally(() => {
				setIsLoading(false);
			});
	}

	useEffect(() => {
		getData();
	}, [pageProps]);

	const rows = customerData && customerData.data && customerData.data.map((element) => (
		<Table.Tr key={element.id}>
			<Table.Td>
				{element.image_url ? (
					<img className="max-w-[100px] h-auto object-cover" src={"/storage/" + element.image_url} alt={element.name} />
				) : (
					<img className="max-w-[100px] h-auto object-cover" src={"/assets/images/no-image.png"} alt={element.name} />
				)}
			</Table.Td>
			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.email}</Table.Td>
			<Table.Td>{element.phone}</Table.Td>
			<Table.Td>
				<div className="flex gap-2">
					<CustomerDetails customer={element} />
				</div>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<MasterLayout {...props}>
			<Head title="Customers" />

			<div className="p-6">
				<BreadcrumbsComponent
					items={[
						{ title: 'Dashboard', href: '/dashboard' },
						{ title: 'Customers', href: '#' },
						{ title: 'Regular Customers', href: '#' },
					]}
				/>
				<div className="mt-8">
					<div className="flex justify-between items-center">
						<h1 className="text-3xl font-semibold text-gray-800">Customers</h1>
					</div>

					<hr className="my-6" />
					<div className="flex justify-between items-center mb-4">
						<Select
							data={[{ value: '10', label: '10' }, { value: '20', label: '20' }, { value: '50', label: '50' }]}
							value={String(pageProps.per_page)}
							onChange={(value) => setPageProps({ ...pageProps, per_page: value })}
							label="Per Page"
							className="w-32"
						/>
						<div className="flex items-center gap-4">
							<TextInput
								placeholder="Search Customers"
								value={pageProps.search}
								onChange={(e) => setPageProps({ ...pageProps, search: e.target.value, page: 1 })}
								className="max-w-sm"
							/>
						</div>


					</div>

					<Table striped highlightOnHover>
						<Table.Thead>
							<Table.Tr>
								<Table.Th>Image</Table.Th>
								<Table.Th>Name</Table.Th>
								<Table.Th>Email</Table.Th>
								<Table.Th>Phone No.</Table.Th>
								<Table.Th>Actions</Table.Th>
							</Table.Tr>
						</Table.Thead>
						<Table.Tbody>{rows}</Table.Tbody>
					</Table>
					<div className="flex justify-between items-center">
						<p className="text-sm text-gray-600">
							Showing {customerData?.from} to {customerData?.to} of {customerData?.total}
						</p>

						{/* Pagination */}
						<Pagination
							page={pageProps.page}
							onChange={(page) => setPageProps({ ...pageProps, page })}
							total={customerData?.last_page}
							className="flex justify-end w-full"
							size="sm"
							color="blue"
						/>
					</div>

				</div>
			</div>
		</MasterLayout>
	)
}

export default Customers

const CustomerDetails = ({ customer }) => {
	const [opened, { open, close }] = useDisclosure(false);
	console.log(customer);
	return (
		<>
			<Button onClick={open} variant="outline" color="blue">View</Button>
			<Modal opened={opened} size={'xl'} onClose={close}>
				<div className="flex flex-col gap-2">
					<div className="details p-4">
						<h3 className="text-2xl font-semibold">{customer.name}</h3>
						<h4 className="text-gray-700 italic font-semibold">{customer.email}</h4>
						<h4 className="text-gray-800 font-bold">{customer.phone}</h4>
					</div>
					<div className="addresses">
						<h3 className="text-xl font-semibold">Addresses</h3>
						{(customer.addresses && customer.addresses.length > 0) ? (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-2">
								{customer.addresses.map(address => (
									<div key={address.id} className="border shadow-md p-4 mb-2">
										<span className="px-2 py-1 rounded shadow bg-gray-700 text-white uppercase">{address.type}</span>
										<hr className="my-2" />
										<p>Address Line 1 : {address.address_line_1}</p>
										<p>Address Line 2 : {address.address_line_2}</p>
										<p>City : {address.city}</p>
										<p>State : {address.state}</p>
										<p>Pin Number : {address.pin}</p>
									</div>
								))}
							</div>
						) : (
							<div className="flex justify-center items-center min-h-16">
								<span>No Address !</span>
							</div>
						)}
					</div>
				</div>
			</Modal>
		</>
	);
}