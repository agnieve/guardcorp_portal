import Table from "../ui/table";


export default function AlertsList(props){

    const { data } = props;

    console.log(data);

    const columns = [
        {
            Header: 'Date/Time',
            accessor: 'dateTime',
            Cell: function ({row: {original}}) {
                return new Date(original.dateTime).toLocaleDateString();
            }
        },

        {
            Header: 'Alert Type',
            accessor: 'status',
        },
        {
            Header: "Team Member",
            accessor: "action",
            Cell: function ({row: {original}}) {
                return original.events.user.firstName + " " + original.events.user.lastName;
            }
        }

    ];

    return (
        <div className={'mt-10'}>
            <h1 className={'text-slate-700 mb-2'}>Alerts</h1>
            <Table columns={columns} apiResult={data} />
        </div>
    )
}