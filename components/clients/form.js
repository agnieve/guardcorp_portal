import Modal from "../ui/modal";
import Input from "../ui/input";
import {formSettings} from "../../constants/client";
import {createClient, updateClient} from "../../helpers/api-utils/clients";
import {useSession} from "next-auth/react";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {createUser, updateUser} from "../../helpers/api-utils/users";

export default function ClientForm(props) {

    const {openModal, openModalHandler, action, form, setForm, clientId} = props;
    const {data: session, status} = useSession();

    function setValueHandler(field, newVal) {
        setForm(prevState => {
            let formState = {...prevState};
            console.log(formState[field]);
            formState[field] = newVal;
            return formState;
        });
    }

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data) => {
            if (data.type === 'add') {
                return await createClient(data.body, data.header)
            } else {
                return await updateClient(data.clientId, data.body, data.header)
            }
        },
        onSuccess: ()=> {
            queryClient.invalidateQueries(['clients']);
            queryClient.refetchQueries('clients', {force: true});
        }
    });

    async function submitHandler(e) {
        e.preventDefault();

        if (session) {

            const data = {
                body: form,
                header: session.user.accessToken,
                clientId: clientId,
                type: action
            }

            const result = await mutation.mutateAsync(data);

            try{
                if(result){
                    openModalHandler();
                }
            }catch(error){
                console.log(error);
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
                                withButton={true}
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