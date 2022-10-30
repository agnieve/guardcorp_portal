import Head from 'next/head';
import {useState} from "react";
import {getSession, signIn} from "next-auth/react";
import { useRouter } from "next/router";
import Input from '../components/ui/input';
import Image from "next/image";

export default function Home() {

    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function login(e){
        e.preventDefault();
        const result = await signIn('credentials', {
            redirect: false,
            email: email,
            password: password
        });

        if(!result.error)
        {
            await router.replace('/profile');
        }
    }
    return (
        <div className={'bg-slate-600 flex flex-col items-center h-screen'}>
            <div className={'mt-20 flex flex-col items-center w-full'}>
                <Image width={110} height={110} src={'/guardcorp_logo.png'} alt={'guardcorp logo'} />
                <form className={'mt-10 w-1/5 flex flex-col px-4 py-8 bg-white'} onSubmit={login}>

                    <Input
                        bg={'bg-slate-100'}
                        label={'Email'}
                        type={'email'}
                        name={'email'}
                        value={email}
                        setValue={(e)=> setEmail(e.target.value)}
                    />
                    <Input
                        bg={'bg-slate-100'}
                        label={'Password'}
                        type={'password'}
                        name={'password'}
                        value={password}
                        setValue={(e)=> setPassword(e.target.value)}
                    />
                    <button type={'submit'}
                            className={'border bg-blue-700 px-3 py-1 text-white rounded-lg'}
                    >Login</button>
                </form>
            </div>
        </div>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession({req: context.req});

    if (session) {
        return {
            redirect: {
                destination: '/profile',
                permanent: false
            }
        };
    }

    return {
        props: {session},
    }
}
