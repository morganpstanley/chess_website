export default function Legend({divId, text}) {
    return (
        <span id={divId}>⬤ {divId}
            <div className="inner-text">
                {text}
            </div>
        </span>
    )
}