import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../contexts/firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

const AuthDetails = () => {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()

    useEffect(() => {
        const listen = onAuthStateChanged(auth, (user) => {
            if (user) {
                setAuthUser(user)
            } else {
                setAuthUser(null);
            }
        });

        return () => {
            listen();
        }
    }, []);

    const userSignOut = () => {
        signOut(auth)
        .then(() => {
            console.log('Deslogado com sucesso!')
            navigate('/login')
        }).catch(error => console.log(error));
    }

    const handleDeleteAccount = () => {
        const user = auth.currentUser;
        if (user) {
            user.delete()
            .then(() => {
                console.log('Conta deletada com sucesso.')
                navigate('/login')
            })
            .catch((error) => {
                setError(error.message)
            });
        }
    }

    return (
        <div>
            {authUser ? <><p>{`Logado como ${authUser.email}`}</p><button onClick={userSignOut}>Deslogar</button> </> : <> <p>Não Logado</p></>}<br/>
            <button onClick={handleDeleteAccount}>Delete My Account</button>
        </div>
    )
}

export default AuthDetails;