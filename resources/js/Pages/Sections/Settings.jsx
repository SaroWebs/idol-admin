import BreadcrumbsComponent from '@/Components/BreadcrumbComponent'
import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import { Stack, Tabs } from '@mantine/core'
import React from 'react'
import ChargesList from './Setting/ChargesList'
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
                            <Tabs.Tab value="delivery-locations">Delivery Locations</Tabs.Tab>
                            <Tabs.Tab value="tax-information">Charges Information</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="home">
                            <Stack gap={'sm'}>
                                <Banner/>
                            </Stack>
                        </Tabs.Panel>

                        <Tabs.Panel value="user-management">
                            <Stack gap={'sm'}>
                                <UserManagement {...props}/>
                            </Stack>
                        </Tabs.Panel>

                        <Tabs.Panel value="delivery-locations">
                            <PincodeList/>
                        </Tabs.Panel>

                        <Tabs.Panel value="tax-information">
                            <ChargesList/>
                        </Tabs.Panel>
                    </Tabs>
                </div>
            </div>
        </MasterLayout>
    )
}

export default Settings