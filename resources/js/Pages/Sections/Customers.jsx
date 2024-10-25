import BreadcrumbsComponent from '@/Components/BreadcrumbComponent'
import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import { Button, Table } from '@mantine/core'
import { CircleIcon } from 'lucide-react'
import React from 'react'

const Customers = (props) => {

  const elements = [
    { id:1, name: "hgfhf", phone:'243254' ,email: 'abc@gmail.cim', image_url:'' },
    { id:2, name: "hhhhhhh", phone:'09808', email: 'abc@gmail.cim', image_url:'' },
    { id:3, name: "hhhhhhh", phone:'09808', email: 'abc@gmail.cim', image_url:'' },
    { id:4, name: "hhhhhhh", phone:'09808', email: 'abc@gmail.cim', image_url:'' },
  ];

  const rows = elements.map((element) => (
    <Table.Tr key={element.id}>
      <Table.Td>
        {element.image_url ? (
          <img className='max-w-[100px]' src={"/storage"+element.image_url} alt={element.name} />
        ):(
          <img className='max-w-[100px]' src={"/assets/images/no-image.png"} alt={element.name} />
        )}
      </Table.Td>
      <Table.Td>{element.name}</Table.Td>
      <Table.Td>{element.email}</Table.Td>
      <Table.Td>{element.phone}</Table.Td>
      <Table.Td>
        <div className="flex gap-2">
          <Button>Edit</Button>
          <Button>Remove</Button>
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
            <h1 className="text-3xl font-bold">List of Customers</h1>
            <p><Button>Add Customer</Button></p>
          </div>

          <hr className='my-6' />
          <div className="content">
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Image</Table.Th>
                  <Table.Th>Name</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>ph no</Table.Th>
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

export default Customers