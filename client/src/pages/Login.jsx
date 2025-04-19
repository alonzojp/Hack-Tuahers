import "../styles/pages/Login.css"

import { Link, useNavigate } from "react-router-dom"

import Button from "../components/ui/Button"

const Login = () => {
    const navigate = useNavigate()

    const logThatUserIn = () => {

    }


    return(
        <div className="login-container">
            <div className="actual-login-container">
                <h1>Login</h1>
                <div className="inputs">
                    <h1>Email</h1><input type="text" id="email" name ="email"/>
                    <h1>Password</h1><input type="password" id="password" name="password" />
                </div>
                <div className="submit">
                    <Button title={"Login"} onClick={() => {logThatUserIn}}/>
                    <Link to={'/Signup'}>
                        <p>Don't have an Account? Create one!</p>
                    </Link>
                </div>

            </div>
        </div>
    )
}

export default Login