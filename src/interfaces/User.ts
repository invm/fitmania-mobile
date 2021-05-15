interface IUser {
  _id: string;
  name: string;
  email: string;
  lastname: string;
  birthday?: Date;
  location?: string;
  avatar?: string;
  preferable?: string[];
  undesirable?: string[];
  fcmToken?: string;
}

export interface IUserMin {
  _id: string;
  name: string;
  avatar: string;
  lastname: string;
}

export default IUser;
