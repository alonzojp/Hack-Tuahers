import "../../styles/components/ui/Button.css"

const Button = ({ title, onClick }) => {
    return(
        <button className="button-component" onClick={onClick}>
            {title}
        </button>
    )
}

export default Button