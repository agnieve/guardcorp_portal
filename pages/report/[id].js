'use client';

import {downloadDocument} from "../../components/shifts/shift-detail-print";
import {useRouter} from "next/router";
import Image from "next/image";
import {useQuery} from "@tanstack/react-query";
import Loader from "../../components/ui/loader";
import {getEvent} from "../../helpers/api-utils/events";
import {useEffect, useState} from "react";


export default function ReportDownload(props) {

    const router = useRouter()
    const {id} = router.query;

    const {isLoading, refetch, data, error} = useQuery({
        queryKey: ['report'],
        queryFn: getEvent.bind(this, id),
        enabled: false
    });

    if(router.isReady){
        (async () => {
            await refetch();
        })();
    }

    if (isLoading && !router.isReady) {
        return <Loader/>
    }

    console.log(data);

    return (
        <div className={'flex flex-col justify-center items-center h-96'}>
            <Image src={'/guardcorp_logo.png'} width={100} height={100} alt={'logo'}/>
            <h1>Download Report</h1>
            {id}
            <h2 className={'my-5'}>{data?.event?.start}</h2>
            <button onClick={downloadDocument.bind(this, data)}
                    className={'bg-blue-600 text-white px-3 py-2 rounded-lg '}>Click to Download
            </button>
        </div>
    );
}