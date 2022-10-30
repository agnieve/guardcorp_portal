import Modal from "../ui/modal";
import Input from "../ui/input";
import {formSettings} from "../../constants/user";
import {createUser, updateUser} from "../../helpers/api-utils/users";
import {useSession} from "next-auth/react";

export default function UserForm(props) {

    const {setActionSuccess, openModal, openModalHandler, action, form, setForm, userId} = props;
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
                    result = await createUser(form, token);
                    if (result) {
                        setActionSuccess(prev => prev + 1)
                        openModalHandler();
                    }
                    break;
                case 'edit':
                    result = await updateUser(userId, form, token);
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
                <h2>{action === 'add' ? 'New User' : 'Edit User'}</h2>
            </div>

            <form onSubmit={submitHandler} className={'px-4 pt-4'}>
                {
                    formSettings.length > -1 ?
                        formSettings.map((set, index) =>
                            action == 'edit' && set.name == 'password' ? null : <Input
                                key={index}
                                label={set.label}
                                name={set.name}
                                value={form[set.name]}
                                type={set.type}
                                setValue={(e) => setValueHandler(set.name, e.target.value)}
                            />) : null
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
                    <button type={'submit'} className={'pl-6 py-2 text-blue-500 font-bold rounded-lg text-blue-500'}>Save
                    </button>
                </div>
            </form>
        </div>
    </Modal>);
}