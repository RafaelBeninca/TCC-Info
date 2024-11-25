import { Timestamp } from "firebase/firestore";

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
  city: string,
  displayEmail: string,
  displayPhone: string,
}

export interface SecDisplayInfo {
  displayEmail: string,
  displayPhone: string,
}

export interface JoinTagsUser {
  userId: string,
  tagId: string,
}

export interface Tag {
  id: string,
  tagName: string,
};

export interface SearchUser {
  city: string,
  uid: string,
};

export interface Service {
  ownerId: string,
  claimedId: string,
  tagId: string,
  title: string,
  description: string,
  value: string,
  image: string,
  status: string,
  city: string,
  displayPhone: string,
  displayEmail: string,
  createdAt: Timestamp
  claimedName: string,
  ownerName: string,
}

export interface PriceRange {
  priceMin: string,
  priceMax: string,
}