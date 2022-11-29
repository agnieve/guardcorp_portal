import Table from "../ui/table";
import { useMemo } from "react";
import {PencilIcon, TrashIcon} from '@heroicons/react/24/solid';

export default function UserList(props){

    const {users, openModal, setAction, setForm, setUserId, setOpenDeleteModal} = props;

    function actionButtons(original){
        return (<div className={'flex justify-end'}>
            <button onClick={()=> {
                setUserId(original._id);
                setForm(prevState => {
                    let formState = {...prevState};
                    formState = {
                        firstName: original.firstName,
                        lastName: original.lastName,
                        email: original.email,
                        mobilePhone: original.mobilePhone,
                        role: original.role,
                        licenseNumber: original.licenseNumber,
                        profilePicture: original.profilePicture,
                    };
                    return formState;
                });
                openModal();
                setAction('edit');
            }} className={'mx-2'}>
                <PencilIcon className="h-5 w-5 text-slate-500" />
            </button>
            <button className={'mx-2'} onClick={() => {
                setUserId(original._id);
                setForm(prevState => {
                    let formState = {...prevState};
                    formState = {
                        firstName: original.firstName,
                        lastName: original.lastName,
                        email: original.email,
                        mobilePhone: original.mobilePhone,
                        role: original.role,
                        profilePicture: original.profilePicture,
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
            Header: "Name",
            accessor: "name", // accessor is the "key" in the data
            Cell: function ({row: {original}}) {
                return original.firstName + " " + original.lastName;
            },
        },
        {
            Header: 'Last name',
            accessor: 'firstName',
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
            Header: 'Role',
            accessor: 'role',
            Cell: function ({row: {original}}) {
                return original.role

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
        () => users,
        [users]
    );

    return (
        <div>
            <Table columns={columns} apiResult={data} hiddenColumns={["lastName"]} />
        </div>
    )
}