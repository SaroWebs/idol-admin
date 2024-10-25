import BreadcrumbsComponent from '@/Components/BreadcrumbComponent'
import AddCategory from '@/Components/Categories/AddCategory'
import EditCategory from '@/Components/Categories/EditCategory'
import RemoveCategory from '@/Components/Categories/RemoveCategory'
import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import { Button } from '@mantine/core'
import axios from 'axios'
import { MantineReactTable } from 'mantine-react-table'
import 'mantine-react-table/styles.css';

import React, { useEffect, useState } from 'react'

const Categories = (props) => {

	const [categories, setCategories] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [addFormOpen, setAddFormOpen] = useState(false);

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


	const normalizeData = () => {
		if (!categories) return [];
		return categories.map((category) => ({
			...category,
			icon: category.icon_path ? <img src={`/storage/${category.icon_path}`} alt={category.name} width="40" height="40" /> : <img src={`/assets/images/no-image.png`} alt={category.name} width="40" height="40" />,
			image: category.image_path ? <img src={`/storage/${category.image_path}`} alt={category.name} width="60" height="60" /> : <img src={`/assets/images/no-image.png`} alt={category.name} width="40" height="40" />,
			status: category.status == 1 ? 'Active' : 'Inactive',
			actions: (
				<div>
					<EditCategory category={category} reload={getCategories} />
					<RemoveCategory category={category} reload={getCategories} />
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
				{addFormOpen ? <AddCategory /> :
					<div className="content">
						<div className="headings flex justify-between">
							<h1 className="text-2xl font-bold my-4">Categories</h1>
							<div className="actions flex gap-1">
								<Button onClick={() => setAddFormOpen(true)}>New Category</Button>
							</div>
						</div>
						{categories && (
							<MantineReactTable
								columns={columns}
								data={normalizeData()}
							/>
						)}
					</div>
				}
			</div>
		</MasterLayout>
	)
}

export default Categories;
