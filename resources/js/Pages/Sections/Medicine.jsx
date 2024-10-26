import BreadcrumbsComponent from '@/Components/BreadcrumbComponent'
import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

const Medicine = (props) => {

  const elements = [
    { id: 1, name: "hgfhf", offer_price: "10", MRP: '200', email: 'abc@gmail.cim', Stock: "cash", Availability: "Available" },
    { id: 2, name: "hhhhhhh", offer_price: "20", MRP: '300', email: 'abc@gmail.cim', Stock: "cash", Availability: "unavailable" },
    { id: 3, name: "hhhhhhh", offer_price: "30", MRP: '400', email: 'abc@gmail.cim', Stock: "cash", Availability: "unavailable" },
    { id: 4, name: "hhhhhhh", offer_price: "40", MRP: '500', email: 'abc@gmail.cim', Stock: "cash", Availability: "unavailable" },
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

export default Medicine