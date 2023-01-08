

export default function CircleButton(props){

    const { title, isSelected, onClick } = props;

    const selected = 'rounded-full bg-blue-700 w-7 h-7 text-white flex justify-center items-center';
    const unselected = 'rounded-full bg-gray-300 w-7 h text-gray-700 flex justify-center items-center';
    return (
        <button className={isSelected ? selected : unselected} type={'button'} onClick={onClick}>
            {title}
        </button>
    )
}