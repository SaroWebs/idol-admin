import BreadcrumbsComponent from '@/Components/BreadcrumbComponent'
import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import { Tabs } from '@mantine/core'
import React from 'react'
import Banner from './Setting/HomePage/Banner'
import PincodeList from './Setting/PincodeList'
import RoleManagement from './Setting/RoleManagement'
import TaxList from './Setting/TaxList'
import UserManagement from './Setting/UserManagement'

const Settings = (props) => {
    return (
        <MasterLayout {...props}>
            <Head title="Settings" />

            <div className="p-6">
                <BreadcrumbsComponent
                    items={[
                        { title: 'Home', href: '/' },
                        { title: 'Account', href: '/profile' },
                        { title: 'Settings', href: '#' },
                    ]}
                />
                <h1 className="text-2xl font-bold my-4">Settings</h1>
                <div className="content p-4 border rounded-md shadow-sm">
                    <Tabs defaultValue="home">
                        <Tabs.List>
                            <Tabs.Tab value="home">Home Page</Tabs.Tab>
                            <Tabs.Tab value="user-management">User  Management</Tabs.Tab>
                            <Tabs.Tab value="role-management">Role Management</Tabs.Tab>
                            <Tabs.Tab value="delivery-locations">Delivery Locations</Tabs.Tab>
                            <Tabs.Tab value="tax-information">Tax Information</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="home">
                            <h2>Home Page Settings</h2>
                            {/* Add content for Home Page Settings */}
                            <Banner/>
                        </Tabs.Panel>

                        <Tabs.Panel value="user-management">
                            <h2>User Management Settings</h2>
                            {/* Add content for User Management Settings */}
                            <UserManagement/>
                        </Tabs.Panel>

                        <Tabs.Panel value="role-management">
                            <h2>Role Management Settings</h2>
                            {/* Add content for Role Management Settings */}
                            <RoleManagement/>
                        </Tabs.Panel>

                        <Tabs.Panel value="delivery-locations">
                            <h2>Delivery Locations Settings</h2>
                            <PincodeList/>
                        </Tabs.Panel>

                        <Tabs.Panel value="tax-information">
                            <h2>Tax Information Settings</h2>
                            <TaxList/>
                        </Tabs.Panel>
                    </Tabs>
                </div>
            </div>
        </MasterLayout>
    )
}

export default Settings