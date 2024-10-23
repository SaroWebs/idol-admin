import { Head } from '@inertiajs/react';
import MasterLayout from '@/Layouts/MasterLayout'
import { Anchor, Breadcrumbs } from '@mantine/core';

export default function Dashboard(props) {


    // breadcrumb
    const items = [
        { title: 'Home', href: '/' },
        { title: 'Dashboard', href: '#' },
    ].map((item, index) => (
        <Anchor
            href={item.href === '#' ? undefined : item.href}
            key={index}
            style={{
                color: item.href === '#' ? '#9ca3af' : 'inherit',
                pointerEvents: item.href === '#' ? 'none' : 'auto',
                textDecoration: item.href === '#' ? 'none' : 'underline',
            }}
        >
            {item.title}
        </Anchor>
    ));

    return (
        <MasterLayout {...props}>
            <Head title="Dashboard" />

            <div className="px-6 py-4">
                <Breadcrumbs separator="•" mt="xs">
                    {items}
                </Breadcrumbs>

                <h1 className="text-2xl font-bold my-4">Admin Dashboard</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">Total Customers</h3>
                        <p className="text-3xl mt-2">150</p>
                    </div>
                    <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">Total Orders</h3>
                        <p className="text-3xl mt-2">320</p>
                    </div>
                    <div className="bg-orange-500 text-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">Total Medicine</h3>
                        <p className="text-3xl mt-2">75</p>
                    </div>
                    <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">Total Trips</h3>
                        <p className="text-3xl mt-2">45</p>
                    </div>
                </div>

                <hr className="my-6" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg shadow-md cursor-pointer">
                        <h3 className="text-lg font-semibold">Create Invoice</h3>
                        <p className="text-sm mt-1 text-gray-600">Quickly generate a new invoice.</p>
                    </div>
                    <div className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg shadow-md cursor-pointer">
                        <h3 className="text-lg font-semibold">Add Trip</h3>
                        <p className="text-sm mt-1 text-gray-600">Schedule a new delivery trip.</p>
                    </div>
                    <div className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg shadow-md cursor-pointer">
                        <h3 className="text-lg font-semibold">Add User</h3>
                        <p className="text-sm mt-1 text-gray-600">Register a new user for the platform.</p>
                    </div>
                    <div className="bg-gray-200 hover:bg-gray-300 p-4 rounded-lg shadow-md cursor-pointer">
                        <h3 className="text-lg font-semibold">Add Medicine</h3>
                        <p className="text-sm mt-1 text-gray-600">Add a new medicine to the inventory.</p>
                    </div>
                </div>
            </div>
        </MasterLayout>

    );
}
