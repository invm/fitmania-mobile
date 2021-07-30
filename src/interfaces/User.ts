interface IUser {
  _id: string;
  name: string;
  email: string;
  lastname: string;
  birthday?: string;
  location?: string;
  image?: string;
  preferable: string[];
  undesirable: string[];
  fcmToken?: string;
  [key: string]: any;
}

export interface IUserMin {
  _id: string;
  name: string;
  image: string;
  lastname: string;
}

export default IUser;
