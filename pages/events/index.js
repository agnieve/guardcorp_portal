'use client';

import {getSession} from "next-auth/react";
import BreadCrumb from "../../components/ui/breadcrumb";
import {FlagIcon} from "@heroicons/react/24/solid";
import Table from "../../components/ui/table";
import {useMemo, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getAllAlerts} from "../../helpers/api-utils/alerts";
import {getAllIncidents} from "../../helpers/api-utils/incidents";
import Loader from "../../components/ui/loader";

export default function Events(props){

    const { session } = props.pageProps;

    const {isLoading, isError, data, error} = useQuery({
        queryKey: ['clients'],
        queryFn: getAllIncidents.bind(this, session.user.accessToken),
    });

    const [filterType, setFilterType] = useState("");
    const [filterTime, setFilterTime] = useState("");

    const columns = [
            {
                Header: 'Date/Time',
                accessor: 'date',
            },
            {
                Header: "Site",
                accessor: "site",
                Cell: function ({row: {original}}) {
                    return original.eventDetails[0].site.siteName;
                }
            },
            {
                Header: "Team Member",
                accessor: "teamMember",
                Cell: function ({row: {original}}) {
                    return original.eventDetails[0].user.firstName + " " + original.eventDetails[0].user.lastName;
                }
            },
            {
                Header: 'Type',
                accessor: 'type',
            },
            {
                Header: 'Note/Description',
                accessor: 'notes',
            },

        ];

    if (isLoading) {
        return <Loader />
    }

    return(
        <div className={''}>
            <BreadCrumb
                headerTitle={'Events/Incidents'}
                toolTip={
                    <>
                        <span className={'mr-2'}>Filter By: </span>
                        <select value={filterType} onChange={(e) => {
                            setFilterType(e.target.value);
                        }} className={'mr-3 border-b border-solid rounded'}>
                            <option disabled selected>Filter By</option>
                            <option value={'Time'} key={'date range'}>Time</option>
                            <option value={'Client'} key={'team member'}>Client</option>
                            <option value={'Site'} key={'team member'}>Site</option>
                            <option value={'Team Member'} key={'team member'}>Guard / Team Member</option>
                        </select>

                        {
                            filterType === 'Time' ?
                                <select className={'mr-2'} value={filterTime} onChange={(e) => {
                                    setFilterTime(e.target.value)
                                }
                                }>
                                    <option value={'Day'}>Day</option>
                                    <option value={'Week'}>Week</option>
                                    <option value={'Custom'}>Custom</option>
                                </select>
                                : filterType === 'Client' ?
                                    <input placeholder={'Client Name'} type={'text'}
                                           className={'border-b border-slate-300'}/>
                                    : filterType === 'Site' ?
                                        <input placeholder={'Site Name'} type={'text'}
                                               className={'border-b border-slate-300'}/>
                                        : filterType === 'Team Member' ?
                                            <input placeholder={'Team Member'} type={'text'}
                                                   className={'border-b border-slate-300'}/>
                                            : null
                        }

                        {
                            filterType === 'Time' && filterTime === 'Custom' &&
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

                    </>}
            />

            <Table columns={columns} apiResult={data} hiddenColumns={["lastName"]} />
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession({req: context.req});

    if(!session){
        return {
            redirect : {
                destination: '/',
                permanent: false
            }
        };
    }

    return {
        props: { session },
    }
}