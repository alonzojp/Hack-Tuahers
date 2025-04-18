import "../../styles/components/ui/Navbar.css"

const Button = ({ title, onClick }) => {
    return(
        <button onClick={onClick}>
            {title}
        </button>
    )
}

export default Button