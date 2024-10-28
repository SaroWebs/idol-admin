import BreadcrumbsComponent from '@/Components/BreadcrumbComponent'
import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import { Table } from '@mantine/core'
import { EyeIcon, PencilIcon } from 'lucide-react'
import React from 'react'

const Trips = (props) => {
	const elements = [
		{ id: 1, customer_name: "hgfhf", customer_address: "pune", phone: '243254', email: 'abc@gmail.cim', payment_mode: "cash", order_no: "ORD2452345" },
		{ id: 2, customer_name: "hhhhhhh", customer_address: "Delhi", phone: '09808', email: 'abc@gmail.cim', payment_mode: "cash", order_no: 'ORD080988' },
		{ id: 3, customer_name: "hhhhhhh", customer_address: "kolkata", phone: '09808', email: 'abc@gmail.cim', payment_mode: "cash", order_no: '' },
		{ id: 4, customer_name: "hhhhhhh", customer_address: "pune", phone: '09808', email: 'abc@gmail.cim', payment_mode: "cash", order_no: '' },
	];

	const rows = elements.map((element) => (
		<Table.Tr key={element.id}>
			<Table.Td>{element.order_no}</Table.Td>

			<Table.Td>{element.name}</Table.Td>
			<Table.Td>{element.price}</Table.Td>
			<Table.Td>{element.MRP}</Table.Td>
			<Table.Td>{element.email}</Table.Td>
			<Table.Td>{element.Stock}</Table.Td>
			<Table.Td>{element.Availability}</Table.Td>
			<Table.Td>
				<div className="flex gap-2">
					<ActionIcon variant="filled" color='cyan' aria-label="View">
						<EyeIcon className='w-4' />
					</ActionIcon>
					<ActionIcon variant="filled" color='gray' aria-label="Edit">
						<PencilIcon className='w-4' />
					</ActionIcon>
				</div>
			</Table.Td>
		</Table.Tr>
	));

	return (
		<MasterLayout {...props}>
			<Head title="Trips" />

			<div className="p-6">
				<BreadcrumbsComponent
					items={[
						{ title: 'Home', href: '/' },
						{ title: 'Trips', href: '#' },
					]}
				/>
				<div className="mt-8">
					<div className="flex justify-between items-center">
						<h1 className="text-3xl font-bold">List of Medicines</h1>
						<p><Button>Create Medicine</Button></p>
					</div>

					<hr className='my-6' />
					<div className="content">
						<Table>
							<Table.Thead>
								<Table.Tr>

									<Table.Th>Actions</Table.Th>
									<Table.Th>Product ID</Table.Th>
									<Table.Th>Offer price</Table.Th>
									<Table.Th>Name</Table.Th>
									<Table.Th>Email</Table.Th>
									<Table.Th>MRP</Table.Th>
									<Table.Th>Stock</Table.Th>
									<Table.Th>Availability</Table.Th>
								</Table.Tr>
							</Table.Thead>
							<Table.Tbody>{rows}</Table.Tbody>
						</Table>
					</div>
				</div>
			</div>
		</MasterLayout>
	)
}

export default Trips