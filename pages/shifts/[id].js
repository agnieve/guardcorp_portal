import {getSession} from "next-auth/react";
import {DocumentIcon} from "@heroicons/react/24/solid";
import BreadCrumb from "../../components/ui/breadcrumb";
import ShiftDetailList from "../../components/shifts/shift-detail-list";
import Link from "next/link";
import {useRouter} from "next/router";


export default function ShiftDetails(props) {

    const router = useRouter()
    const {id, title} = router.query;


    const data = [{
        _id: 1,
        date: '11/16/2022',
        presentMembers: [
            {
                _id: 1,
                name: 'AG',
                timeIn: '7:40'
            },
            {
                _id: 2,
                name: 'John',
                timeIn: '7:30'
            }
        ]
    },
        {
            _id: 2,
            date: '11/17/2022',
            presentMembers: [
                {
                    _id: 1,
                    name: 'AG',
                    timeIn: '7:40'
                },
            ]
        }];

    return (
        <div>
            <BreadCrumb
                headerTitle={
                    <>
                        <Link className={'no-underline text-slate-700 hover:font-medium'} href={'/shifts'}>Shifts</Link>
                        <span className={'text-slate-400'}>/{title}</span>
                    </>
                }
                toolTip={
                    <DocumentIcon className="h-6 w-6 text-slate-500"/>}
            />
            <ShiftDetailList data={data}/>
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