import { Button, Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks'
import React from 'react'

const ImportMedicine = () => {
  const [opened, { open, close }] = useDisclosure(false);

  const handleUpload=()=>{
    // upload to /product/import
  }
  return (
    <>
      <Button onClick={open} color={'purple'}>Import</Button>
      <Modal onClose={close} opened={opened} size={'60%'}>
        <div className="">
        {/* input csv file*/}
        {/* uploaded file information  */}
        {/* upload button */}
        {/* upload progress */}
        </div>
      </Modal>
    </>
  )
}

export default ImportMedicine