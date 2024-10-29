interface AuthState {
  currentUser: User | null;
}

type AuthAction =
  | { type: "LOGIN"; payload: User }
  | { type: "LOGOUT" };

interface User {
  uid: string;
  email: string;
}


const FirebaseAuthReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "LOGIN": {
      return {
        currentUser: action.payload,
      };
    }
    case "LOGOUT": {
      return {
        currentUser: null,
      };
    }
    default:
      return state;
  }
}

export default FirebaseAuthReducer