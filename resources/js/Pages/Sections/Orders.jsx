import BreadcrumbsComponent from '@/Components/BreadcrumbComponent'
import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import { ActionIcon, Button, Table } from '@mantine/core'
import { CircleIcon, EyeIcon, PencilIcon, TrashIcon } from 'lucide-react'
import React from 'react'

const Orders = (props) => {

  const elements = [
    { id: 1, customer_name: "hgfhf", customer_address: "pune", phone: '243254', email: 'abc@gmail.cim', payment_mode: "cash", order_no: "ORD2452345" },
    { id: 2, customer_name: "hhhhhhh", customer_address: "Delhi", phone: '09808', email: 'abc@gmail.cim', payment_mode: "cash", order_no: 'ORD080988' },
    { id: 3, customer_name: "hhhhhhh", customer_address: "kolkata", phone: '09808', email: 'abc@gmail.cim', payment_mode: "cash", order_no: '' },
    { id: 4, customer_name: "hhhhhhh", customer_address: "pune", phone: '09808', email: 'abc@gmail.cim', payment_mode: "cash", order_no: '' },
  ];

  const rows = elements.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>{element.order_no}</Table.Td>

      <Table.Td>{element.customer_name}</Table.Td>
      <Table.Td>{element.customer_address}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>{element.phone}</Table.Td>
      <Table.Td>{element.payment_mode}</Table.Td>
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

          <hr className='my-6' />
          <div className="content">
            <Table>
              <Table.Thead>
                <Table.Tr>

                  <Table.Th>order No</Table.Th>
                  <Table.Th>customer Name</Table.Th>
                  <Table.Th>customer Address</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>ph no</Table.Th>
                  <Table.Th>payment mode</Table.Th>
                  <Table.Th>Actions</Table.Th>
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

export default Orders