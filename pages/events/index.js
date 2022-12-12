'use client';

import {getSession} from "next-auth/react";
import BreadCrumb from "../../components/ui/breadcrumb";
import {FlagIcon} from "@heroicons/react/24/solid";
import Table from "../../components/ui/table";
import {useMemo} from "react";
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
                toolTip={<FlagIcon className="h-6 w-6 text-slate-500"/>}
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