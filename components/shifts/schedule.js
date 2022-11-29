export default function Schedule(props) {

    const {title, timeIn, timeOut, setTimeIn, setTimeOut, type} = props;

    return (
        <div className="w-full mt-3">
            <h4 className={'text-left mb-2 text-lg px-2'}>{title}</h4>
            <div className={'flex justify-start space-x-4 px-2'}>
                <div>
                    <label htmlFor="shiftStart" className={'mr-4 text-slate-400'}>Shift Start</label>
                    <input
                        value={timeIn}
                        className={'border-b border-slate-400'}
                        id={'shiftStart'}
                        type={'time'}
                        onChange={(e) => setTimeIn(type === 'daily' ? 'timeIn' : 'hTimeIn', e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="shiftEnd" className={'mr-4 text-slate-400'}>Shift End</label>
                    <input
                        value={timeOut}
                        className={'border-b border-slate-400'}
                        id={'shiftEnd'}
                        type={'time'}
                        onChange={(e) => setTimeOut(type === 'daily' ? 'timeOut' : 'hTimeOut', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}