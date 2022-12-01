
import {getSession} from "next-auth/react";
import {useMemo, useState} from "react";
import BreadCrumb from "../../components/ui/breadcrumb";
import {CalendarDaysIcon} from "@heroicons/react/24/solid";
import List from "../../components/shifts/list";
import Form from "../../components/shifts/form";
import {useQuery} from "@tanstack/react-query";
import {getAllShifts} from "../../helpers/api-utils/shifts";
import Loader from "../../components/ui/loader";
import {getAllSites} from "../../helpers/api-utils/sites";
import AddMember from "../../components/shifts/add-member";
import Select from "react-dropdown-select";

export default function Shifts(props) {

    const {session} = props.pageProps;

    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        timeIn: '',
        timeOut: '',
        siteId: '',
        hTimeIn: '',
        hTimeOut: '',
    });
    const [shiftId, setShiftId] = useState(0);
    const [action, setAction] = useState('');
    const [showAddMember, setShowAddMember] = useState(false);
    const [site, setSite] = useState({});

    const {isFetching, data: shifts, error} = useQuery({
        queryKey: ['shifts'],
        queryFn: getAllShifts.bind(this, session.user.accessToken),
    });

    const {data: sites, isFetching:isFetchingSites} = useQuery({
        queryKey: ['sites'],
        queryFn: getAllSites.bind(this, session.user.accessToken),
    });

    function modalToggleHandler() {
        setShowModal(prev => !prev);
    }

    function addMemberHandler() {
        setShowAddMember(prev => !prev);
    }

    if (isFetching && isFetchingSites) {
        return <Loader />
    }

    return (
        <div className={''}>
            <BreadCrumb
                headerTitle={'Shifts'}
                toolTip={<button onClick={() => {
                    modalToggleHandler();
                    setAction('add');
                }}>
                    <CalendarDaysIcon className="h-6 w-6 text-slate-500"/>
                </button>}
            />
            <Form
                session={session}
                showModal={showModal}
                modalToggleHandler={modalToggleHandler}
                form={formData}
                setForm={setFormData}
                shiftId={shiftId}
                action={action}
            />

            <List
                setSite={setSite}
                sites={sites}
                data={shifts}
                session={session}
                setShiftId={setShiftId}
                setForm={setFormData}
                action={action}
                setAction={setAction}
                openModal={modalToggleHandler.bind(this, 'edit')}
                openMemberModal={addMemberHandler}
            />

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