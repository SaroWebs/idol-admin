import React, { useEffect, useState } from 'react';
import BreadcrumbsComponent from '@/Components/BreadcrumbComponent';
import MasterLayout from '@/Layouts/MasterLayout';
import { Head } from '@inertiajs/react';
import { Button, Table, Pagination, Group, TextInput } from '@mantine/core';
import axios from 'axios';
import AddTrip from './Trip/AddTrip';
import ViewTripDetails from './Trip/ViewTripDetails';

const Trips = (props) => {
	const [tripsData, setTripsData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [perPage, setPerPage] = useState(10);
	const [searchTerm, setSearchTerm] = useState('');

	const getData = async (page) => {
		if (!page) {
			page = currentPage;
		}
		try {
			const res = await axios.get('/data/trips', {
				params: {
					page,
					per_page: perPage,
					search: searchTerm
				}
			});
			setTripsData(res.data);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		getData(currentPage);
	}, [currentPage, perPage, searchTerm]);

	const handlePageChange = (page) => {
		setCurrentPage(page);
	};

	const handleSearch = () => {
		setCurrentPage(1);
		getData(1);
	};

	const rows = tripsData?.data.map((element) => (
		<Table.Tr key={element.id}>
			<Table.Td>{element.trip_date}</Table.Td>
			<Table.Td>{element.user?.name}</Table.Td>
			<Table.Td>{element.total_collection}</Table.Td>
			<Table.Td>{element.trip_items?.length}</Table.Td>
			<Table.Td>{element.instructions}</Table.Td>
			<Table.Td>
				<div className="flex gap-2">
					<ViewTripDetails trip={element} />
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
						<h1 className="text-3xl font-bold">List of Trips</h1>
						<div className="flex gap-2">
							<AddTrip drivers={props.drivers} />
						</div>
					</div>

					<hr className='my-6' />

					{loading ? (
						<p>Loading...</p>
					) : error ? (
						<p className="text-red-500">{error}</p>
					) : (
						<div className="content">
							{(tripsData && tripsData.data && tripsData.data.length) ? (
								<div className="">
									<div className="flex justify-end items-center">
										<Group style={{ gap: 0 }}>
											<TextInput
												placeholder="Search..."
												value={searchTerm}
												onChange={(e) => setSearchTerm(e.target.value)}
												onKeyPress={(e) => {
													if (e.key === 'Enter') {
														handleSearch();
													}
												}}
												className="border rounded mr-0"
												styles={{ input: { borderRadius: '4px 0 0 4px' } }} // Custom styles to round the left corners
											/>
											<Button onClick={handleSearch} className='ml-0' styles={{ root: { borderRadius: '0 4px 4px 0' } }}>
												Search
											</Button>
										</Group>
									</div>
									<Table>
										<Table.Thead>
											<Table.Tr>
												<Table.Th>Trip Date</Table.Th>
												<Table.Th>Driver</Table.Th>
												<Table.Th>Total Collection</Table.Th>
												<Table.Th>Total Orders</Table.Th>
												<Table.Th>Instructions</Table.Th>
												<Table.Th>Actions</Table.Th>
											</Table.Tr>
										</Table.Thead>
										<Table.Tbody>{rows}</Table.Tbody>
									</Table>
								</div>
							) : (
								<div className="flex justify-center">
									<span>No Trips Found</span>
								</div>
							)}
						</div>
					)}

					{tripsData && (
						<Pagination
							page={currentPage}
							onChange={handlePageChange}
							total={Math.ceil(tripsData.total / perPage)}
							className="mt-4"
						/>
					)}
				</div>
			</div>
		</MasterLayout>
	);
};

export default Trips;
