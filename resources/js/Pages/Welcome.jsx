import {  Head, router } from '@inertiajs/react';
import { useEffect } from 'react';

export default function Welcome({ auth, appVersion }) {
    
    useEffect(() => {
      if(auth.user){
        router.visit('/dashboard');
      }else{
        router.visit('/login');
      }
    }, [auth]);
    
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
