
export default function BreadCrumb(props){

    const { headerTitle, toolTip} = props;

    return (
        <div className="flex justify-between mb-5">
            <h2 className={'text-slate-500'}>{headerTitle}</h2>
            {toolTip}
        </div>
    );
}