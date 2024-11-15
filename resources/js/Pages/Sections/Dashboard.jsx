import { Head } from '@inertiajs/react';
import MasterLayout from '@/Layouts/MasterLayout'
import BreadcrumbsComponent from '@/Components/BreadcrumbComponent';

export default function Dashboard(props) {

    const {total_customers, total_orders, total_medicines, total_trips}=props;

    return (
        <MasterLayout {...props}>
            <Head title="Dashboard" />

            <div className="px-6 py-4">
                <BreadcrumbsComponent
                    items={[
                        { title: 'Home', href: '/' },
                        { title: 'Dashboard', href: '#' },
                    ]}
                />

                <h1 className="text-2xl font-bold my-4">Admin Dashboard</h1>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-blue-500 text-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">Total Customers</h3>
                        <p className="text-3xl mt-2">{total_customers}</p>
                    </div>
                    <div className="bg-green-500 text-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">Total Orders</h3>
                        <p className="text-3xl mt-2">{total_orders}</p>
                    </div>
                    <div className="bg-orange-500 text-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">Total Medicine</h3>
                        <p className="text-3xl mt-2">{total_medicines}</p>
                    </div>
                    <div className="bg-purple-500 text-white p-4 rounded-lg shadow-md">
                        <h3 className="text-lg font-semibold">Total Trips</h3>
                        <p className="text-3xl mt-2">{total_trips}</p>
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
