import {getSession} from "next-auth/react";

export default function Overview(){

    return(
        <div className={'h-96 flex justify-center items-center'}>
            <h1>Overview Screen</h1>
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