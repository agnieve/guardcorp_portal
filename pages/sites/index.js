import {getSession, useSession} from "next-auth/react";
import {PlusIcon} from "@heroicons/react/24/solid";
import BreadCrumb from "../../components/ui/breadcrumb";
import {useEffect, useState} from "react";
import {getAllUsers} from "../../helpers/api-utils/users";
import SitesForm from "../../components/sites/form";
import UserList from "../../components/sites/list";
import {getAllSites} from "../../helpers/api-utils/sites";
import Loader from "../../components/ui/loader";

export default function Sites(){

    const {data: session, status} = useSession();
    const [openModal, setOpenModal] = useState(false);
    const [action, setAction] = useState('');
    const [actionSuccess, setActionSuccess] = useState(0);
    const [siteId, setSiteId] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        siteName: '',
        address: '',
        clientId: '',
        latitude: '',
        longitude: '',
        complianceInformation: '',
        shiftStart: '',
        shiftEnd: ''
    });

    const [sites, setSites] = useState([]);

    useEffect(()=> {
        async function fetchData(){
            if(session){
                setIsLoading(true);

                const res = await getAllSites(session.user.accessToken);

                setIsLoading(false);

                if(res){
                    setSites(res);
                }
            }
        }
        fetchData().then(r => null);
    },[actionSuccess]);

    function openModalHandler() {
        setOpenModal(prev => !prev);
    }

    function clearFields(){
        setForm({
            siteName: '',
            address: '',
            clientId: '',
            latitude: '',
            longitude: '',
            complianceInformation: '',
            shiftStart: '',
            shiftEnd: ''
        });
    }

    if(isLoading){
        return <Loader />
    }

    return(
        <div className={''}>
            <BreadCrumb
                headerTitle={'Sites'}
                toolTip={<button onClick={() => {
                    openModalHandler()
                    setAction('add');
                    clearFields();
                }}>
                    <PlusIcon className="h-6 w-6 text-slate-500"/>
                </button>}
            />

            <SitesForm
                form={form}
                setForm={setForm}
                action={action}
                openModal={openModal}
                openModalHandler={openModalHandler}
                setActionSuccess={setActionSuccess}
                siteId={siteId}
            />

            <UserList
                sites={sites}
                form={form}
                setForm={setForm}
                action={action}
                setAction={setAction}
                openModal={openModalHandler.bind(this, 'edit')}
                actionSuccess={actionSuccess}
                setSiteId={setSiteId}
            />
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession({req: context.req});

    if(!session){
        return {
            redirect : {
                destination: '/',
                permanent: false
            }
        };
    }

    return {
        props: { session },
    }
}