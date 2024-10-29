import { useDisclosure } from '@mantine/hooks'
import React from 'react'

const ImportMedicine = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Button color={'purple'}>Import</Button>
    </>
  )
}

export default ImportMedicine