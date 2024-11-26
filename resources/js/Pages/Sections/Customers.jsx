import BreadcrumbsComponent from '@/Components/BreadcrumbComponent'
import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import { Button, Table, TextInput, Select, Pagination } from '@mantine/core'
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
		// with pageProps
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
					<Button variant="outline" color="blue">View</Button>
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
								onChange={(e) => setPageProps({ ...pageProps, search: e.target.value, page:1 })}
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
