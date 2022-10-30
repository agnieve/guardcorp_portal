import Modal from "../ui/modal";
import Input from "../ui/input";
import {formSettings} from "../../constants/client";
import {createClient, updateClient} from "../../helpers/api-utils/clients";
import {useSession} from "next-auth/react";

export default function ClientForm(props) {

    const {setActionSuccess, openModal, openModalHandler, action, form, setForm, clientId} = props;
    const {data: session, status} = useSession();

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
                    result = await createClient(form, token);
                    if (result) {
                        setActionSuccess(prev => prev + 1)
                        openModalHandler();
                    }
                    break;
                case 'edit':
                    result = await updateClient(clientId, form, token);
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
        <div className={'flex flex-col'}>
            <div className={'flex px-2 pt-2'}>
                <h2>{action === 'add' ? 'New Client' : 'Edit Client'}</h2>
            </div>

            <form onSubmit={submitHandler} className={'px-4 pt-4'}>
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
                <div className={'flex justify-end mt-8'}>
                    <button type={'button'} className={'pl-6 py-2'} onClick={openModalHandler}>Close</button>
                    <button type={'submit'} className={'pl-6 py-2 text-blue-500 font-bold rounded-lg text-blue-500'}>Save
                    </button>
                </div>
            </form>
        </div>
    </Modal>);
}