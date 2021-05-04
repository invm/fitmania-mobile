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

export default IUser;
