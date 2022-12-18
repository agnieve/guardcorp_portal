import {useSession, signOut, getSession} from 'next-auth/react';
import {useState} from 'react';

export default function Profile() {
    const {data: session, status} = useSession();
    const [open, setOpen] = useState(false);

    function openHandler() {
        setOpen(prev => !prev)
    }

    if (status === "authenticated") {

        return (
            <div>
                <p>Guard Corp Portal: Ver. 1.0.0</p>
                <p>Signed in as {session.user.email}</p>
                <p>Link to Download the Mobile App: <a href="https://expo.dev/artifacts/eas/6bv5z8rr9Wa9uL11cbevLp.apk">GuardCorp App 1.0.0.apk</a></p>
                <small>Please be noted that the System is still on build.
                    There may be some changes on the UI or some screens and functions might not work.</small>
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