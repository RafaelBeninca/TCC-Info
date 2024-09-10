import { createUserWithEmailAndPassword } from 'firebase/auth';
import { Navigate } from 'react-router-dom'
import { useAuth } from "../contexts/authContext/Index";
import { auth } from '../contexts/firebase/firebaseConfig';
import { useState } from "react";

const Register = () => {

    const { userLoggedIn } = useAuth()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [isSigningIn, setIsSigningIn] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const signUp = async (e: any) => {
        e.preventDefault()
        if(!isSigningIn) {
            setIsSigningIn(true)
            await createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential: any) => {
                console.log("sucesso :)")
                console.log(userCredential);
            })
            .catch((error: any) => {
                console.log("caca")
                console.log(error);
            })
        }
    }

    return (
        <div>
            {userLoggedIn && (<Navigate to={'/Home'} replace={true} />)}
            <form onSubmit={signUp}>
                <h1>Registrar</h1>
                Senha:<input type="text" 
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}>
                </input><br/>
                Email:<input type="text"
                    placeholder="Email"
                    value={email} onChange={(e) => setEmail(e.target.value)}>
                </input>
                <button type="submit">Registrar</button>
            </form>
        </div>
    )
}

export default Register