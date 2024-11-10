export interface FormUser {
  name: string;
  email: string;
  password: string;
}

export interface Data {
  name: string;
  profilePicture?: string;
  password: string;
  email: string;
  [key: string]: unknown;
}

export interface CustomTableUser {
  uid: string;
  name: string;
  isProfessional: boolean;
  profilePicture: string;
  email: string,
  password: string,
  description: string,
}
