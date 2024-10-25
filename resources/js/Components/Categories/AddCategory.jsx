import { Button, Modal, TextInput } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { useState } from 'react'

const AddCategory = () => {

    const [formInfo, setFormInfo] = useState({
        'name': '',
        'description': '',
        'icon': '',
        'image': '',
        'status': 1
    });

    return (
        <div className="grid grid-cols-2 gap-2">
            <TextInput
                label="Category Name"
                withAsterisk
                placeholder="Category Name"
            />
            <TextInput
                label="Description"
                placeholder="Description"
            />

        </div>

    )
}

export default AddCategory