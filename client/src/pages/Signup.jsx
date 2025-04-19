import "../styles/pages/Signup.css"

import { Link, useNavigate } from "react-router-dom"

import Button from "../components/ui/Button"

const Signup = () => {
    const navigate = useNavigate()

    const createTuah = () => {
        
    }

    return(
        <div className="signup-container">
            <div className="actual-signup-container">
                <h1>Sign Up</h1>
                <div className="inputs">
                    <h1>Email</h1><input type="text" />
                    <h1>Username</h1><input type="text" />
                    <h1>Password</h1><input type="password" />
                    <h1>Password Again</h1><input type="password" />
                </div>
                <div className="submit">
                    <Button title={"Login"} onClick={() => {createTuah}}/>
                    <Link to={'/Login'}>
                        <p>Don't have an Account? Create one!</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default Signup