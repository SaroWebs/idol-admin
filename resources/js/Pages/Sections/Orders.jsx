import BreadcrumbsComponent from '@/Components/BreadcrumbComponent'
import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

const Orders = (props) => {
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
        <h1 className="text-2xl font-bold my-4">Orders</h1>
        <div className="content p-4 border rounded-md shadow-sm">
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, sint voluptate et vel amet laboriosam ipsa non numquam repellat ullam labore facilis perspiciatis qui possimus odit cumque magnam autem voluptatem?
            Quidem corporis provident vitae nulla, praesentium rem neque laborum suscipit, iusto sapiente similique maiores reprehenderit ullam iure minima deleniti doloremque error aspernatur facere. Ullam culpa non soluta nihil natus fugit.
            Laborum autem quibusdam nulla nobis in officia porro enim quas. Est possimus veniam accusantium numquam odio sapiente necessitatibus, facere vero minima doloremque voluptas, earum praesentium neque totam quis repudiandae? Quo!
            At quo repellat enim possimus debitis est pariatur eos, explicabo aspernatur similique sapiente, natus nesciunt provident incidunt quis voluptatum temporibus beatae rerum consequatur quasi cum unde accusamus. Enim, assumenda excepturi?
            Suscipit voluptatibus unde perspiciatis, nostrum illum ipsa quisquam eius modi nam excepturi inventore atque temporibus. Rerum dolorum voluptatem delectus quo at? Minima accusantium debitis fugit cum, vel soluta quos iusto.
          </p>
        </div>
      </div>
    </MasterLayout>
  )
}

export default Orders