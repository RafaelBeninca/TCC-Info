import { User, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../contexts/firebase/firebaseConfig";

const AuthDetails = () => {
    const [authUser, setAuthUser] = useState<User | null>(null);

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
        }).catch(error => console.log(error));
    }

    return (
        <div>{authUser ? <><p>{`Logado como ${authUser.email}`}</p><button onClick={userSignOut}>Deslogar</button> </> : <p>Não Logado</p>}</div>
    )
}

export default AuthDetails;