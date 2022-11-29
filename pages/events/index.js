'use client';

import {getSession} from "next-auth/react";
import BreadCrumb from "../../components/ui/breadcrumb";
import {FlagIcon} from "@heroicons/react/24/solid";
import Table from "../../components/ui/table";
import {useMemo} from "react";

export default function Events(){


    const data =[];

    const columns = useMemo(
        () => [
            {
                Header: 'Date',
                accessor: 'date',
            },
            {
                Header: "Time",
                accessor: "time",
            },

            {
                Header: 'Site',
                accessor: 'site',
            },
            {
                Header: 'Team Member',
                accessor: 'teamMember',
            },
            {
                Header: 'Type',
                accessor: 'type',
            },
            {
                Header: 'Note/Description',
                accessor: 'description',
            },

        ],
        []
    );

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