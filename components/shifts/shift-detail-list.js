import {useMemo, useState} from "react";
import Table from "../ui/table";
import Modal from '../ui/modal';

import {DocumentIcon, CloudArrowDownIcon} from "@heroicons/react/20/solid";
import {downloadDocument} from "./shift-detail-print";
import {useRouter} from "next/router";

export default function ShiftDetailList(props) {

    const {data} = props;
    const [open, setOpen] = useState(false);
    const [openPdf, setOpenPdf] = useState(false);

    const router = useRouter();

    function openHandler(){
        setOpen(prev=> !prev);
    }

    function openPdfHandler(){
        setOpenPdf(prev=> !prev);
    }

    function actionButtons(original) {
        return (<div className={'flex justify-end'}>
            <button className={'mx-2'} onClick={async () => {
                await router.push(`/reports/download/${original._id}`);
            }}>
                <CloudArrowDownIcon className="h-5 w-5 text-slate-500"/>
            </button>
            <button className={'mx-2'} onClick={() => {
                openHandler();
            }}>
                <DocumentIcon className="h-5 w-5 text-slate-500"/>
            </button>
        </div>);
    }

    const columns =[
        {
            Header: "Date",
            accessor: "timeIn",
            Cell: function ({row: {original}}) {
                return <p>{new Date(original.start).toLocaleDateString()}</p>
            }
        },
        {
            Header: "Team Members",
            accessor: "membersActive",
            Cell: function ({row: {original}}) {
                return <p>
                    {original.user.firstName} {original.user.lastName} <br />
                    <span>Time In: {new Date(original.start).toLocaleTimeString()}</span> <br />
                    <span>Time Out: {new Date(original.end).toLocaleTimeString()}</span> <br />
                </p>
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
            <Modal open={open} setOpen={openHandler}>
                <div className={'w-full space-y-3'}>
                    <div className={'flex flex-col items-center'}>
                        <h1 className={'text-center'}>Site Name</h1>
                        <h4>11/16/2022</h4>
                    </div>
                    <div className={'flex bg-slate-100 rounded-md p-2'}>
                        <div className={'flex items-start flex-col px-3'}>
                            <h2>John Doe</h2>
                            <h4>Time In: 7:30</h4>
                            <h4>Time Out: 15:30</h4>
                        </div>
                        <div className={'flex items-start flex-col px-3'}>
                            <h2>Activities</h2>
                            <p>Checked Camera: 7:35</p>
                            <p>Start Patrol : 8:30</p>
                            <p>End Patrol : 13:30</p>
                            <p>Park Inspection: 10:00</p>
                            <p>Building Inspection: 11:23</p>
                        </div>
                        <div className={'flex items-start flex-col px-3'}>
                            <h2>Alerts</h2>
                            <p>No Alerts</p>
                        </div>
                        <div className={'flex items-start flex-col px-3'}>
                            <h2>Events/Incidents</h2>
                            <p>No Incident Reported</p>
                        </div>
                    </div>

                    <div className={'flex items-start bg-slate-100 rounded-md p-2'}>
                        <div className={'flex items-start flex-col px-3'}>
                            <h2>AG</h2>
                            <h4>Time In: 7:30</h4>
                            <h4>Time Out: 15:30</h4>
                        </div>
                        <div className={'flex items-start flex-col px-3'}>
                            <h2>Activities</h2>
                            <p>Checked Camera: 7:35</p>
                            <p>Start Patrol : 8:30</p>
                            <p>End Patrol : 13:30</p>
                            <p>Park Inspection: 10:00</p>
                            <p>Building Inspection: 11:23</p>
                        </div>
                        <div className={'flex items-start flex-col px-3'}>
                            <h2>Alerts</h2>
                            <p>No Alerts</p>
                        </div>
                        <div className={'flex items-start flex-col px-3'}>
                            <h2>Events/Incidents</h2>
                            <p>No Incident Reported</p>
                        </div>
                    </div>

                    <div className={'flex justify-end mt-8'}>
                        <button type={'button'} className={'pr-4 py-2'} onClick={openHandler}>Close</button>
                    </div>
                </div>
            </Modal>
            <Table columns={columns} apiResult={data.length > 0 ? data : []}/>
        </div>
    )
}