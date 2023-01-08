'use client';

import {getSession} from "next-auth/react";
import {DocumentIcon} from "@heroicons/react/24/solid";
import BreadCrumb from "../../components/ui/breadcrumb";
import ShiftDetailList from "../../components/shifts/shift-detail-list";
import Link from "next/link";
import {useRouter} from "next/router";
import {useQuery} from "@tanstack/react-query";
import {getAllShifts, getShiftMembers} from "../../helpers/api-utils/shifts";
import Loader from "../../components/ui/loader";
import {getAllEvents} from "../../helpers/api-utils/events";
import {useEffect, useState} from "react";
import UpcomingComp from "../../components/shifts/upcoming";
import {shiftSelected} from "../../atoms/shiftAtom";
import {useAtom} from "jotai";


export default function ShiftDetails(props) {

    const {session} = props.pageProps;

    const router = useRouter()
    const {id, title} = router.query;

    const [tableType, setTableType] = useState("");
    const [filterType, setFilterType] = useState("");
    const [testData, setTestData] = useState([]);
    const [filteredTestData, setFilteredTestData] = useState([]);
    const [myShift, setMyShift] = useAtom(shiftSelected);
    const [selectedDate, setSelectedDate] = useState("");
    const [onFilter, setOnFilter] = useState(0);
    const [dateStart, setDateStart] = useState("");
    const [minDateStart, setMinDateStart] = useState("");
    const [maxDateStart, setMaxDateStart] = useState("");
    const [dateEnd, setDateEnd] = useState("");
    const [teamMember, setTeamMember] = useState("");

    const {isFetching, data, error} = useQuery({
        queryKey: ['shifts'],
        queryFn: getAllEvents.bind(this, [myShift._id, session.user.accessToken]),
    });

    const {isFetching: isFetchingMembers, isError, data: shiftMembers} = useQuery({
        queryKey: ['shiftMembers'],
        queryFn: getShiftMembers.bind(this, session?.user?.accessToken, myShift._id, selectedDate),
    });

    function loadTestTable() {
        let start = new Date(myShift.recursion.startDate);
        let end;

        if (myShift.recursion.endDate === "") {
            const instanceStart = new Date(myShift.recursion.startDate);
            end = new Date(instanceStart.setDate(instanceStart.getDate() + 365));
        } else {
            end = new Date(myShift.recursion.endDate);
        }


        let arr = [];

        switch (myShift.recursion.repeatEvery) {
            case 'weeks':
                let numOfRecursion = myShift.recursion.repeatEveryCount;
                let totalDays = (parseInt(numOfRecursion) * 7);

                setMinDateStart(`${start.getFullYear()}-${(start.getMonth()+1).toString().padStart(2,0)}-${start.getDate().toString().padStart(2,0)}`);
                setMaxDateStart(`${end.getFullYear()}-${(end.getMonth()+1).toString().padStart(2,0)}-${end.getDate().toString().padStart(2,0)}`);

                while (start < end) {

                    let start2 = new Date(start);
                    let newDate = new Date(start.setDate(start.getDate() + totalDays));

                    while (start2 < newDate && start2 < end) {

                        new Date(start2.setDate(start2.getDate() + 1));

                        const getCorrespondingDay =
                            start2.getDay() === 0 ? 'su' :
                            start2.getDay() === 1 ? 'm' :
                                start2.getDay() === 2 ? 't' :
                                    start2.getDay() === 3 ? 'w' :
                                        start2.getDay() === 4 ? 'th' :
                                            start2.getDay() === 5 ? 'f' :
                                                start2.getDay() === 6 ? 's' : '';

                        if (myShift.recursion.days.indexOf(getCorrespondingDay) !== -1) {


                            const result = data?.filter((event) => {
                                return new Date(event.start).getDate() === start2.getDate();
                            });

                            const result2 = shiftMembers?.filter((member) => {
                                return new Date(member.date).getDate() === start2.getDate();
                            })

                            arr.push({
                                date: start2.toLocaleDateString(),
                                members: result && result.length > 0 ? result : result2 && result2.length > 0 ? result2 : ""
                            });
                        }

                    }

                }

                break;
            case 'days' :
                while (start < end) {
                    let newDate = new Date(start.setDate(start.getDate() + numOfRecursion));

                    const result = data?.find((event) => {
                        return new Date(event.start).getDate() === start.getDate();
                    });

                    const result2 = shiftMembers?.find((member) => {
                        return new Date(member.date).getDate() === start.getDate();
                    })

                    arr.push({
                        date: start.toLocaleDateString(),
                        members: result ? result : result2 ? result2 : []
                    });
                }
                break;
        }

        setTestData(arr);
    }

    useEffect(() => {
        loadTestTable();
    }, [data, shiftMembers]);

    useEffect(() => {
        if (onFilter > 0) {
            const arr = testData;

            let newArr = [];


            if(dateStart !== "" && dateEnd !== ""){

                arr.map((data) => {
                    if (new Date(data.date).getDate() >= new Date(dateStart).getDate() && new Date(data.date).getDate() <= new Date(dateEnd).getDate()) {
                        newArr.push(data);
                    }
                });

            }else{

                let regex = new RegExp(teamMember, 'i');
                arr.map((data) => {
                    if(data?.members){
                        if(data.members.length > 0){
                            data?.members.map((member) => {
                                if(regex.test(member.user.fullName)){
                                    newArr.push(data);
                                }
                            })
                        }

                    }
                });
            }

            setFilteredTestData(newArr);

        }
    }, [onFilter]);

    if (isFetching && isFetchingMembers) {
        return <Loader/>
    }


    return (
        <div>
            <BreadCrumb
                headerTitle={
                    <>
                        <Link className={'no-underline text-slate-700 hover:font-medium'} href={'/shifts'}>Jobs</Link>
                        <span className={'text-slate-400'}>/{title}</span>
                    </>
                }
                toolTip={
                    <>
                        <select value={filterType} onChange={(e) => {
                            setFilterType(e.target.value);
                        }} className={'mr-3 border-b border-solid rounded'}>
                            <option disabled selected>Filter By</option>
                            <option value={'Date Range'} key={'date range'}>Date Range</option>
                            <option value={'Team Member'} key={'team member'}>Team Member</option>
                        </select>
                        {
                            filterType === 'Date Range' ?
                                <div>
                                    <input min={minDateStart} value={dateStart}
                                           onChange={(e) => setDateStart(e.target.value)} placeholder={'Date Start'}
                                           type={'date'}
                                           className={'border-b border-slate-300'}/>
                                    <span> - </span>
                                    <input max={maxDateStart} value={dateEnd} onChange={(e) => setDateEnd(e.target.value)}
                                           placeholder={'Date End'} type={'date'}
                                           className={'border-b border-slate-300'}/>

                                </div> : filterType === 'Team Member' ?
                                    <input value={teamMember} onChange={(e) => setTeamMember(e.target.value)}
                                           placeholder={'Team Member'} type={'text'}
                                           className={'border-b border-slate-300'}/> : null
                        }
                        <button onClick={() => {
                            setOnFilter(prev => prev + 1);
                        }
                        } className={'bg-blue-700 text-white rounded px-2 ml-2'}>Filter
                        </button>
                        <button onClick={() => {
                            setFilteredTestData([]);
                            setDateStart("");
                            setDateEnd("");
                            setTeamMember("");
                        }
                        } className={'bg-slate-700 text-white rounded px-2 ml-1'}>Clear
                        </button>
                    </>}
            />

            <ShiftDetailList data={filteredTestData.length === 0 ? testData : filteredTestData} session={session}
                             shiftId={myShift._id} shiftMembers={shiftMembers}/>
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