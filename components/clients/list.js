import Table from "../ui/table";
import { useMemo } from "react";
import {PencilIcon, TrashIcon} from '@heroicons/react/24/solid';

export default function ClientList(props){

    const {clients, openModal, setAction, setForm, setClientId} = props;

    function actionButtons(original){
        return (<div className={'flex justify-end'}>
            <button onClick={()=> {
                setClientId(original._id);
                setForm(prevState => {
                    let formState = {...prevState};
                    formState = {
                        name: original.name,
                        address: original.address,
                        email: original.email,
                        mobilePhone: original.mobilePhone,
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
                Header: "Name",
                accessor: "name",
            },

            {
                Header: 'Email',
                accessor: 'email',
            },
            {
                Header: 'Phone number',
                accessor: 'mobilePhone',
            },
            {
                Header: 'Address',
                accessor: 'address',
            },
            {
                Header: "Action",
                accessor: "action",
                Cell: function ({row: {original}}) {
                    console.log(original);
                    return actionButtons(original);
                }
            }
        ],
        []
    );

    const data = useMemo(
        () => clients,
        [clients]
    );

    return (
        <div>
            <Table columns={columns} apiResult={data} hiddenColumns={["lastName"]} />
        </div>
    )
}