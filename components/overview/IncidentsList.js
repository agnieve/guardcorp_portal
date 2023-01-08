import Table from "../ui/table";


export default function IncidentsList(props){

    const { data } = props;

    const columns = [
        {
            Header: 'Date/Time',
            accessor: 'date',
            Cell: function ({row: {original}}) {
                return new Date(original.date).toLocaleDateString();
            }
        },
        {
            Header: "Site",
            accessor: "site",
            Cell: function ({row: {original}}) {
                return original.eventDetails[0].site.siteName;
            }
        },
        {
            Header: "Team Member",
            accessor: "teamMember",
            Cell: function ({row: {original}}) {
                return original.eventDetails[0].user.firstName + " " + original.eventDetails[0].user.lastName;
            }
        },
        {
            Header: 'Type',
            accessor: 'type',
        },
        {
            Header: 'Note/Description',
            accessor: 'notes',
        },

    ];

    return (
        <div className={'mt-10'}>
            <h1 className={'text-slate-700 mb-2'}>Incidents</h1>
            <Table columns={columns} apiResult={data} hiddenColumns={["lastName"]} />
        </div>
    )
}