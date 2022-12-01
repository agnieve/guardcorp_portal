import Modal from "../ui/modal";
import Input from "../ui/input";
import {formSettings} from "../../constants/site";
import {getAllClients} from "../../helpers/api-utils/clients";
import {createSite, fetchGeneratedLatLng, fetchSearchPlaces, updateSite} from "../../helpers/api-utils/sites";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useState} from "react";
import Loader from "../ui/loader";

export default function SitesForm(props) {

    const {setActionSuccess, openModal, openModalHandler, action, form, setForm, siteId, session} = props;

    const [searches, setSearches] = useState([]);
    const [placesId, setPlacesId] = useState("");
    const [selectedPlace, setSelectedPlace] = useState(false);

    const {data: clients} = useQuery({
        queryKey: ['clients'],
        queryFn: getAllClients.bind(this, session.user.accessToken),
    });

    const {data: places, refetch, isError, isRefetching} = useQuery({
        queryKey: ['places'],
        queryFn: fetchGeneratedLatLng.bind(this, placesId),
        refetchOnWindowFocus: false,
        enabled: false // disable this query from automatically running
    });

    const {data: searchPlaces, refetch: refetchSearch, isRefetching: isRefetchingSearch} = useQuery({
        queryKey: ['searchPlaces'],
        queryFn: fetchSearchPlaces.bind(this, form['address']),
        refetchOnWindowFocus: false,
        enabled: false // disable this query from automatically running
    });

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
                return await createSite(data.body, data.header)
            } else {
                return await updateSite(data.userId, data.body, data.header)
            }
        },
        onSuccess: (data) => {

            queryClient.invalidateQueries(['sites']);
            queryClient.refetchQueries('sites', {force: true});
        }
    });

    async function submitHandler(e) {
        e.preventDefault();

        if (session) {

            const data = {
                body: form,
                header: session.user.accessToken,
                userId: siteId,
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


    async function generateGeocode(searched) {

        console.log(searched.place_id);
        setPlacesId(searched.place_id);

        const result = await refetch();

        setForm(prevState => {
            let formState = {...prevState};
            console.log(formState['latitude']);
            if (result.data) {
                formState['address'] = searched.description;
                formState['latitude'] = result.data.lat;
                formState['longitude'] = result.data.lng;
            }
            return formState;
        });
    }

    async function searchHandler() {
        const result = await refetchSearch();
        setSearches(result.data?.predictions);
        console.log(result);
    }

    const onBlurSearch = ()=> {
        setSelectedPlace(true);
    };

    return (<Modal open={openModal} setOpen={openModalHandler}>
        <div className={'flex flex-col h-96 overflow-y-auto'}>
            <div className={'flex px-2 pt-2'}>
                <h2>{action === 'add' ? 'New Site' : 'Edit Site'}</h2>
            </div>

            <form onSubmit={submitHandler} className={'px-4 pt-4'}>
                <div className={'flex space-x-4 h-72 overflow-y-auto'}>
                    <div className={'w-full'}>
                        <div>
                            <Input
                                label={'Site Name'}
                                value={form['siteName']}
                                setValue={(e) => setValueHandler('siteName', e.target.value)}
                                withButton={true}
                            />

                            <div className={'relative'}>
                                <Input
                                    onBlur={()=> {}}
                                    label={'Address'}
                                    value={form['address']}
                                    setValue={async (e) => {
                                        setValueHandler('address', e.target.value)

                                        await searchHandler();

                                        console.log(e.target.value);

                                        if (e.target.value === '' || e.target.value === null) {
                                            setSelectedPlace(true);
                                        }
                                        setSelectedPlace(false);

                                    }}
                                    withButton={true}
                                />
                                {
                                    selectedPlace === false ?
                                        <ul className={'absolute z-50 bg-slate-100 shadow-lg w-full px-1 mb-3 space-y-2'}>
                                            {
                                                searches.length > 0 && searches.map((search, index) => <li key={index}
                                                                                                           className={'hover:bg-slate-200 py-2'}>
                                                    <button type={'button'} onClick={async () => {
                                                        console.log('selected a place');
                                                        await generateGeocode(search);
                                                        setSelectedPlace(true);
                                                    }}>{search.description}</button>
                                                </li>)
                                            }
                                        </ul> : null
                                }
                            </div>

                            {/*<Input*/}
                            {/*    withButton={true}*/}
                            {/*    label={'Address'}*/}
                            {/*    value={form['address']}*/}
                            {/*    setValue={(e) => setValueHandler('address', e.target.value)}*/}
                            {/*/>*/}
                            {/*{!isRefetching && places ?*/}
                            {/*    <p className={'bg-green-500 text-white rounded mb-2'}>Fetched Latitude &*/}
                            {/*        Longitude </p>*/}
                            {/*    : null}*/}

                            {/*{isError ?*/}
                            {/*    <p className={'bg-red-500 text-white rounded mb-2'}>Could not find the Address </p>*/}
                            {/*    : null}*/}

                            {/*<button onClick={generateGeocode} type={'button'}*/}
                            {/*        className={'bg-blue-500 text-white rounded-lg mt-3'}>Generate Geocode*/}
                            {/*</button>*/}


                        </div>
                        <div>
                            <select value={form.clientId}
                                    onChange={(e) => setValueHandler('clientId', e.target.value)}
                                    className={'w-full py-2 border-b border-slate-400 focus:outline-none mb-5'}
                                    defaultValue={form.role ? form.role : ""}>
                                <option value="" disabled>Select Client</option>
                                {clients?.map((client) => <option key={client._id}
                                                                  value={client._id}>{client.name}</option>)}
                            </select>
                        </div>

                        <div className={'flex items-start flex-col'}>
                            <label className={'text-slate-400 text-left'} htmlFor="complianceInformation">
                                Compliance Information</label>
                            <textarea id={'complianceInformation'} rows={9}
                                      className={'w-full border-b border-slate-400 focus:outline-none'}
                                      value={form.complianceInformation}
                                      onChange={(e) => setValueHandler('complianceInformation', e.target.value)}>
                        </textarea>
                        </div>
                    </div>
                </div>

                <div className={'flex justify-end'}>
                    <button type={'button'} className={'pl-6 py-2'} onClick={openModalHandler}>Close</button>
                    <button type={'submit'}
                            className={'pl-6 py-2 text-blue-500 font-bold rounded-lg text-blue-500'}>Save
                    </button>
                </div>
            </form>
        </div>
    </Modal>);
}