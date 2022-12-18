import {DocumentIcon, UsersIcon} from "@heroicons/react/24/solid";
import BreadCrumb from "../ui/breadcrumb";
import Table from "../ui/table";


export default function UpcomingComp(){

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
            <Table columns={columns2} apiResult={data2 ? data2 : []} />
        </div>
    )
}