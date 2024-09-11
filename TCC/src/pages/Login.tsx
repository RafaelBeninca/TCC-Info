import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../contexts/authContext/Auth";
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from "../contexts/authContext/Index";
import { useState } from "react";


const Login = () => {

    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const signIn = async (e: any) => {
        e.preventDefault()
        if(!isSigningIn) {
            setIsSigningIn(true)
            await doSignInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("sucesso :)")
                console.log(userCredential);
            })
            .catch((error) => {
                console.log("caca")
                console.log(error);
            })
        }
    }

    const onGoogleSignIn = async (e: any) => {
        e.preventDefault()
        if(!isSigningIn) {
            setIsSigningIn(true)
            doSignInWithGoogle().catch(err => {
                setIsSigningIn(false)
            })
        }
    }

    return (
        <div>
            {userLoggedIn && (<Navigate to={'/Home'} replace={true} />)}
            <form onSubmit={signIn}>
                <h1>Login</h1>
                Senha:<input type="text" 
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>
                </input><br/>
                Email:<input type="text"
                    placeholder="Email"
                    value={email} onChange={(e) => setEmail(e.target.value)}>
                </input>
                <button type="submit">Logar</button>
            </form>
            <Outlet/>
        </div>
    )
}

export default Login