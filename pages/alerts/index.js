import {getSession} from "next-auth/react";
import {BellAlertIcon} from "@heroicons/react/24/solid";
import BreadCrumb from "../../components/ui/breadcrumb";
import Table from "../../components/ui/table";
import {useMemo} from "react";
import {useQuery} from "@tanstack/react-query";
import Loader from "../../components/ui/loader";
import {getAllAlerts} from "../../helpers/api-utils/alerts";

export default function Alerts(props) {


    const { session } = props.pageProps;

    const {isLoading, isError, data, error} = useQuery({
        queryKey: ['clients'],
        queryFn: getAllAlerts.bind(this, session.user.accessToken),
    });

    const columns =  [
            {
                Header: 'Date/Time',
                accessor: 'dateTime',
            },
           
            {
                Header: 'Alert Type',
                accessor: 'status',
            },
            {
                Header: "Team Member",
                accessor: "action",
                Cell: function ({row: {original}}) {
                    return original.eventDetails[0].user.firstName + " " + original.eventDetails[0].user.lastName;
                }
            }

        ];

    if (isLoading) {
        return <Loader />
    }

    return (
        <div className={''}>
            <BreadCrumb
                headerTitle={'Alerts'}
                toolTip={<BellAlertIcon className="h-6 w-6 text-slate-500"/>}
            />

            <Table columns={columns} apiResult={data} />
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