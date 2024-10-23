import { AppShell } from '@mantine/core'
import React from 'react'

const Footer = ({ sidebarOpened }) => {
    return (
        <AppShell.Footer style={{ paddingLeft: sidebarOpened ? '300px' : '0px', background: '#ccc' }}>
            <div className="mx-3 flex justify-between items-center">
                <div className="">
                    <small className='text-teal-600'>Designed & Maintained by
                        <a className='text-teal-700 font-bold' target='_blank' href="https://vasptechnologies.com"> VASP Technologies Pvt. Ltd.</a>
                    </small>
                </div>
                <div className="text-center">
                    <small className="text-gray-700">
                        &copy; {new Date().getFullYear()} Idol Pharma. All rights reserved.
                    </small>
                </div>


            </div>
        </AppShell.Footer>
    )
}

export default Footer