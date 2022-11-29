import Select from "react-dropdown-select";
import {UserPlusIcon} from "@heroicons/react/24/solid";
import {useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getAllGuards} from "../../helpers/api-utils/users";
import {addMemberShift} from "../../helpers/api-utils/shifts";
export default function AddMemberForm(props) {

    const { session, shiftId } = props;

    const [selectedUser, setSelectedUser] = useState({});

    const {isLoading, isError, data: users, error} = useQuery({
        queryKey: ['guards'],
        queryFn: getAllGuards.bind(this, session.user.accessToken),
    });

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: async (data) => {
            return await addMemberShift(data.body, data.header)
        },
        onSuccess: ()=> {
            queryClient.invalidateQueries(['clients']);
            queryClient.refetchQueries('clients', {force: true});
        }
    });

    async function addMemberHandler(){
        console.log(selectedUser);
        console.log(shiftId);

        if (session) {

            const data = {
                body: {
                    userId: selectedUser._id,
                    shiftId: shiftId
                },
                header: session.user.accessToken,
            }

            const result = await mutation.mutateAsync(data);

            try{
                if(result){
                    console.log(result);
                }
            }catch(error){
                console.log(error);
            }

        }
    }

    return (
        <div className={'my-5 w-1/2'}>
            <label htmlFor={'userId'}>Select GuardCorp Member</label>
            <div className="flex flex-row">
                <Select
                    style={{
                        width:'400px',
                        border:'2',
                        borderRadius:5,
                        borderStyle:'solid',
                        borderColor:'rgb(203 213 225)',
                    }}
                    loading={false}
                    className={'w-full grow flex'}
                    values={[]}
                    labelField={'fullName'}
                    valueField={'fullName'}
                    options={users}
                    onChange={(values)=> {
                        setSelectedUser(values[0]);
                    }}
                />
                <button className={'ml-2 hover:border-slate-400 border-2 px-2 rounded-md'}
                onClick={addMemberHandler}>
                    <UserPlusIcon className="h-6 w-6 text-slate-500" />
                </button>
            </div>
        </div>
    )
}