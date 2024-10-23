import { AppShell, NavLink, ScrollArea } from '@mantine/core';
import { HomeIcon, ListIcon, UserIcon, PackageIcon, ShoppingCartIcon, MapPinIcon, SettingsIcon } from 'lucide-react'; 
import React from 'react';
import { router } from '@inertiajs/react';

const Sidebar = (props) => {
    const isActive = (route) => window.location.pathname.includes(route);
    return (
        <AppShell.Navbar>
            <div className="w-full min-h-[95vh] bg-slate-800 p-4 text-white">
                <ScrollArea style={{ height: '95vh' }}>
                    <nav>
                        <NavLink
                            label="Dashboard"
                            leftSection={<HomeIcon className='w-4' />}
                            className="mb-2"
                            onClick={() => router.visit('/dashboard')}
                            active={isActive('/dashboard')}
                        />
                        <NavLink
                            label="Categories"
                            leftSection={<ListIcon className='w-4' />}
                            className="mb-2"
                            onClick={() => router.visit('/categories')}
                            active={isActive('/categories')}
                        />
                        <NavLink
                            label="Customers"
                            leftSection={<UserIcon className='w-4' />}
                            className="mb-2"
                            onClick={() => router.visit('/customers')}
                            active={isActive('/customers')}
                        />
                        <NavLink
                            label="Medicine"
                            leftSection={<PackageIcon className='w-4' />}
                            className="mb-2"
                            onClick={() => router.visit('/medicine')}
                            active={isActive('/medicine')}
                        />
                        <NavLink
                            label="Orders"
                            leftSection={<ShoppingCartIcon className='w-4' />}
                            className="mb-2"
                            onClick={() => router.visit('/orders')}
                            active={isActive('/orders')}
                        />
                        <NavLink
                            label="Trips"
                            leftSection={<MapPinIcon className='w-4' />}
                            className="mb-2"
                            onClick={() => router.visit('/trips')}
                            active={isActive('/trips')}
                        />
                        <NavLink
                            label="System Settings"
                            leftSection={<SettingsIcon className='w-4' />}
                            className="mt-4"
                            onClick={() => router.visit('/settings')}
                            active={isActive('/settings')}
                        />
                    </nav>
                </ScrollArea>
            </div>
        </AppShell.Navbar>
    );
};

export default Sidebar;
