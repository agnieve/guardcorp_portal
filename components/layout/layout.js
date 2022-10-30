import {useSession} from 'next-auth/react';
import Loader from "../ui/loader";
import Navbar from "./navbar";
import SideBar from "./sidebar";

export default function Layout(props) {
    const {data: session, status} = useSession();

    return (
        <div>
            {session ?
                <div className="relative h-screen">
                    <Navbar/>
                    <div className={'flex h-[90.2vh] 2xl:h-screen'}>
                        <SideBar/>
                        <div className={'w-5/6 p-10 h-[90.2vh] 2xl:h-screen overflow-y-auto'}>
                            {props.children}
                        </div>
                    </div>
                </div> : props.children}
        </div>
    )
}