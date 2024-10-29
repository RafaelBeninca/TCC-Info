export interface FormUser {
  name: string;
  email: string;
  password: string;
}

export interface ChangeUser {
  name: string;
  email: string;
  password: string;
  profilePicture: string;
}

export interface CustomTableUser {
  uid: string;
  name: string;
  isProfessional: boolean;
  profilePicture: string;
}