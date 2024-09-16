import { doSignInWithEmailAndPassword, doSignInWithGoogle } from "../contexts/authContext/Auth";
import { Navigate, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from "../contexts/authContext/Index";
import { useState } from "react";
import './../index.css'


const Login = () => {

    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const navigate = useNavigate()

    const signIn = async (e: any) => {
        e.preventDefault()
        if(!isSigningIn) {
            setIsSigningIn(true)
            await doSignInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                console.log("sucesso :)")
                console.log(userCredential);
                navigate('/')
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
        <>
            <div className="max-w-screen-x1 flex flex-wrap items-center justify-between mx-auto p-2 bg-yellow-300">
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
        </>
    )
}

export default Login