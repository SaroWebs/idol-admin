import BreadcrumbsComponent from '@/Components/BreadcrumbComponent'
import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import axios from 'axios'
import { MantineReactTable } from 'mantine-react-table'
import 'mantine-react-table/styles.css';

import React, { useEffect, useState } from 'react'

const Categories = (props) => {

	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(false);

	const getCategories = () => {
		setIsLoading(true);
		axios.get(`/data/categories`)
			.then(res => {
				setCategories(res.data);
			})
			.catch(err => {
				console.log(err.message);
			})
			.finally(() => {
				setIsLoading(false);
				console.log("Request completed");
			});
	};

	useEffect(() => {
		getCategories();
	}, []);

	// Function to handle edit action
	const handleEdit = (id) => {
		console.log(`Editing category with ID: ${id}`);
	};

	// Function to handle delete action
	const handleDelete = (id) => {
		if (window.confirm('Are you sure you want to delete this category?')) {
			axios.delete(`/data/categories/${id}`)
				.then(res => {
					console.log(`Category ${id} deleted`);
					getCategories();
				})
				.catch(err => {
					console.error('Error deleting category:', err.message);
				});
		}
	};

	const normalizeData = () => {
		if (!categories) return [];
		return categories.map((category) => ({
			...category,
			icon: category.icon_path ? <img src={`/storage/${category.icon_path}`} alt={category.name} width="40" height="40" /> : <img src={`/assets/images/no-image.png`} alt={category.name} width="40" height="40" />,
			image: category.image_path ? <img src={`/storage/${category.image_path}`} alt={category.name} width="60" height="60" /> : <img src={`/assets/images/no-image.png`} alt={category.name} width="40" height="40" />,
			status: category.status == 1 ? 'Active' : 'Inactive',
			actions: (
				<div>
					<button
						className="text-blue-500 hover:underline mr-2"
						onClick={() => handleEdit(category.id)}
					>
						Edit
					</button>
					<button
						className="text-red-500 hover:underline"
						onClick={() => handleDelete(category.id)}
					>
						Delete
					</button>
				</div>
			)
		}));
	};

	const columns = [
		{ accessorKey: 'icon', header: 'Icon' },
		{ accessorKey: 'image', header: 'Image' },
		{ accessorKey: 'name', header: 'Name' },
		{ accessorKey: 'status', header: 'Status' },
		{ accessorKey: 'actions', header: 'Actions' },
	];

	return (
		<MasterLayout {...props}>
			<Head title="Categories" />

			<div className="p-6">
				<BreadcrumbsComponent
					items={[
						{ title: 'Home', href: '/' },
						{ title: 'Categories', href: '#' },
					]}
				/>
				<h1 className="text-2xl font-bold my-4">Categories</h1>
				<div className="content p-4 border rounded-md shadow-sm">
					{categories && (
						<MantineReactTable
							columns={columns}
							data={normalizeData()}
						/>
					)}
				</div>
			</div>
		</MasterLayout>
	)
}

export default Categories;
