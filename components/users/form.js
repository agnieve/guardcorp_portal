import Modal from "../ui/modal";
import Input from "../ui/input";
import {formSettings} from "../../constants/user";
import {createUser, updateUser, uploadUserPicture} from "../../helpers/api-utils/users";
import {useSession} from "next-auth/react";
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {PencilIcon} from "@heroicons/react/24/solid";
import {UserPlusIcon} from "@heroicons/react/24/outline";
import {useState} from "react";
import Image from "next/image";


export default function UserForm(props) {

    const {openModal, openModalHandler, action, form, setForm, userId} = props;
    const {data: session, status} = useSession();
    const [takenPicture, setTakenPicture] = useState();

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data) => {
            if (data.type === 'add') {
                return await createUser(data.body, data.header)
            } else {
                return await updateUser(data.userId, data.body, data.header)
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            queryClient.refetchQueries('users', {force: true});
        }
    });

    function setValueHandler(field, newVal) {
        setForm(prevState => {
            let formState = {...prevState};
            formState[field] = newVal;
            return formState;
        });
    }

    async function submitHandler(e) {

        e.preventDefault();

        if (session) {

            let formMerged;

            if(takenPicture){

                const uploadResult = await uploadUserPicture(takenPicture);

                if (!uploadResult) {
                    throw new Error('Uploading Image error');
                }

                setValueHandler('profilePicture', uploadResult?.data.display_url);

                formMerged = {
                    ...form, ...{
                        profilePicture: uploadResult?.data.display_url
                    }
                }
            }else{
                formMerged = form;
            }

            const data = {
                body: formMerged,
                header: session.user.accessToken,
                userId: userId,
                type: action
            }

            const result = await mutation.mutateAsync(data);


            try {
                if (result) {
                    openModalHandler();
                }
            } catch (error) {
                console.log(error);
            }

        }
    }

    return (<Modal open={openModal} setOpen={openModalHandler}>
        <div className={'flex flex-col'}>
            <div className={'flex px-2 pt-2'}>
                <h2>{action === 'add' ? 'New User' : 'Edit User'}</h2>
            </div>
            <div className={'flex justify-center'}>
                {
                    form['profilePicture'] === '' ?
                        <button className={'rounded-full bg-slate-500 p-3'} onClick={() => {
                            document.getElementById('fileid').click();
                        }}>
                            <UserPlusIcon className="h-8 w-8 text-slate-100"/>
                        </button>:
                        <div className={'relative '}>
                            <div className="w-20 h-20 bg-slate-100 rounded-full overflow-hidden">
                                <Image fill={true} style={{borderRadius:100}} src={form['profilePicture']}  alt="Picture of user" />
                            </div>
                            <button className={'rounded-full bg-slate-500 p-1 absolute top-2 right-0'} onClick={() => {
                                document.getElementById('fileid').click();
                            }}>
                                <PencilIcon className="h-3 w-3 text-slate-100"/>
                            </button>
                        </div>
                }
            </div>
            <form onSubmit={submitHandler} className={'px-4 pt-4'}>
                <input onChange={(e) => {
                    setTakenPicture(e.target.files[0])
                }} id={'fileid'} type={'file'} hidden/>
                {
                    formSettings.length > -1 ?
                        formSettings.map((set, index) =>
                            action == 'edit' && set.name == 'password' ? null : <Input
                                key={index}
                                label={set.label}
                                name={set.name}
                                value={form[set.name]}
                                type={set.type}
                                withButton={true}
                                setValue={(e) => setValueHandler(set.name, e.target.value)}
                            />) : null
                }
                {form.role === 'guard' &&
                    <>
                        <Input
                            label={'License Number'}
                            name={'licenseNumber'}
                            value={form['licenseNumber']}
                            withButton={true}
                            setValue={(e) => setValueHandler('licenseNumber', e.target.value)}
                        />
                        <Input
                            label={'License Expires'}
                            name={'licenseExpireDate'}
                            value={form['licenseExpireDate']}
                            type={'date'}
                            withButton={true}
                            setValue={(e) => setValueHandler('licenseExpireDate', e.target.value)}
                        />
                    </>
                }
                <div>
                    <select value={form.role} onChange={(e) => setValueHandler('role', e.target.value)}
                            className={'w-full py-2 border-b border-slate-400 focus:outline-none'}>
                        <option value="" disabled>Role</option>
                        <option value="admin">Admin</option>
                        <option value="guard">Guard</option>
                    </select>
                </div>
                <div className={'flex justify-end mt-8'}>
                    <button type={'button'} className={'pl-6 py-2'} onClick={openModalHandler}>Close</button>
                    <button type={'submit'}
                            className={'pl-6 py-2 text-blue-500 font-bold rounded-lg text-blue-500'}>Save
                    </button>
                </div>
            </form>
        </div>
    </Modal>);
}