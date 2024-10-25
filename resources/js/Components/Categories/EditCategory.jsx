import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks'
import React from 'react'

const EditCategory = ({ category, reload }) => {
    const [opened, { open, close }] = useDisclosure(false);
    return (
        <>
            <button
                className="text-blue-500 hover:underline mr-2"
                onClick={open}
            >
                Edit
            </button>
            <Modal opened={opened} onClose={close} title={'Edit Category'}>
                <form className=''>
                    {/*  */}
                </form>
            </Modal>
        </>
    )
}

export default EditCategory