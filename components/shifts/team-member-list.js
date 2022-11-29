import Table from "../ui/table";
import {useMemo} from "react";
import {ClipboardDocumentIcon, PrinterIcon, TrashIcon} from "@heroicons/react/20/solid";
import Image from "next/image";

export default function TeamMemberList(props) {

    const {shiftMembers, setShiftMemberId, setMember, openModalHandler} = props;

    function actionButtons(original) {
        return (<div className={'flex justify-end'}>
            <button className={'mx-2'} onClick={() => {
                setMember(original);
                setShiftMemberId(original._id);
                openModalHandler();
            }}>
                <TrashIcon className="h-5 w-5 text-slate-500"/>
            </button>
        </div>);
    }

    const columns = useMemo(
        () => [
            {
                Header: "#",
                accessor: "user.profilePicture",
                Cell: function ({row: {original}}) {
                    return<div className="relative w-20 h-20 bg-slate-100 rounded-full overflow-hidden">
                        <Image fill={true} style={{borderRadius:100}} src={original.user.profilePicture}  alt="Picture of user" />
                    </div>;
                }
            },
            {
                Header: "Name",
                accessor: "user.fullName",
            },
            {
                Header: "Email",
                accessor: "user.email",
            },
            {
                Header: "License Number",
                accessor: "user.licenseNumber",
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

    return (
        <div>
            <Table columns={columns} apiResult={shiftMembers.length > 0 ? shiftMembers: []}/>
        </div>
    )
}