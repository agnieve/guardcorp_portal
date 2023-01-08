'use client';

import { ChartBarIcon,
    UserIcon,
} from '@heroicons/react/24/solid';

export default function DashboardIcons(props){

    const {icon, value, label, color, onClick} = props;

    console.log(icon);

    return (
        <button className={'hover:shadow-lg w-1/4'} onClick={onClick}>
            <div className={`${color} bg-slate-400 py-4 px-12 rounded-lg`}>
                <div className={'flex items-center text-white'}>
                    <div>
                        {icon}
                    </div>
                    <h1 className={'text-6xl'}>{value}</h1>
                </div>
                <h2 className={'text-white'}>{label}</h2>
            </div>
        </button>
    );
}