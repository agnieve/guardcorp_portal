import {getSession, useSession} from "next-auth/react";
import {PlusIcon} from "@heroicons/react/24/solid";
import BreadCrumb from "../../components/ui/breadcrumb";
import {useState} from "react";
import SitesForm from "../../components/sites/form";
import {getAllSites} from "../../helpers/api-utils/sites";
import Loader from "../../components/ui/loader";
import {useQuery} from "@tanstack/react-query";
import DeleteModal from "../../components/sites/delete-modal";
import SiteList from "../../components/sites/list";

export default function Sites(props){

    const { session } = props.pageProps;

    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [action, setAction] = useState('');
    const [actionSuccess, setActionSuccess] = useState(0);
    const [siteId, setSiteId] = useState(0);

    const [form, setForm] = useState({
        siteName: '',
        address: '',
        clientId: '',
        latitude: '',
        longitude: '',
        complianceInformation: '',
    });

    const {isLoading, isError, data: sites, error} = useQuery({
        queryKey: ['sites'],
        queryFn: getAllSites.bind(this, session.user.accessToken),
    });

    function openModalHandler() {
        setOpenModal(prev => !prev);
    }

    function setOpenDeleteModalHandler(){
        setOpenDeleteModal(prev => !prev);
    }

    function clearFields(){
        setForm({
            siteName: '',
            address: '',
            clientId: '',
            latitude: '',
            longitude: '',
            complianceInformation: '',
        });
    }
    if (isLoading) {
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

            <DeleteModal
                siteId={siteId}
                session={session}
                form={form}
                openModal={openDeleteModal}
                openModalHandler={setOpenDeleteModalHandler}
            />

            <SitesForm
                session={session}
                form={form}
                setForm={setForm}
                action={action}
                openModal={openModal}
                openModalHandler={openModalHandler}
                setActionSuccess={setActionSuccess}
                siteId={siteId}
            />

            <SiteList
                setOpenDeleteModal={setOpenDeleteModalHandler}
                session={session}
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