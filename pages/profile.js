import {useSession, signOut, getSession} from 'next-auth/react';
import Modal from "../components/ui/modal";
import { useState } from 'react';

export default function Profile() {
    const { data: session, status } = useSession();
    const [open, setOpen] = useState(false);

    function openHandler(){
        setOpen(prev => !prev)
    }

    if (status === "authenticated") {

        return (
            <div>
                <Modal open={open} setOpen={openHandler}>
                    <h1>Hi Test</h1>
                    <button onClick={openHandler}>Close</button>
                </Modal>
                <p>Signed in as {session.user.email}</p>
                <button onClick={() => signOut()}>Sign out</button> <br />
                <button onClick={openHandler}>Open Modal</button>
            </div>
        )
    }

    return (
        <div>
            <h1>Not Signed in</h1>
        </div>
    );
};

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