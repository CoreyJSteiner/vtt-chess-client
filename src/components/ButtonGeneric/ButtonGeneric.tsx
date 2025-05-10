import './ButtonGeneric.css'

type ButtonProps = {
    buttonText: string,
    clickFunction: () => void
}

const ButtonGeneric: React.FC<ButtonProps> = ({ buttonText, clickFunction }) => {
    return (
        <button className="button-generic" onClick={clickFunction}>{buttonText}</button>
    )
}

export default ButtonGeneric