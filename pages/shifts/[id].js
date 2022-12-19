'use client';

import {getSession} from "next-auth/react";
import {DocumentIcon} from "@heroicons/react/24/solid";
import BreadCrumb from "../../components/ui/breadcrumb";
import ShiftDetailList from "../../components/shifts/shift-detail-list";
import Link from "next/link";
import {useRouter} from "next/router";
import {useQuery} from "@tanstack/react-query";
import {getAllShifts} from "../../helpers/api-utils/shifts";
import Loader from "../../components/ui/loader";
import {getAllEvents} from "../../helpers/api-utils/events";
import {useState} from "react";
import UpcomingComp from "../../components/shifts/upcoming";


export default function ShiftDetails(props) {

    const {session} = props.pageProps;

    const router = useRouter()
    const {id, title} = router.query;

    const [tableType, setTableType] = useState("");
    const [filterType, setFilterType] = useState("");

    const {isFetching, data, error} = useQuery({
        queryKey: ['shifts'],
        queryFn: getAllEvents.bind(id, this, session.user.accessToken),
    });

    if (isFetching) {
        return <Loader/>
    }

    return (
        <div>
            <BreadCrumb
                headerTitle={
                    <>
                        <Link className={'no-underline text-slate-700 hover:font-medium'} href={'/shifts'}>Jobs</Link>
                        <span className={'text-slate-400'}>/{title}</span>
                    </>
                }
                toolTip={
                    <>
                        <select value={tableType} onChange={(e) => {
                            setTableType(e.target.value);
                        }
                        } className={'mr-3 border-b border-solid rounded'}>
                            <option value={'Archived Shifts'} key={'archived shifts'}>Archived Shifts</option>
                            <option value={'Upcoming Shifts'} key={'upcoming shifts'}>Upcoming Shifts</option>
                        </select>
                        <select value={filterType} onChange={(e) => {
                            setFilterType(e.target.value);
                        }} className={'mr-3 border-b border-solid rounded'}>
                            <option disabled selected>Filter By</option>
                            <option value={'Date Range'} key={'date range'}>Date Range</option>
                            <option value={'Team Member'} key={'team member'}>Team Member</option>
                        </select>
                        {
                            filterType === 'Date Range' ?
                                <div>
                                    <input placeholder={'Date Start'} type={'date'}
                                           className={'border-b border-slate-300'}/>
                                    <span> - </span>
                                    <input placeholder={'Date End'} type={'date'}
                                           className={'border-b border-slate-300'}/>

                                </div> : filterType === 'Team Member' ?
                                    <input placeholder={'Team Member'} type={'text'}
                                           className={'border-b border-slate-300'}/> : null
                        }
                        <button className={'bg-blue-700 text-white rounded px-2 ml-2'}>Filter</button>
                        <button className={'bg-slate-700 text-white rounded px-2 ml-1'}>Clear</button>
                    </>}
            />
            {
                tableType === 'Upcoming Shifts' ? <UpcomingComp/> : <ShiftDetailList data={data}/>
            }
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