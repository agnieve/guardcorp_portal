import { signOut } from 'next-auth/react';

import { ArrowLeftOnRectangleIcon } from '@heroicons/react/24/solid';

export default function Navbar(){

    return (
        <div className={'px-6 py-3 bg-slate-500 h-16 drop-shadow-lg flex justify-between'}>
            <h1 className={'text-white'}>GuardPro Portal</h1>
            <button className={''} onClick={()=> signOut()}>
                <ArrowLeftOnRectangleIcon className="h-6 w-6 text-white" />
            </button>
        </div>
    )
}