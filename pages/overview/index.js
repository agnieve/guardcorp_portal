'use client';

import {getSession} from "next-auth/react";
import DashboardIcons from "../../components/overview/DashboardIcons";
import Table from "../../components/ui/table";
import {useMemo} from "react";
import {BellAlertIcon, FlagIcon, NoSymbolIcon, UserIcon} from "@heroicons/react/24/solid";

export default function Overview() {

    const data =[];

    const icons = [
        {
            _id: 1,
            icon: <UserIcon className="h-14 w-14 text-white" />,
            value: 0,
            label: 'Active Guards',
            color: 'bg-blue-400'
        },
        {
            _id: 2,
            icon: <NoSymbolIcon className="h-14 w-14 text-white" />,
            value: 0,
            label: 'Inactive Guards',
            color: 'bg-orange-400'
        },
        {
            _id: 3,
            icon: <BellAlertIcon className="h-14 w-14 text-white" />,
            value: 0,
            label: 'Alerts',
            color: 'bg-red-400'
        },
        {
            _id: 4,
            icon: <FlagIcon className="h-14 w-14 text-white" />,
            value: 0,
            label: 'Incidents',
            color: 'bg-pink-400'
        },
    ];

    const columns = useMemo(
        () => [
            {
                Header: 'Guard',
                accessor: 'guard',
            },
            {
                Header: "Site",
                accessor: "siteName",
            },
            {
                Header: 'Address',
                accessor: 'address',
            },
            {
                Header: 'Logged In',
                accessor: 'shiftStart',
            },

        ],
        []
    );

    return (
            <div className={'flex flex-col'}>
                <div className={'flex justify-between space-x-5'}>
                    {
                        icons.map(icon => <DashboardIcons
                            key={icon._id}
                            label={icon.label}
                            value={icon.value}
                            icon={icon.icon}
                            color={icon.color}
                        />)
                    }
                </div>

                <div className={'mt-10'}>
                    <h1 className={'text-slate-700 mb-2'}>Active Members</h1>
                    <Table columns={columns} apiResult={data} hiddenColumns={["lastName"]} />
                </div>
            </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession({req: context.req});

    if (!session) {
        return {
            redirect: {
                destination: '/',
                permanent: false
            }
        };
    }

    return {
        props: {session},
    }
}