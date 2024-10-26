import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react'

const RemoveCategory = ({ category, reload }) => {
    const [opened, { open, close }] = useDisclosure(false);

    const handleDelete = () => {
        axios.delete(`/data/categories/${category.id}`)
            .then(res => {
                console.log(`Category ${category.name} has been deleted`);
                close();
                reload();
            })
            .catch(err => {
                console.error('Error deleting category:', err.message);
            });
    };

    return (
        <>
            <button
                className="text-red-500 hover:underline"
                onClick={open}
            >
                Delete
            </button>
            <Modal
                opened={opened}
                withCloseButton={false}
                onClose={close}
                radius="md"
            >
                <div className="flex flex-col items-center">
                    <h2 className='text-3xl mb-2 text-orange-700'>Are You Sure ? </h2>
                    <p className="text-xl font-semibold mb-4 text-center text-gray-500">
                        Category <span className='text-red-500'>{category.name}</span> will be deleted permanently. 
                    </p>
                    <div className="flex gap-2">
                        <Button
                            onClick={close}
                            color="green"
                        >
                            No
                        </Button>
                        <Button
                            onClick={handleDelete}
                            color="orange"
                        >
                            Yes
                        </Button>
                    </div>
                </div>

            </Modal>
        </>
    )
}

export default RemoveCategory