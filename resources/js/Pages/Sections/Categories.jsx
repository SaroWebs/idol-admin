import MasterLayout from '@/Layouts/MasterLayout'
import { Head } from '@inertiajs/react'
import React from 'react'

const Categories = (props) => {
  return (
    <MasterLayout {...props}>
      <Head title="Categories" />

      <div className="py-12">
        <div className="w-full mx-auto sm:px-6 lg:px-8">
          Categories
        </div>
      </div>
    </MasterLayout>
  )
}

export default Categories