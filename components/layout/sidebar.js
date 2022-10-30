import {sidebarContent} from "../../constants/sidebar";
import Link from "next/link";

export default function SideBar() {


    return (
        <div className={'w-1/6 bg-slate-500 p-5'}>
            {sidebarContent.length > -1 ?
                sidebarContent.map((sidebarHeader,index1) =>
                    <div key={index1}>
                        <h4 className={'text-white font-bold mb-5'}>{sidebarHeader.title}</h4>
                        {sidebarHeader.sidebars.length > -1 ?
                            <div className={'ml-5'}>
                                {
                                    sidebarHeader.sidebars.map((sidebarContent, index2) =>
                                        <div className={'flex mb-4'} key={index2}>
                                            {sidebarContent.icon ? <div className={'mr-5'}>
                                                {sidebarContent.icon}
                                            </div> : null}
                                            <Link className={'no-underline text-white hover:font-bold'}
                                                  href={sidebarContent.link}>
                                                {sidebarContent.label}
                                            </Link>
                                        </div>)
                                }
                            </div>
                            : null}
                    </div>
                ) : null}
        </div>
    );
}