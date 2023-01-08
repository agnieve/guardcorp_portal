import Modal from "../ui/modal";
import Schedule from "./schedule";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getAllSites} from "../../helpers/api-utils/sites";
import Loader from "../ui/loader";
import {createShift, updateShift} from "../../helpers/api-utils/shifts";
import CircleButton from "./circle-button";
import {useState} from "react";

export default function Form(props) {

    const {showModal, modalToggleHandler, action, setForm, form, session, shiftId} = props;
    const [repeatEveryCount, setRepeatEveryCount] = useState(1);
    const [repeatEvery, setRepeatEvery] = useState("");
    const [su, setSu] = useState(false);
    const [m, setM] = useState(false);
    const [t, setT] = useState(false);
    const [w, setW] = useState(false);
    const [th, setTh] = useState(false);
    const [f, setF] = useState(false);
    const [s, setS] = useState(false);
    const [ends, setEnds] = useState("Never");
    const [endDate, setEndDate] = useState("");

    function setValueHandler(field, newVal) {
        setForm(prevState => {
            let formState = {...prevState};
            formState[field] = newVal;
            return formState;
        });
    }

    const {isFetching, isError, data: sites, error} = useQuery({
        queryKey: ['sites'],
        queryFn: getAllSites.bind(this, session.user.accessToken),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data) => {
            if (data.type === 'add') {
                return await createShift(data.body, data.header)
            } else {
                return await updateShift(data.shiftId, data.body, data.header)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['shifts']);
            queryClient.refetchQueries('shifts', {force: true});
        }
    });

    async function formHandler(e) {
        e.preventDefault();

        if (session) {


            let daysArr = [];
            if (su) daysArr.push('su');
            if (m) daysArr.push('m');
            if (t) daysArr.push('t');
            if (w) daysArr.push('w');
            if (th) daysArr.push('th');
            if (f) daysArr.push('f');
            if (s) daysArr.push('s');

            const now = new Date();

            const recursionData = {
                recursion:
                    {
                        repeatEvery: repeatEvery,
                        repeatEveryCount: repeatEveryCount,
                        days: daysArr,
                        ends: ends,
                        startDate: now,
                        endDate: endDate
                    }
            }

            const data = {
                body: {...form, ...recursionData},
                header: session.user.accessToken,
                shiftId: shiftId,
                type: action
            }

            const result = await mutation.mutateAsync(data);

            try {
                if (result) {
                    modalToggleHandler();
                }
            } catch (error) {
                console.log(error);
            }

        }
    }

    if (isFetching) {
        return null;
    }

    return (
        <Modal open={showModal} setOpen={modalToggleHandler}>
            <div className={'flex flex-col'}>
                <div className={'flex pt-2 mb-4 px-2'}>
                    <h2>{action === 'add' ? 'New Shift' : 'Edit Shift'}</h2>
                </div>
                <form onSubmit={formHandler}>
                    <div className={'px-2'}>
                        <select className={'w-full px-4 py-2 border-2 border-slate-300 rounded'}
                                name="site"
                                id="site"
                                value={form['siteId']}
                                onChange={(e) => setValueHandler('siteId', e.target.value)}
                        >
                            <option value="" disabled>Select Site</option>
                            {sites.map(site => <option key={site._id} value={site._id}>{site.siteName}</option>)}
                        </select>
                        <Schedule
                            title={'Daily Schedule'}
                            timeIn={form['timeIn']}
                            setTimeIn={setValueHandler}
                            timeOut={form['timeOut']}
                            setTimeOut={setValueHandler}
                            type={'daily'}
                        />
                        <Schedule
                            title={'Holiday Schedule'}
                            timeIn={form['hTimeIn']}
                            setTimeIn={setValueHandler}
                            timeOut={form['hTimeOut']}
                            setTimeOut={setValueHandler}
                            type={'holiday'}
                        />

                        <h4 className={'text-left mb-2 text-lg px-2'}>Custom recurrence</h4>
                        <div className={'px-2 mt-3'}>
                            <div className={'flex items-center'}>
                                <span className={'mr-2'}>Repeat every</span>
                                <input min={1} type={'number'} value={repeatEveryCount}
                                       onChange={(e) => setRepeatEveryCount(e.target.value)}
                                       className={'p-2 bg-slate-100 rounded-lg mr-2'}/>
                                <select value={repeatEvery} onChange={(e) => setRepeatEvery(e.target.value)}
                                        className={'p-2 bg-slate-100 rounded-lg mr-2'}>
                                    <option value={'days'}>days</option>
                                    <option value={'weeks'}>weeks</option>
                                </select>
                            </div>
                        </div>
                        {
                            repeatEvery === 'weeks' && <>
                                <span className={'flex mx-2'}>Repeat On</span>
                                <div className="flex space-x-2 px-2">
                                    <CircleButton title={'S'} onClick={() => setSu(prev => !prev)} isSelected={su}/>
                                    <CircleButton title={'M'} onClick={() => setM(prev => !prev)} isSelected={m}/>
                                    <CircleButton title={'T'} onClick={() => setT(prev => !prev)} isSelected={t}/>
                                    <CircleButton title={'W'} onClick={() => setW(prev => !prev)} isSelected={w}/>
                                    <CircleButton title={'T'} onClick={() => setTh(prev => !prev)} isSelected={th}/>
                                    <CircleButton title={'F'} onClick={() => setF(prev => !prev)} isSelected={f}/>
                                    <CircleButton title={'S'} onClick={() => setS(prev => !prev)} isSelected={s}/>
                                </div>
                            </>
                        }
                        <div className="flex items-center mt-2">
                            <span className={'text-left mb-2 px-2'}>Ends</span>
                            <select onChange={(e) => setEnds(e.target.value)}
                                    className={'p-2 bg-slate-100 rounded-lg mr-2'}>
                                <option value={'Never'}>Never</option>
                                <option value={'On'}>On</option>
                            </select>
                            {
                                ends === 'On' ?
                                    <input type={'date'} value={endDate} onChange={(e) => setEndDate(e.target.value)}
                                           className={'p-2 bg-slate-100'}/> : null
                            }
                        </div>


                    </div>
                    <div className={'flex justify-end mt-8 mx-4'}>
                        <button type={'button'} className={'pl-6 py-2'} onClick={modalToggleHandler}>Close</button>
                        <button type={'submit'}
                                className={'pl-6 py-2 text-blue-500 font-bold rounded-lg text-blue-500'}>Save
                        </button>
                    </div>
                </form>
            </div>
        </Modal>
    )
}