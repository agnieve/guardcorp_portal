import BreadCrumb from "../../components/ui/breadcrumb";
import {UserPlusIcon} from '@heroicons/react/24/solid';
import {useEffect, useState} from "react";
import UserForm from "../../components/users/form";
import {getSession, useSession} from "next-auth/react";
import UserList from "../../components/users/list";
import {getAllUsers} from "../../helpers/api-utils/users";
import Loader from "../../components/ui/loader";

export default function Users(props) {

    const {data: session, status} = useSession();
    const [openModal, setOpenModal] = useState(false);
    const [action, setAction] = useState('');
    const [actionSuccess, setActionSuccess] = useState(0);
    const [userId, setUserId] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobilePhone: '',
        password: '',
        confirmPassword: '',
        company: '',
        role: ''
    });

    const [users, setUsers] = useState([]);

    useEffect(()=> {


        async function fetchData(){
            if(session){
                setIsLoading(true);

                const res = await getAllUsers(session.user.accessToken);

                setIsLoading(false);

                if(res){
                    setUsers(res);
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
            firstName: '',
            lastName: '',
            email: '',
            mobilePhone: '',
            password: '',
            confirmPassword: '',
            company: '',
            role: ''
        });
    }

    if(isLoading){
        return <Loader />
    }

    return (
        <div className={''}>

            <BreadCrumb
                headerTitle={'Users'}
                toolTip={<button onClick={() => {
                    openModalHandler()
                    setAction('add');
                    clearFields();
                }}>
                    <UserPlusIcon className="h-6 w-6 text-slate-500"/>
                </button>}
            />

            <UserForm
                form={form}
                setForm={setForm}
                action={action}
                openModal={openModal}
                openModalHandler={openModalHandler}
                setActionSuccess={setActionSuccess}
                userId={userId}
            />

            <UserList
                users={users}
                form={form}
                setForm={setForm}
                action={action}
                setAction={setAction}
                openModal={openModalHandler.bind(this, 'edit')}
                actionSuccess={actionSuccess}
                setUserId={setUserId}
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