import Modal from '../ui/modal';
import Input from '../ui/input';
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {deleteUser} from "../../helpers/api-utils/users";
import {useState} from "react";
import {deleteClient} from "../../helpers/api-utils/clients";

export default function DeleteModal(props) {

    const {openModal, openModalHandler, form, session, clientId} = props;
    const [confirm, setConfirm] = useState("");
    const [confirmError, setConfirmError] = useState(false);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data) => {
            return await deleteClient(data.header, data.clientId)
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['clients']);
            queryClient.refetchQueries('clients', {force: true});
        }
    });

    async function deleteClientHandler() {

        if (confirm === 'CONFIRM') {
            setConfirmError(false);

            if (session) {

                const data = {
                    header: session.user.accessToken,
                    clientId: clientId,
                }

                const result = await mutation.mutateAsync(data);

                try {
                    if (result) {
                        openModalHandler();
                        setConfirm("");
                    }
                } catch (error) {
                    console.log(error);
                }

            }
        } else {
            setConfirmError(true);
        }

    }

    return (<Modal open={openModal} setOpen={openModalHandler} width={'w-1/3'}>
        <div className={'flex flex-col'}>
            <div className={'mx-5'}>
                <h1 className={'my-5 text-slate-500'}>Delete <span
                    className={'text-slate-700'}>{form.name}</span>?</h1>
                {confirmError &&
                    <p className={'mb-2 px-2 bg-red-400 rounded-lg text-white'}>Please type the exact word case
                        sensitive</p>}
                <Input
                    label={'Type CONFIRM to delete client'}
                    inputBold={true}
                    withButton={true}
                    value={confirm}
                    setValue={(e) => setConfirm(e.target.value)}
                />
                <div className={'bg-slate-200 p-2 rounded-lg'}>
                        <span className={'text-sm text-slate-500'}>Please take precaution. This user will no longer be available once it was deleted.
                    If you mistakenly deleted a user, please contact our IT Support immediately.</span>
                </div>
            </div>
            <div className={'flex justify-end px-4 mt-8'}>
                <button type={'button'} className={'pl-6 py-2'} onClick={openModalHandler}>Close</button>
                <button type={'button'}
                        onClick={deleteClientHandler}
                        className={'pl-6 py-2 text-red-500 font-bold rounded-lg text-blue-500'}>Delete
                </button>
            </div>
        </div>
    </Modal>)
}