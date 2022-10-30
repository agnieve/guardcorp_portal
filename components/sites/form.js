import Modal from "../ui/modal";
import Input from "../ui/input";
import {formSettings} from "../../constants/site";
import {useSession} from "next-auth/react";
import {useAtom} from "jotai";
import {clientsAtom} from "../../atoms/clientsAtom";
import {useEffect} from "react";
import {getAllClients} from "../../helpers/api-utils/clients";
import {createSite, updateSite} from "../../helpers/api-utils/sites";

export default function SitesForm(props) {

    const {setActionSuccess, openModal, openModalHandler, action, form, setForm, siteId} = props;
    const {data: session, status} = useSession();
    const [clients, setClients] = useAtom(clientsAtom);

    useEffect(() => {
        async function fetchClientsData() {
            if (session) {
                const res = await getAllClients(session.user.accessToken);
                if (res) {
                    setClients(res);
                }
            }
        }

        fetchClientsData().then(r => null);
    }, []);

    function setValueHandler(field, newVal) {
        setForm(prevState => {
            let formState = {...prevState};
            console.log(formState[field]);
            formState[field] = newVal;
            return formState;
        });
    }

    async function submitHandler(e) {
        e.preventDefault();

        if (session) {
            const token = session.user.accessToken;
            let result;
            switch (action) {
                case 'add':
                    result = await createSite(form, token);
                    if (result) {
                        setActionSuccess(prev => prev + 1)
                        openModalHandler();
                    }
                    break;
                case 'edit':
                    result = await updateSite(siteId, form, token);
                    if (result) {
                        if (result.modifiedCount === 1) {
                            setActionSuccess(prev => prev + 1)
                            openModalHandler();
                        }
                    }
                    break;
            }

        }
    }

    return (<Modal open={openModal} setOpen={openModalHandler}>
        <div className={'flex flex-col h-96 overflow-y-auto'}>
            <div className={'flex px-2 pt-2'}>
                <h2>{action === 'add' ? 'New Site' : 'Edit Site'}</h2>
            </div>

            <form onSubmit={submitHandler} className={'px-4 pt-4'}>
                <div className={'flex space-x-4'}>
                    <div className={'w-1/2'}>
                        {
                            formSettings.length > -1 ?
                                formSettings.map((set, index) =>
                                    <Input
                                        key={index}
                                        label={set.label}
                                        name={set.name}
                                        value={form[set.name]}
                                        type={set.type}
                                        setValue={(e) => setValueHandler(set.name, e.target.value)}
                                    />) : null
                        }
                        <div>
                            <select value={form.role}
                                    onChange={(e) => setValueHandler('clientId', e.target.value)}
                                    className={'w-full py-2 border-b border-slate-400 focus:outline-none'}>
                                <option value="" disabled>Select Client</option>
                                {clients.map((client) => <option key={client._id} value={client._id}>{client.name}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className={'w-1/2 flex flex-col justify-start'}>
                        <label className={'text-slate-400 text-left'} htmlFor="complianceInformation">
                            Compliance Information</label>
                        <textarea id={'complianceInformation'} rows={12}
                                  className={'w-full border-b border-slate-400 focus:outline-none'}
                                  value={form.complianceInformation}
                                  onChange={(e) => setValueHandler('complianceInformation', e.target.value)}>
                        </textarea>
                    </div>
                </div>
                <div className="w-full mt-3">
                    <h4 className={'text-left mb-2 text-lg'}>Schedule</h4>
                    <div className={'flex justify-start space-x-4'}>
                        <div>
                            <label htmlFor="shiftStart" className={'mr-4 text-slate-400'}>Shift Start</label>
                            <input value={form.shiftStart}
                                   className={'border-b border-slate-400'}
                                   id={'shiftStart'}
                                   type={'time'}
                                   onChange={(e) => setValueHandler('shiftStart', e.target.value)}
                            />
                        </div>
                        <div>
                            <label htmlFor="shiftEnd" className={'mr-4 text-slate-400'}>Shift End</label>
                            <input value={form.shiftEnd}
                                   className={'border-b border-slate-400'}
                                   id={'shiftEnd'}
                                   type={'time'}
                                   onChange={(e) => {setValueHandler('shiftEnd', e.target.value)}}
                            />
                        </div>
                    </div>
                </div>
                <div className={'flex justify-end mt-8'}>
                    <button type={'button'} className={'pl-6 py-2'} onClick={openModalHandler}>Close</button>
                    <button type={'submit'} className={'pl-6 py-2 text-blue-500 font-bold rounded-lg text-blue-500'}>Save
                    </button>
                </div>
            </form>
        </div>
    </Modal>);
}