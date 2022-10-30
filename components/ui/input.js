export default function Input(props) {

    const {label, type, name, value, setValue, bg}  = props;

    return (
        <div className={'relative'}>
            <div className={`flex flex-col items-start ${value !== '' ? 'mb-5': 'my-0'}`}>
                <input value={value} onChange={setValue} type={type} id={name} placeholder="John Doe"
                       className={`peer pt-2 w-full border-b border-slate-400
                       placeholder-transparent focus:outline-0 ${bg}`} />

                    <label htmlFor={name} className="
                        -mt-10 text-xs text-slate-400 mb-8
                        peer-placeholder-shown:text-slate-400
                        peer-placeholder-shown:-mt-8
                        peer-placeholder-shown:text-base
                        duration-300">
                        {label}
                </label>
            </div>
        </div>
    )
}