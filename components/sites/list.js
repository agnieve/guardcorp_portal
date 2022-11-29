import Table from "../ui/table";
import { useMemo } from "react";
import {PencilIcon, TrashIcon} from '@heroicons/react/24/solid';
import {useQuery} from "@tanstack/react-query";
import {getAllClients} from "../../helpers/api-utils/clients";
import Loader from "../ui/loader";

export default function SiteList(props){

    const {sites, openModal, setAction, setForm, setSiteId, session, setOpenDeleteModal} = props;

    const { isFetching, data: clients } = useQuery({
        queryKey: ['clients'],
        queryFn: getAllClients.bind(this, session.user.accessToken),
    });

    function actionButtons(original){
        return (<div className={'flex justify-end'}>
            <button onClick={()=> {
                setSiteId(original._id);

                setForm(prevState => {
                    let formState = {...prevState};
                    formState = {
                        siteName: original.siteName,
                        address: original.address,
                        clientId: original.clientId,
                        latitude: original.latitude,
                        longitude: original.longitude,
                        complianceInformation: original.complianceInformation,
                    };
                    return formState;
                });
                openModal();
                setAction('edit');
            }} className={'mx-2'}>
                <PencilIcon className="h-5 w-5 text-slate-500" />
            </button>
            <button className={'mx-2'} onClick={()=> {

                setSiteId(original._id);

                setForm(prevState => {
                    let formState = {...prevState};
                    formState = {
                        siteName: original.siteName,
                        address: original.address,
                        clientId: original.clientId,
                        latitude: original.latitude,
                        longitude: original.longitude,
                        complianceInformation: original.complianceInformation,
                    };
                    return formState;
                });

                setOpenDeleteModal();
            }}>
                <TrashIcon className="h-5 w-5 text-slate-500" />
            </button>
        </div>);
    }

    const columns = [
        {
            Header: "Site",
            accessor: "siteName",
        },
        {
            Header: 'Address',
            accessor: 'address',
        },
        {
            Header: 'Client',
            accessor: 'clientId',
            Cell: function ({row: {original}}) {
                if(!isFetching){
                    const result = clients?.find(client => client._id === original.clientId);
                    return result?.name
                }
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

    const data = useMemo(
        () => sites,
        [sites]
    );

    if(isFetching){
        return null;
    }

    return (
        <div>
            <Table columns={columns} apiResult={data} hiddenColumns={["lastName"]} />
        </div>
    )
}