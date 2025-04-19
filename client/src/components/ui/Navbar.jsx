import "../../styles/components/ui/Navbar.css"

import { Link } from "react-router-dom"

const Navbar = () => {
    return(
        <>
            <div className="navbar-container">
                <Link to={'/home'}>
                    <h1>Home</h1>
                </Link>
            </div>
        </>
    )
}

export default Navbar