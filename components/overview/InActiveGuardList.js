import Table from "../ui/table";


export default function InActiveGuardList(props){

    const columns = [
        {
            Header: 'Guard',
            accessor: 'guard',
        },
    ];

    const data =[];

    return (
        <div className={'mt-10'}>
            <h1 className={'text-slate-700 mb-2'}>Inactive Members</h1>
            <Table columns={columns} apiResult={data} hiddenColumns={["lastName"]} />
        </div>
    )
}