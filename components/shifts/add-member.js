import TeamMemberList from "./team-member-list";
import AddMemberForm from "./add-member-form";
import {ArrowLeftIcon} from "@heroicons/react/24/solid";
import {useQuery} from "@tanstack/react-query";
import {getAllClients} from "../../helpers/api-utils/clients";
import {getShiftMembers} from "../../helpers/api-utils/shifts";
import Loader from "../ui/loader";
import DeleteTeamMember from "./team-member-delete";
import {useState} from "react";

export default function AddMember(props) {

    const {form, site, setShowAddMember, session, shiftId} = props;

    const {isLoading, isError, data: shiftMembers, error} = useQuery({
        queryKey: ['shiftMembers'],
        queryFn: getShiftMembers.bind(this, session.user.accessToken, shiftId),
    });

    const [shiftMemberId, setShiftMemberId] = useState("");
    const [modalDelete, setModalDelete] = useState(false);
    const [member, setMember] = useState({});

    if (isLoading) {
        return <Loader/>
    }

    function modalDeleteHandler() {
        setModalDelete(prev => !prev);
    }

    return (
        <div className={'flex flex-col'}>
            <div className={'flex pt-2 mb-4 items-center space-x-2'}>
                <button onClick={setShowAddMember}>
                    <ArrowLeftIcon className="h-6 w-6 text-slate-500"/>
                </button>
                <h2>{site.siteName} : {form.timeIn} - {form.timeOut}</h2>
            </div>
            <div className={''}>
                <DeleteTeamMember
                    form={member}
                    openModal={modalDelete}
                    openModalHandler={modalDeleteHandler}
                    shiftMemberId={shiftMemberId}
                    session={session}
                />
                <AddMemberForm session={session} shiftId={shiftId}/>
                <TeamMemberList
                    openModalHandler={modalDeleteHandler}
                    setMember={setMember}
                    setShiftMemberId={setShiftMemberId}
                    shiftId={shiftId}
                    shiftMembers={shiftMembers}
                />
            </div>
        </div>
    )
}