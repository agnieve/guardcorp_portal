import Table from "../ui/table";
import { useMemo } from "react";
import {PencilIcon, TrashIcon} from '@heroicons/react/24/solid';
import {useAtom} from "jotai";
import {clientsAtom} from "../../atoms/clientsAtom";

export default function UserList(props){

    const {sites, openModal, setAction, setForm, setSiteId} = props;
    const [clients, setClients] = useAtom(clientsAtom);

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
                        shiftStart: original.shiftStart,
                        shiftEnd: original.shiftEnd
                    };
                    return formState;
                });
                openModal();
                setAction('edit');
            }} className={'mx-2'}>
                <PencilIcon className="h-5 w-5 text-slate-500" />
            </button>
            <button className={'mx-2'}>
                <TrashIcon className="h-5 w-5 text-slate-500" />
            </button>
        </div>);
    }

    const columns = useMemo(
        () => [
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
                    const result = clients.find(client => client._id === original.clientId);
                    return result?.name
                }
            },
            {
                Header: 'Shift Start',
                accessor: 'shiftStart',
            },
            {
                Header: 'Shift End',
                accessor: 'shiftEnd',
            },
            {
                Header: "Action",
                accessor: "action",
                Cell: function ({row: {original}}) {
                    return actionButtons(original);
                }
            }
        ],
        []
    );

    const data = useMemo(
        () => sites,
        [sites]
    );

    return (
        <div>
            <Table columns={columns} apiResult={data} hiddenColumns={["lastName"]} />
        </div>
    )
}