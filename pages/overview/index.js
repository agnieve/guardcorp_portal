'use client';

import {getSession} from "next-auth/react";
import DashboardIcons from "../../components/overview/DashboardIcons";
import Table from "../../components/ui/table";
import {useMemo, useState} from "react";
import {BellAlertIcon, FlagIcon, NoSymbolIcon, UserIcon} from "@heroicons/react/24/solid";
import BreadCrumb from "../../components/ui/breadcrumb";

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

    const columns = [
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

    ];

    const [filterTime, setFilterTime] = useState("");

    return (
            <div className={'flex flex-col'}>
                <BreadCrumb
                    headerTitle={''}
                    toolTip={<>
                        <select className={'mr-2'} value={filterTime} onChange={(e) => {
                            setFilterTime(e.target.value)
                        }
                        }>
                            <option value={'Day'}>Day</option>
                            <option value={'Week'}>Week</option>
                            <option value={'Month'}>Month</option>
                            <option value={'Quarter'}>Quarter</option>
                            <option value={'Custom'}>Custom</option>
                        </select>

                        {
                            filterTime === 'Custom' &&
                            <div>
                                <input placeholder={'Date Start'} type={'date'}
                                       className={'border-b border-slate-300'}/>
                                <span> - </span>
                                <input placeholder={'Date End'} type={'date'}
                                       className={'border-b border-slate-300'}/>
                            </div>
                        }

                        <button className={'bg-blue-700 text-white rounded px-2 ml-2'}>Filter</button>
                        <button className={'bg-slate-700 text-white rounded px-2 ml-1'}>Clear</button>
                    </>} />
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