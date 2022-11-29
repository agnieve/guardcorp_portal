import {useRouter} from "next/router";
import BreadCrumb from "../../../components/ui/breadcrumb";
import Link from "next/link";
import {UsersIcon} from "@heroicons/react/24/solid";
import AddMember from "../../../components/shifts/add-member";
import {useQuery} from "@tanstack/react-query";
import {getShiftMembers} from "../../../helpers/api-utils/shifts";
import {getSession} from "next-auth/react";
import DeleteTeamMember from "../../../components/shifts/team-member-delete";
import AddMemberForm from "../../../components/shifts/add-member-form";
import TeamMemberList from "../../../components/shifts/team-member-list";
import {useState} from "react";
import Loader from "../../../components/ui/loader";

export default function ShiftMembers(props) {


    const router = useRouter()
    const {id, title} = router.query;
    const {session} = props.pageProps;

    const {isLoading, isError, data: shiftMembers, error} = useQuery({
        queryKey: ['shiftMembers'],
        queryFn: getShiftMembers.bind(this, session?.user?.accessToken, id),
    });

    const [member, setMember] = useState({});
    const [shiftMemberId, setShiftMemberId] = useState("");
    const [modalDelete, setModalDelete] = useState(false);

    // if (isLoading) {
    //     return <Loader/>
    // }

    function modalDeleteHandler() {
        setModalDelete(prev => !prev);
    }

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
                    <UsersIcon className="h-6 w-6 text-slate-500"/>}
            />

            <DeleteTeamMember
                form={member}
                openModal={modalDelete}
                openModalHandler={modalDeleteHandler}
                shiftMemberId={shiftMemberId}
                session={session}
            />
            <AddMemberForm
                session={session}
                shiftId={id}
            />
            <TeamMemberList
                openModalHandler={modalDeleteHandler}
                setMember={setMember}
                setShiftMemberId={setShiftMemberId}
                shiftId={id}
                shiftMembers={shiftMembers}
            />

        </div>
    );
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