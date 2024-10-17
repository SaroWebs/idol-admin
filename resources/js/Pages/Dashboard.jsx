import { Head } from '@inertiajs/react';
import MasterLayout from '@/Layouts/MasterLayout'

export default function Dashboard(props) {
    return (
        <MasterLayout {...props}>
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="w-full mx-auto sm:px-6 lg:px-8">
                    Dashboard
                </div>
            </div>
        </MasterLayout>
    );
}
