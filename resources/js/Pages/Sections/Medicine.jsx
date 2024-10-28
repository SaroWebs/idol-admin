import React, { useEffect, useState } from 'react';
import BreadcrumbsComponent from '@/Components/BreadcrumbComponent';
import MasterLayout from '@/Layouts/MasterLayout';
import { Head } from '@inertiajs/react';
import { Button, Table, ActionIcon, Pagination } from '@mantine/core'; // Make sure to import Pagination from Mantine
import { EyeIcon, PencilIcon } from 'lucide-react';

const Medicine = (props) => {
  const [productsData, setProductsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10); // You can change this value as needed

  const getData = async (page) => {
    try {
      const res = await axios.get('data/products', {
        params: { page, per_page: perPage, sort: 'asc', sort_by: 'name' } // Adjust sorting as needed
      });
      setProductsData(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData(currentPage);
  }, [currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const rows = productsData?.data.map((element) => {
    const thumbnail = element.images?.[0]?.image_url; // Get the first image as thumbnail

    return (
      <Table.Tr key={element.id}>
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
        <Table.Td>
          {thumbnail && <img src={'storage/'+thumbnail} alt={element.name} className="w-16 h-16 object-cover" />} {/* Thumbnail image */}
        </Table.Td>
        <Table.Td>{element.id}</Table.Td>
        <Table.Td>{element.name}</Table.Td>
        <Table.Td>{element.code}</Table.Td>
        <Table.Td>{element.price}</Table.Td>
        <Table.Td>{element.discount}</Table.Td>
        <Table.Td>{element.offer_price}</Table.Td>
        <Table.Td>{element.mfg_name}</Table.Td>
        <Table.Td>{element.category?.name}</Table.Td>
        <Table.Td>{element.prescription ? 'Yes' : 'No'}</Table.Td> {/* Display prescription as Yes/No */}
        <Table.Td>{element.status ?'Available':'Unavailable'}</Table.Td>
        <Table.Td>{element.total_qty}</Table.Td>
      </Table.Tr>
    );
  });

  return (
    <MasterLayout {...props}>
      <Head title="Medicine" />

      <div className="p-6">
        <BreadcrumbsComponent
          items={[
            { title: 'Home', href: '/' },
            { title: 'Medicine', href: '#' },
          ]}
        />
        <div className="mt-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold">List of Medicines</h1>
            <Button>Create Medicine</Button>
          </div>

          <hr className='my-6' />

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="content">
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Actions</Table.Th>
                    <Table.Th>Thumbnail</Table.Th> {/* Add Thumbnail column */}
                    <Table.Th>Product ID</Table.Th>
                    <Table.Th>Name</Table.Th>
                    <Table.Th>Code</Table.Th>
                    <Table.Th>Price</Table.Th>
                    <Table.Th>Discount</Table.Th>
                    <Table.Th>Offer Price</Table.Th>
                    <Table.Th>Manufacturer</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Prescription Required</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Total Quantity</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>{rows}</Table.Tbody>
              </Table>
            </div>
          )}
          
          {/* Pagination Component */}
          {productsData && (
            <Pagination
              page={currentPage}
              onChange={handlePageChange}
              total={productsData.total} // Total number of products from the API response
              recordsPerPage={perPage} // The number of records per page
              className="mt-4"
            />
          )}
        </div>
      </div>
    </MasterLayout>
  );
};

export default Medicine;
