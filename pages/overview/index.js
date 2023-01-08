'use client';

import {getSession} from "next-auth/react";
import DashboardIcons from "../../components/overview/DashboardIcons";
import Table from "../../components/ui/table";
import {useEffect, useMemo, useState} from "react";
import {BellAlertIcon, FlagIcon, NoSymbolIcon, UserIcon} from "@heroicons/react/24/solid";
import BreadCrumb from "../../components/ui/breadcrumb";
import ActiveGuardList from "../../components/overview/ActiveGuardList";
import InActiveGuardList from "../../components/overview/InActiveGuardList";
import AlertsList from "../../components/overview/AlertsList";
import IncidentsList from "../../components/overview/IncidentsList";
import Loader from "../../components/ui/loader";
import {useQuery} from "@tanstack/react-query";
import {getAllIncidents} from "../../helpers/api-utils/incidents";
import {getAllAlerts} from "../../helpers/api-utils/alerts";
import {getActiveUsers} from "../../helpers/api-utils/users";

export default function Overview(props) {

    const {session} = props.pageProps;

    const [filterTime, setFilterTime] = useState("Day");
    const [filterStart, setFilterStart] = useState("");
    const [filterEnd, setFilterEnd] = useState("");
    const [selected, setSelected] = useState("active");

    const [actives, setActives] = useState([]);
    const [activeFilter, setActiveFilter] = useState([]);
    const [filterOn, setFilterOn] = useState(false);

    const [onFilter, setOnFilter] = useState(0);
    const [inactives, setInactives] = useState([]);

    const [alerts, setAlerts] = useState([]);
    const [alertsFilter, setAlertFilter] = useState([]);

    const [incidents, setIncidents] = useState([]);
    const [incidentsFilter, setIncidentFilter] = useState([]);

    const {isLoading, isError, data, error} = useQuery({
        queryKey: ['active'],
        queryFn: getActiveUsers.bind(this, session.user.accessToken),
    });

    const {isLoading: isLoadingAlert, data: alertData} = useQuery({
        queryKey: ['alerts'],
        queryFn: getAllAlerts.bind(this, session.user.accessToken),
    });

    const {isLoading: isLoadingIncidents, data: incidentData} = useQuery({
        queryKey: ['incidents'],
        queryFn: getAllIncidents.bind(this, session.user.accessToken),
    });


    const selections = {
        active: <ActiveGuardList data={filterOn || activeFilter.length > 0 ? activeFilter : actives}/>,
        inactive: <InActiveGuardList data={inactives}/>,
        alert: <AlertsList data={filterOn || alertsFilter.length > 0 ? alertsFilter : alerts}/>,
        incident: <IncidentsList data={filterOn || incidentsFilter.length > 0 ? incidentsFilter : incidents}/>
    }

    useEffect(() => {

        setActives(data);
        setAlerts(alertData);
        setIncidents(incidentData)
    }, [data, alertData, incidentData]);

    useEffect(() => {

        if (onFilter === 0) {
            setActiveFilter([]);
            setAlertFilter([]);
            setIncidentFilter([]);
        } else {
            let activeNewArr = [];
            let alertNewArr = [];
            let incidentNewArr = [];

            console.log("use effect triggered for filter");
            console.log(filterTime);

            switch (filterTime) {
                case 'Day':
                    actives.map((data) => {
                        if (new Date(data._id.start).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)) {
                            activeNewArr.push(data);
                        }
                    });

                    alerts.map((data) => {
                        if (new Date(data.dateTime).setHours(0,0,0,0) === new Date().setHours(0,0,0,0)) {
                            alertNewArr.push(data);
                        }
                    });

                    incidents.map((data) => {
                        if (new Date(data.date).setHours(0,0,0,0)  === new Date().setHours(0,0,0,0)) {
                            incidentNewArr.push(data);
                        }
                    });
                    break;
                case 'Week':
                    actives.map((data) => {
                        if (new Date(data._id.start) <= new Date(new Date() + 7)) {
                            activeNewArr.push(data);
                        }
                    });

                    alerts.map((data) => {
                        if (new Date(data.dateTime) <= new Date(new Date() + 7)) {
                            alertNewArr.push(data);
                        }
                    });

                    incidents.map((data) => {
                        if (new Date(data.date) <= new Date(new Date() + 7)) {
                            incidentNewArr.push(data);
                        }
                    });
                    break;
                case 'Month':
                    console.log(new Date().getMonth())

                    actives.map((data) => {

                        if (new Date(data._id.start).getMonth() === new Date().getMonth()) {
                            activeNewArr.push(data);
                        }
                    });

                    alerts.map((data) => {
                        if (new Date(data.dateTime).getMonth() === new Date().getMonth()) {
                            alertNewArr.push(data);
                        }
                    });

                    incidents.map((data) => {
                        if (new Date(data.date).getMonth() === new Date().getMonth()) {
                            incidentNewArr.push(data);
                        }
                    });
                    break;
                case  'Quarter':
                    actives.map((data) => {
                        const start = new Date();

                        let newDate = new Date(start.setDate(start.getDate() - 90));

                        if (new Date(data._id.start).setHours(0,0,0,0) >= newDate.setHours(0,0,0,0) && new Date(data._id.start).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0)) {
                            activeNewArr.push(data);
                        }
                    });

                    alerts.map((data) => {
                        const start = new Date();

                        let newDate = new Date(start.setDate(start.getDate() - 90));

                        if (new Date(data.dateTime).setHours(0,0,0,0) >= newDate.setHours(0,0,0,0) && new Date(data.dateTime).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0)) {
                            alertNewArr.push(data);
                        }
                    });

                    incidents.map((data) => {
                        const start = new Date();

                        let newDate = new Date(start.setDate(start.getDate() - 90));

                        if (new Date(data.date).setHours(0,0,0,0) >= newDate.setHours(0,0,0,0) && new Date(data.date).setHours(0,0,0,0) <= new Date().setHours(0,0,0,0)) {
                            incidentNewArr.push(data);
                        }
                    });
                    break;
                case 'Custom' :
                    actives.map((data) => {
                        if (new Date(data._id.start) >= new Date(filterStart) && new Date(data._id.start) <= new Date(filterEnd)) {
                            activeNewArr.push(data);
                        }
                    });

                    alerts.map((data) => {
                        if (new Date(data.dateTime) >= new Date(filterStart) && new Date(data.dateTime) <= new Date(filterEnd)) {
                            alertNewArr.push(data);
                        }
                    });

                    incidents.map((data) => {
                        if (new Date(data.date) >= new Date(filterStart) && new Date(data.date) <= new Date(filterEnd)) {
                            incidentNewArr.push(data);
                        }
                    });
                    break;
            }

            console.log(activeNewArr);
            setActiveFilter(activeNewArr);
            setAlertFilter(alertNewArr);
            setIncidentFilter(incidentNewArr);

        }

    }, [onFilter]);

    const icons = [
        {
            _id: 1,
            icon: <UserIcon className="h-14 w-14 text-white"/>,
            value: filterOn ? activeFilter.length : actives?.length,
            label: 'Active Guards',
            color: 'bg-blue-400',
            trigger: 'active'
        },
        {
            _id: 2,
            icon: <NoSymbolIcon className="h-14 w-14 text-white"/>,
            value: 0,
            label: 'Inactive Guards',
            color: 'bg-orange-400',
            trigger: 'inactive'

        },
        {
            _id: 3,
            icon: <BellAlertIcon className="h-14 w-14 text-white"/>,
            value: filterOn ? alertsFilter.length : alerts?.length,
            label: 'Alerts',
            color: 'bg-red-400',
            trigger: 'alert'

        },
        {
            _id: 4,
            icon: <FlagIcon className="h-14 w-14 text-white"/>,
            value: filterOn ? incidentsFilter.length : incidents?.length,
            label: 'Incidents',
            color: 'bg-pink-400',
            trigger: 'incident'

        },
    ];

    if (isLoading && isLoadingIncidents && isLoadingAlert) {
        return <Loader/>
    }

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
                            <input value={filterStart} onChange={(e) => setFilterStart(e.target.value)}
                                   placeholder={'Date Start'} type={'date'}
                                   className={'border-b border-slate-300'}/>
                            <span> - </span>
                            <input value={filterEnd} onChange={(e) => setFilterEnd(e.target.value)}
                                   placeholder={'Date End'} type={'date'}
                                   className={'border-b border-slate-300'}/>
                        </div>
                    }

                    <button onClick={
                        () => {
                            setOnFilter(prev => prev + 1);
                            setFilterOn(true);
                        }
                    }
                            className={'bg-blue-700 text-white rounded px-2 ml-2'}>Filter
                    </button>
                    <button onClick={() => {
                        setFilterOn(false);
                    }
                    } className={'bg-slate-700 text-white rounded px-2 ml-1'}>Clear
                    </button>
                </>}/>
            <div className={'flex justify-between space-x-5'}>
                {
                    icons.map(icon => <DashboardIcons
                        onClick={() => setSelected(icon.trigger)}
                        key={icon._id}
                        label={icon.label}
                        value={icon.value}
                        icon={icon.icon}
                        color={icon.color}
                    />)
                }
            </div>
            {selections[selected]}
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