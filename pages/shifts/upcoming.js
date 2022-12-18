import {getSession} from "next-auth/react";
import Table from "../../components/ui/table";
import {CalendarDaysIcon, DocumentIcon, PencilIcon, UsersIcon} from "@heroicons/react/24/solid";
import BreadCrumb from "../../components/ui/breadcrumb";


export default function Upcoming(props){

    const data2=[
        {
            date: '12/12/2022',
            teamMembers: [
                {
                    name: 'AG Nieve',
                    timeIn: '7:30 am',
                    timeOut: '5:00pm'
                },
                {
                    name: 'John Doe',
                    timeIn: '5:00 pm',
                    timeOut: '12:00am'
                },
            ]
        }
    ];


    const columns2 = [
        {
            Header: "Date",
            accessor: "date",
        },
        {
            Header: "Team Members",
            accessor: "team",
            Cell: function ({row: {original}}) {
                console.log(original.teamMembers);

               return  original.teamMembers.map((member, index) =>
                   <div key={index} className={'mb-2'}>
                        <p>{member.name}</p>
                        <span>Time In: {member.timeIn}</span> <br />
                        <span>Time Out: {member.timeOut}</span>
                    </div>)
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

    function actionButtons(original){
        return (<div className={'flex justify-end'}>
            <button onClick={()=> {

            }} className={'mx-2 z-50'}>
                <UsersIcon className="h-5 w-5 text-slate-500" />
            </button>

            {/*<button className={'mx-2'}>*/}
            {/*    <Link href={`/shifts/members/${original._id}?title=${original.site.siteName} (${original.timeIn} - ${original.timeOut})`}>*/}
            {/*        <UsersIcon className="h-5 w-5 text-slate-500" />*/}
            {/*    </Link>*/}
            {/*</button>*/}
        </div>);
    }

    return (
        <div>
            <BreadCrumb
                headerTitle={'Upcoming Shifts/Client 5, teessass, (05:46 - 16:46)'}
                toolTip={<>
                    <select className={'mr-3 border-b border-solid rounded'}>
                        <option key={'upcoming shifts'}>Upcoming Shifts</option>
                        <option key={'archived shifts'}>Archived Shifts</option>
                    </select>
                    <DocumentIcon className="h-6 w-6 text-slate-500"/>
                </>}
            />
            <Table columns={columns2} apiResult={data2 ? data2 : []} />
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