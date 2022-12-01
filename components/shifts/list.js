import Table from "../ui/table";
import {useMemo} from "react";
import {useQuery} from "@tanstack/react-query";
import {getAllClients} from "../../helpers/api-utils/clients";
import {PencilIcon, UsersIcon, DocumentIcon} from "@heroicons/react/24/solid";
import {getAllSites} from "../../helpers/api-utils/sites";
import Link from "next/link";

export default function List(props){

    const { data, setShiftId, setForm, setSite, openModal, setAction, openMemberModal} = props;
    function getUserDetail(original){
        setShiftId(original._id);

        setSite(original.site);
        setForm(prevState => {
            let formState = {...prevState};
            formState = {
                timeIn: original.timeIn,
                timeOut: original.timeOut,
                siteId: original.site._id,
                hTimeIn: original.hTimeIn,
                hTimeOut: original.hTimeOut,
            };
            return formState;
        });
    }
    function actionButtons(original){
        return (<div className={'flex justify-end'}>
            <button onClick={()=> {
                getUserDetail(original);
                openModal();
                setAction('edit');
            }} className={'mx-2'}>
                <PencilIcon className="h-5 w-5 text-slate-500" />
            </button>

            <button className={'mx-2'}>
                <Link href={`/shifts/members/${original._id}?title=${original.site.siteName} (${original.timeIn} - ${original.timeOut})`}>
                    <UsersIcon className="h-5 w-5 text-slate-500" />
                </Link>
            </button>
            
            <button className={'mx-2'}>
                <Link href={`/shifts/${original._id}?title=${original.site.siteName} (${original.timeIn} - ${original.timeOut})`}>
                    <DocumentIcon className="h-5 w-5 text-slate-500" />
                </Link>
            </button>
        </div>);
    }

    const columns = [
        {
            Header: "Time In",
            accessor: "timeIn",
        },
        {
            Header: "Time Out",
            accessor: "timeOut",
        },
        {
            Header: "Site",
            accessor: "site",
            Cell: function ({row: {original}}) {
                return original.site?.siteName;
            }
        },
        {
            Header: "Action",
            accessor: "action",
            Cell: function ({row: {original}}) {
                return actionButtons(original);
            }
        }
    ];

    return (
        <div>
            <Table columns={columns} apiResult={data} hiddenColumns={["lastName"]} />
        </div>
    )
}