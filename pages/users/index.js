import BreadCrumb from "../../components/ui/breadcrumb";
import {UserPlusIcon} from '@heroicons/react/24/solid';
import {useEffect, useState} from "react";
import UserForm from "../../components/users/form";
import UserList from "../../components/users/list";
import {getAllUsers} from "../../helpers/api-utils/users";
import Loader from "../../components/ui/loader";
import {useQuery} from '@tanstack/react-query';
import {getSession} from "next-auth/react";
import DeleteModal from "../../components/users/delete-modal";

export default function Users(props) {

    const { session } = props.pageProps;

    const [openModal, setOpenModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [action, setAction] = useState('');
    const [userId, setUserId] = useState(0);

    const [form, setForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobilePhone: '',
        password: '',
        confirmPassword: '',
        company: '',
        role: '',
        licenseNumber: '',
        profilePicture: '',
    });

    const {isLoading, isError, data: users, error} = useQuery({
        queryKey: ['users'],
        queryFn: getAllUsers.bind(this, session.user.accessToken),
    });

    function openModalHandler() {
        setOpenModal(prev => !prev);
    }

    function setOpenDeleteModalHandler(){
        setOpenDeleteModal(prev => !prev);
    }

    function clearFields() {
        setForm({
            firstName: '',
            lastName: '',
            email: '',
            mobilePhone: '',
            password: '',
            confirmPassword: '',
            company: '',
            role: '',
            licenseNumber: '',
            profilePicture:''
        });
    }

    // if (isLoading) {
    //     return <div>
    //         <Loader/>
    //     </div>
    // }

    if (isError) {
        return <span>Error: {error.message}</span>
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

            <DeleteModal
                userId={userId}
                session={session}
                form={form}
                openModal={openDeleteModal}
                openModalHandler={setOpenDeleteModalHandler}
            />

            <UserForm
                form={form}
                setForm={setForm}
                action={action}
                openModal={openModal}
                openModalHandler={openModalHandler}
                userId={userId}
            />

            <UserList
                setOpenDeleteModal={setOpenDeleteModalHandler}
                users={users}
                form={form}
                setForm={setForm}
                action={action}
                setAction={setAction}
                openModal={openModalHandler.bind(this, 'edit')}
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