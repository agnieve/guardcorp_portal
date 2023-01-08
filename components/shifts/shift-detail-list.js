import {useEffect, useMemo, useState} from "react";
import Table from "../ui/table";
import Modal from '../ui/modal';

import {DocumentIcon, CloudArrowDownIcon, TrashIcon, XCircleIcon} from "@heroicons/react/20/solid";
import {downloadDocument} from "./shift-detail-print";
import {useRouter} from "next/router";
import {useQuery} from "@tanstack/react-query";
import {getEvent} from "../../helpers/api-utils/events";
import {UsersIcon} from "@heroicons/react/24/solid";
import AddMemberForm from "./add-member-form";
import TeamMemberList from "./team-member-list";
import DeleteTeamMember from "./team-member-delete";

export default function ShiftDetailList(props) {

    const {data, session, shiftId, shiftMembers} = props;
    const [open, setOpen] = useState(false);
    const [openPdf, setOpenPdf] = useState(false);
    const [eventId, setEventId] = useState("");
    const [openTeamMemberModal, setOpenTeamMemberModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState([]);
    const [shiftMemberId, setShiftMemberId] = useState("");
    const [modalDelete, setModalDelete] = useState(false);

    const router = useRouter();

    function openHandler() {
        setOpen(prev => !prev);
    }

    function openTeamMemberModalHandler() {
        setOpenTeamMemberModal(prev => !prev);
    }

    function openPdfHandler() {
        setOpenPdf(prev => !prev);
    }

    const {isLoading, refetch, data: eventDetail} = useQuery({
        queryKey: ['report'],
        queryFn: getEvent.bind(this, eventId),
        enabled: false
    });

    useEffect(() => {
        refetch();
    }, [eventId]);

    function actionButtons(original) {
        return (<div className={'flex justify-end'}>
            <button className={'mx-2'} onClick={async () => {
                await router.push(`/report/${original.members[0]._id}`);
            }}>
                <CloudArrowDownIcon className="h-5 w-5 text-slate-500"/>
            </button>
            <button className={'mx-2'} onClick={async () => {
                setEventId(original.members[0]._id);
                await refetch().then(data => {
                    console.log(data);
                });
                openHandler();
            }}>
                <DocumentIcon className="h-5 w-5 text-slate-500"/>
            </button>
        </div>);
    }

    function addMemberActionButton(original) {
        return (<div className={'flex justify-end'}>
            <button type={'button'} onClick={() => {
                setSelectedDate(original);
                openTeamMemberModalHandler();
            }} className={'mx-2 z-50'}>
                <UsersIcon className="h-5 w-5 text-slate-500"/>
            </button>
        </div>);
    }

    function deleteMemberActionButton(original) {
        return (<div className={'flex justify-end'}>
            <button type={'button'} onClick={() => {
            }} className={'mx-2 z-50'}>
                <TrashIcon className="h-5 w-5 text-slate-500"/>
            </button>
        </div>);
    }

    function modalDeleteHandler() {
        setModalDelete(prev => !prev);
    }

    const teamMemberColumn = [
        {
            Header: "Member",
            accessor: "member",
        },
        {
            Header: "Action",
            accessor: "action",
            Cell: function ({row: {original}}) {

                return deleteMemberActionButton(original);
            }
        }
    ];

    const columns = [
        {
            Header: "Date",
            accessor: "date",
        },
        {
            Header: "Team Members",
            accessor: "members",
            Cell: function ({row: {original}}) {


                if (original?.members
                ) {
                    return original?.members?.map((member) => {
                        return <p>{`${member?.user?.fullName} ${member?.start ?
                            ` ${new Date(member?.start).toLocaleTimeString()} - ${new Date(member?.end).toLocaleTimeString()}`
                            : ''}`}</p>
                    })
                }

                return "";

                // return <p>
                //     {original.user.firstName} {original.user.lastName} <br />
                //     <span>Time In: {new Date(original.start).toLocaleTimeString()}</span> <br />
                //     <span>Time Out: {new Date(original.end).toLocaleTimeString()}</span> <br />
                // </p>
            }
        },
        {
            Header: "Action",
            accessor: "action",
            Cell: function ({row: {original}}) {

                if (original?.members) {
                    if (original.members.length !== 0 && original.members[0].start) {
                        return actionButtons(original);
                    }
                }

                return addMemberActionButton(original);
            }
        }
    ];

    if (isLoading) {
        return 'Loading...';
    }

    return (
        <div>
            {
                openTeamMemberModal ?
                    <div className={'p-5 bg-slate-50'}>
                        <div className="flex justify-between">
                            <h2 className={'text-2xl font-semibold text-slate-300'}>Team Members
                                for {selectedDate.date}</h2>
                            <button onClick={() => openTeamMemberModalHandler()}>
                                <XCircleIcon className="h-7 w-7 text-slate-500"/>
                            </button>
                        </div>
                        <AddMemberForm session={session} shiftId={shiftId} date={selectedDate.date}/>
                        <TeamMemberList
                            openModalHandler={modalDeleteHandler}
                            setShiftMemberId={setShiftMemberId}
                            shiftMembers={selectedDate.members ? selectedDate.members : []}/>
                        <DeleteTeamMember
                            openModal={modalDelete}
                            openModalHandler={modalDeleteHandler}
                            shiftMemberId={shiftMemberId}
                            session={session}
                        />
                    </div> : <Table columns={columns} apiResult={data.length > 0 ? data : []}/>
            }
            <Modal open={open} setOpen={openHandler}>
                <div className={'w-full px-5'}>
                    <div className={'flex flex-col items-center'}>
                        <h1>{eventDetail?.client?.name}</h1>
                        <h1 className={'text-center'}>{eventDetail?.event?.site.siteName}</h1>
                        <h4>Date: {new Date(eventDetail?.event?.start).toLocaleDateString()}</h4>
                        <h4>Time In: {new Date(eventDetail?.event?.start).toLocaleTimeString()}</h4>
                        <h4>Time Out: {new Date(eventDetail?.event?.end).toLocaleTimeString()}</h4>
                    </div>
                    <div className={'mb-5'}>
                        <h2 className={'text-left mb-3'}>Team Members</h2>
                        <table className={'w-full'}>
                            <thead>
                            <tr className={'border-b border-slate-300'}>
                                <th>Name</th>
                                <th>Email</th>
                                <th>License</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td>{eventDetail?.event?.user?.firstName} {eventDetail?.event?.user?.lastName}</td>
                                <td>{eventDetail?.event?.user?.email}</td>
                                <td>{eventDetail?.event?.user?.licenseNumber}</td>
                            </tr>
                            </tbody>

                        </table>
                    </div>
                    <div className={''}>
                        <h2 className={'text-left mb-3'}>Activity Log</h2>
                        <table className={'w-full'}>
                            <thead>
                            <tr className={'border-b border-slate-300'}>
                                <th>Time</th>
                                <th>Type of Activity</th>
                                <th>Member</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                eventDetail?.inspections?.map((inspection, index) =>
                                    <tr key={index}>
                                        <td>{new Date(inspection.date).toLocaleTimeString()}</td>
                                        <td>{inspection.type}</td>
                                        <td>{eventDetail?.event?.user?.fullName}</td>
                                    </tr>)
                            }

                            {
                                eventDetail?.patrol?.map((patrol, index) =>
                                    <tr key={index}>
                                        <td>{new Date(patrol.dateTime).toLocaleTimeString()}</td>
                                        <td>{patrol.status === 'START' ? `${patrol.status} PATROL` : `END PATROL - ${patrol.type}`}</td>
                                        <td>{eventDetail?.event?.user?.fullName}</td>
                                    </tr>)
                            }
                            </tbody>
                        </table>
                    </div>

                    <div className={'flex justify-end mt-8'}>
                        <button type={'button'} className={'pr-4 py-2'} onClick={openHandler}>Close</button>
                    </div>
                </div>
            </Modal>

        </div>
    )
}