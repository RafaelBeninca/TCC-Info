export interface FormUser {
  name: string;
  email: string;
  password: string;
  authUid: string;
}

export interface CustomTableUser {
  uid: string;
  name: string;
  isProfessional: boolean;
  profilePicture: string;
  authUid: string;
}
