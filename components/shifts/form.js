import Modal from "../ui/modal";
import Schedule from "./schedule";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getAllSites} from "../../helpers/api-utils/sites";
import Loader from "../ui/loader";
import {createShift, updateShift} from "../../helpers/api-utils/shifts";

export default function Form(props) {

    const {showModal, modalToggleHandler, action, setForm, form, session, shiftId} = props;

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
        onSuccess: ()=> {
            queryClient.invalidateQueries(['shifts']);
            queryClient.refetchQueries('shifts', {force: true});
        }
    });

    async function formHandler(e){
        e.preventDefault();

        if (session) {

            const data = {
                body: form,
                header: session.user.accessToken,
                shiftId: shiftId,
                type: action
            }

            const result = await mutation.mutateAsync(data);

            try{
                if(result){
                    modalToggleHandler();
                }
            }catch(error){
                console.log(error);
            }

        }
    }

    if(isFetching){
        return <Loader />
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
                                onChange={(e)=> setValueHandler('siteId', e.target.value)}
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