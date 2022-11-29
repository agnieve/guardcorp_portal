import {getSession} from "next-auth/react";
import {UserPlusIcon} from "@heroicons/react/24/solid";
import BreadCrumb from "../../components/ui/breadcrumb";
import ClientForm from "../../components/clients/form";
import DeleteModal from "../../components/clients/delete-modal";
import ClientList from "../../components/clients/list";
import {getAllClients} from "../../helpers/api-utils/clients";
import {useQuery} from '@tanstack/react-query';

import Loader from "../../components/ui/loader";
import {useState} from "react";

export default function Clients(props){

    const { session } = props.pageProps;
    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [action, setAction] = useState('');
    const [actionSuccess, setActionSuccess] = useState(0);
    const [clientId, setClientId] = useState(0);

    const [form, setForm] = useState({
        name: '',
        address: '',
        email: '',
        mobilePhone: '',
    });

    const {isLoading, isError, data: clients, error} = useQuery({
        queryKey: ['clients'],
        queryFn: getAllClients.bind(this, session.user.accessToken),
    });

    function openModalHandler() {
        setOpenModal(prev => !prev);
    }

    function clearFields(){
        setForm({
            name: '',
            address: '',
            email: '',
            mobilePhone: '',
        });
    }

    function setOpenDeleteModalHandler(){
        setOpenDeleteModal(prev => !prev);
    }

    if (isLoading) {
        return null
    }

    return(
        <div className={''}>
            <BreadCrumb
                headerTitle={'Clients'}
                toolTip={<button onClick={() => {
                    openModalHandler()
                    setAction('add');
                    clearFields();
                }}>
                    <UserPlusIcon className="h-6 w-6 text-slate-500"/>
                </button>}
            />
            <ClientForm
                form={form}
                setForm={setForm}
                action={action}
                openModal={openModal}
                openModalHandler={openModalHandler}
                setActionSuccess={setActionSuccess}
                clientId={clientId}
            />

            <DeleteModal
                clientId={clientId}
                session={session}
                form={form}
                openModal={openDeleteModal}
                openModalHandler={setOpenDeleteModalHandler}
            />

            <ClientList
                setOpenDeleteModal={setOpenDeleteModalHandler}
                clients={clients}
                form={form}
                setForm={setForm}
                action={action}
                setAction={setAction}
                openModal={openModalHandler.bind(this, 'edit')}
                actionSuccess={actionSuccess}
                setClientId={setClientId}
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