import {getSession} from "next-auth/react";
import {BellAlertIcon} from "@heroicons/react/24/solid";
import BreadCrumb from "../../components/ui/breadcrumb";
import Table from "../../components/ui/table";
import {useEffect, useMemo, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import Loader from "../../components/ui/loader";
import {getAllAlerts} from "../../helpers/api-utils/alerts";

export default function Alerts(props) {


    const {session} = props.pageProps;

    const {isLoading, isError, data, error} = useQuery({
        queryKey: ['clients'],
        queryFn: getAllAlerts.bind(this, session.user.accessToken),
    });

    const [filterType, setFilterType] = useState("");
    const [filterTime, setFilterTime] = useState("");
    const [filterStart, setFilterStart] = useState("");
    const [filterEnd, setFilterEnd] = useState("");
    const [clientSearch, setClientSearch] = useState("");
    const [siteSearch, setSiteSearch] = useState("");
    const [teamMemberSearch, setTeamMemberSearch] = useState("");
    const [filterOn, setFilterOn] = useState(false);
    const [filterCount, setFilterCount] = useState(0);
    const [alertList, setAlertList] = useState([]);
    const [alertListFilter, setAlertListFilter] = useState([]);


    const columns = [
        {
            Header: 'Date/Time',
            accessor: 'dateTime',
            Cell: function ({row: {original}}) {
                return new Date(original.dateTime).toLocaleDateString();
            }
        },

        {
            Header: 'Alert Type',
            accessor: 'status',
        },
        {
            Header: "Team Member",
            accessor: "action",
            Cell: function ({row: {original}}) {
                return original.events.user.firstName + " " + original.events.user.lastName;
            }
        }

    ];

    useEffect(() => {
        setAlertList(data);
    }, [data]);

    useEffect(() => {
        if (filterCount === 0) {
            setAlertListFilter([]);
        }else{
            let alertNewArr = [];
            switch(filterType){
                case 'Time':
                    switch (filterTime) {
                        case 'Day':
                            alertList.map((data) => {
                                if (new Date(data.dateTime).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)) {
                                    alertNewArr.push(data);
                                }
                            });
                            break;
                        case 'Week':

                            alertList.map((data) => {
                                if (new Date(data.dateTime) <= new Date(new Date() + 7)) {
                                    alertNewArr.push(data);
                                }
                            });
                            break;
                        case 'Custom' :

                            alertList.map((data) => {
                                if (new Date(data.dateTime) >= new Date(filterStart) && new Date(data.dateTime) <= new Date(filterEnd)) {
                                    alertNewArr.push(data);
                                }
                            });
                            break;
                    }
                    break;
                case 'Client':
                    let regex = new RegExp(clientSearch, 'i');
                    alertList.map((data) => {
                        if(regex.test(data.client.name)){
                            alertNewArr.push(data);
                        }
                    });
                    break;
                case 'Site':
                    let regex2 = new RegExp(siteSearch, 'i');
                    alertList.map((data) => {
                        if(regex2.test(data.events.site.siteName)){
                            alertNewArr.push(data);
                        }
                    });
                    break;
                case 'Team Member':
                    let regex3 = new RegExp(teamMemberSearch, 'i');
                    alertList.map((data) => {
                        if(regex3.test(data.events.user.fullName)){
                            alertNewArr.push(data);
                        }
                    });
                    break;
            }
            setAlertListFilter(alertNewArr);

        }


    }, [filterCount]);

    if (isLoading) {
        return <Loader/>
    }

    return (
        <div className={''}>
            <BreadCrumb
                headerTitle={'Alerts'}
                toolTip={
                    <>
                        <span className={'mr-2'}>Filter By: </span>
                        <select value={filterType} onChange={(e) => {
                            setFilterType(e.target.value);
                        }} className={'mr-3 border-b border-solid rounded'}>
                            <option disabled selected>Filter By</option>
                            <option value={'Time'} key={'date range'}>Date</option>
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
                                    <input value={clientSearch} onChange={(e)=> setClientSearch(e.target.value)} placeholder={'Client Name'} type={'text'}
                                           className={'border-b border-slate-300'}/>
                                    : filterType === 'Site' ?
                                        <input value={siteSearch} onChange={(e)=> setSiteSearch(e.target.value)} placeholder={'Site Name'} type={'text'}
                                               className={'border-b border-slate-300'}/>
                                        : filterType === 'Team Member' ?
                                            <input value={teamMemberSearch} onChange={(e)=> setTeamMemberSearch(e.target.value)} placeholder={'Team Member'} type={'text'}
                                                   className={'border-b border-slate-300'}/>
                                            : null
                        }

                        {
                            filterType === 'Time' && filterTime === 'Custom' &&
                            <div>
                                <input placeholder={'Date Start'} type={'date'} value={filterStart}
                                       onChange={(e) => {
                                           setFilterStart(e.target.value)}}
                                       className={'border-b border-slate-300'}/>
                                <span> - </span>
                                <input placeholder={'Date End'} type={'date'} value={filterEnd}
                                           onChange={(e) => {
                                               setFilterEnd(e.target.value)}}
                                       className={'border-b border-slate-300'}/>
                            </div>
                        }

                        <button onClick={() => {
                            setFilterCount(prev => prev + 1)
                            setFilterOn(true);
                        }
                        } className={'bg-blue-700 text-white rounded px-2 ml-2'}>Filter
                        </button>
                        <button onClick={() => {
                            setFilterCount(0)
                            setFilterOn(false);
                        }
                        } className={'bg-slate-700 text-white rounded px-2 ml-1'}>Clear
                        </button>

                    </>}
            />


            <Table columns={columns} apiResult={filterOn ? alertListFilter ? alertListFilter : [] : alertList ? alertList : []}/>
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