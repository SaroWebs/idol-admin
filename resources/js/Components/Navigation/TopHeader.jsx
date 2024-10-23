import React from 'react'
import ApplicationLogo from '../ApplicationLogo';
import { AppShell, Menu } from '@mantine/core';
import { ArrowLeftToLine, LockIcon, LogOutIcon, MenuIcon, UserIcon } from 'lucide-react';
import { Link } from '@inertiajs/react';

const TopHeader = (props) => {
    const { sidebarOpened, toggleSidebar, auth } = props;
    return (
        <AppShell.Header
            style={{ backgroundColor: '#2b3643', color: 'white' }}
        >
            <div className="flex items-center h-[60px]">

                {sidebarOpened && (
                    <Link href='/dashboard' className={`w-[300px] hidden md:block cursor-pointer`}>
                        <ApplicationLogo className={`max-h-[58px]`} />
                    </Link>
                )}
                <div className="mx-2 flex-1 flex items-center justify-between">
                    {sidebarOpened ?
                        <ArrowLeftToLine
                            className='w-8 text-white cursor-pointer'
                            onClick={toggleSidebar}
                        />
                        :
                        <MenuIcon
                            className='w-8 text-white cursor-pointer'
                            onClick={toggleSidebar}
                        />
                    }

                    <div className="profile">
                        <Menu shadow="md" width={200}>
                            <Menu.Target>
                                <div className="flex gap-2 items-center">
                                    <div className="profile-image h-8 w-8 rounded-full border border-gray-100 overflow-hidden">
                                        <img src={"/assets/images/avatar_small.jpg"} alt="no-img" />
                                    </div>
                                    <span className='text-uppercase'>
                                    {auth.user.name}
                                    </span>

                                </div>
                            </Menu.Target>
                            <Menu.Dropdown>
                                {/* profile, change password, logout */}
                                <Link href='/profile'>
                                    <Menu.Item leftSection={<UserIcon className='w-4' />}>
                                        My Profile
                                    </Menu.Item>
                                </Link>
                                <Link href='/profile'>
                                    <Menu.Item leftSection={<LockIcon className='w-4' />}>
                                        Change Password
                                    </Menu.Item>
                                </Link>
                                <Link href='/logout' method='post'>
                                    <Menu.Item leftSection={<LogOutIcon className='w-4' />}>
                                        Log Out
                                    </Menu.Item>
                                </Link>

                            </Menu.Dropdown>
                        </Menu>
                    </div>
                </div>
            </div>
        </AppShell.Header>
    )
}

export default TopHeader