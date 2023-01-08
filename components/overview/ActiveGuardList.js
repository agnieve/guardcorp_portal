import Table from "../ui/table";


export default function ActiveGuardList(props){

    const {data} = props;
    const columns = [
        {
            Header: 'Guard',
            accessor: '_id.user.fullName',
        },
        {
            Header: "Site",
            accessor: "_id.site.siteName",
        },
        {
            Header: 'Address',
            accessor: '_id.site.address',
        },
        {
            Header: 'Logged In',
            accessor: '_id.start',
            Cell: function ({row: {original}}) {
                return <p>{new Date(original._id.start).toLocaleDateString()}</p>
            }
        },

    ];

    return (
        <div className={'mt-10'}>
            <h1 className={'text-slate-700 mb-2'}>Active Members</h1>
            <Table columns={columns} apiResult={data ? data : []} hiddenColumns={["lastName"]} />
        </div>
    )
}