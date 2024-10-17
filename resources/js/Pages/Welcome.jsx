import { Link, Head } from '@inertiajs/react';

export default function Welcome({ auth, appVersion }) {
    return (
        <>
            <Head title="Welcome" />
            <main className="min-h-screen flex flex-col justify-center items-center">
                <div className="">
                    <h3 className="text-5xl text-slate-400 italic font-bold">Admin Panel</h3>
                    <p className="text-xl text-slate-300">
                        
                    </p>
                    <h6 className="text-sm">v {appVersion}</h6>
                </div>
            </main>
        </>
    );
}
