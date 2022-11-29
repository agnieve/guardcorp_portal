import {getSession} from "next-auth/react";
import {BellAlertIcon} from "@heroicons/react/24/solid";
import BreadCrumb from "../../components/ui/breadcrumb";
import Table from "../../components/ui/table";
import {useMemo} from "react";

export default function Alerts() {

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
                Header: 'Alert Type',
                accessor: 'alertType',
            },
            {
                Header: 'Team Member',
                accessor: 'teamMember',
            },

        ],
        []
    );

    return (
        <div className={''}>
            <BreadCrumb
                headerTitle={'Alerts'}
                toolTip={<BellAlertIcon className="h-6 w-6 text-slate-500"/>}
            />

            <Table columns={columns} apiResult={data} hiddenColumns={["lastName"]} />
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