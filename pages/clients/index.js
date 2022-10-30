import {getSession, useSession} from "next-auth/react";
import {UserPlusIcon} from "@heroicons/react/24/solid";
import BreadCrumb from "../../components/ui/breadcrumb";
import {useEffect, useState} from "react";
import ClientForm from "../../components/clients/form";
import ClientList from "../../components/clients/list";
import {getAllClients} from "../../helpers/api-utils/clients";
import {clientsAtom} from "../../atoms/clientsAtom";
import {useAtom} from "jotai";

export default function Clients(){

    const {data: session, status} = useSession();
    const [openModal, setOpenModal] = useState(false);
    const [action, setAction] = useState('');
    const [actionSuccess, setActionSuccess] = useState(0);
    const [clientId, setClientId] = useState(0);
    const [clients, setClients] = useAtom(clientsAtom);
    const [form, setForm] = useState({
        name: '',
        address: '',
        email: '',
        mobilePhone: '',
    });

    useEffect(()=> {
        async function fetchData(){
            if(session){
                const res = await getAllClients(session.user.accessToken);
                if(res){
                    setClients(res);
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
            name: '',
            address: '',
            email: '',
            mobilePhone: '',
        });
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

            <ClientList
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