import React, { useEffect, useState } from 'react';
import BreadcrumbsComponent from '@/Components/BreadcrumbComponent';
import MasterLayout from '@/Layouts/MasterLayout';
import { Head } from '@inertiajs/react';
import { Button, Table, ActionIcon, Pagination, Group, TextInput, Select } from '@mantine/core';
import { EyeIcon, PencilIcon } from 'lucide-react';
import { useDisclosure } from '@mantine/hooks';
import AddMedicine from './AddMedicine';
import AddProductImage from './AddProductImage';
import EditMedicine from './EditMedicine';
import axios from 'axios';
import ImportMedicine from './ImportMedicine';
import ExportMedicine from './ExportMedicine';

const Medicine = (props) => {
  const [productsData, setProductsData] = useState(null);
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
      const res = await axios.get('data/products', {
        params: {
          page,
          per_page: perPage,
          sort: 'asc',
          sort_by: 'name',
          search: searchTerm
        }
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
  }, [currentPage, perPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const rows = productsData?.data.map((element) => {
    const thumbnail = element.images?.[0]?.image_path;

    return (
      <Table.Tr key={element.id}>
        <Table.Td>
          <div className="flex gap-2">
            <EditMedicine medicine={element} reload={getData} categories={props.categories} taxes={props.taxes} />
            <AddProductImage product={element} reload={getData} />
          </div>
        </Table.Td>
        <Table.Td>
          {thumbnail ?
            <img src={'storage/' + thumbnail} alt={element.name} className="w-16 h-16 object-cover" />
            :
            <img src={'/assets/images/no-image.png'} alt={'no image'} className="w-16 h-16 object-cover" />
          }
        </Table.Td>
        <Table.Td>{element.code}</Table.Td>
        <Table.Td>{element.name}</Table.Td>
        <Table.Td>{element.price}</Table.Td>
        <Table.Td>{element.discount}</Table.Td>
        <Table.Td>{element.offer_price}</Table.Td>
        <Table.Td>{element.mfg_name}</Table.Td>
        <Table.Td>{element.category?.name}</Table.Td>
        <Table.Td>{element.prescription ? 'Yes' : 'No'}</Table.Td>
        <Table.Td>{element.status ? 'Available' : 'Unavailable'}</Table.Td>
        <Table.Td>{element.total_qty}</Table.Td>
      </Table.Tr>
    );
  });

  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page on search
    getData(currentPage); // Trigger search
  };


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
            <div className="flex gap-2">
              <ImportMedicine/>
              <ExportMedicine/>
              <AddMedicine reload={getData} categories={props.categories} taxes={props.taxes} />
            </div>
          </div>

          <hr className='my-6' />

          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : (
            <div className="content">
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
                <Select
                  value={perPage.toString()}
                  onChange={(value) => {
                    setPerPage(Number(value));
                    setCurrentPage(1);
                  }}
                  data={[
                    { value: '10', label: '10' },
                    { value: '20', label: '20' },
                    { value: '30', label: '30' },
                    { value: '50', label: '50' },
                  ]}
                  className="border rounded ml-3"
                />
              </div>
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Actions</Table.Th>
                    <Table.Th>Thumbnail</Table.Th>
                    <Table.Th>Product Code</Table.Th>
                    <Table.Th>Name</Table.Th>
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

          {productsData && (
            <Pagination
              page={currentPage}
              onChange={handlePageChange}
              total={Math.ceil(productsData.total / perPage)}
              className="mt-4"
            />
          )}
        </div>
      </div>
    </MasterLayout>
  );
};

export default Medicine;