import { IUserMin } from "./User";

interface IPost {
  _id: string;
  display: 'friends' | 'all';
  group?: string;
  author: IUserMin;
  sharedBy: string[];
  text?: string;
  image?: string;
  event?: string;
  comments: string[];
  likes: string[];
  created_at: Date;
}

export interface ICreatePost {
  _id?: string;
  display?: 'friends' | 'all';
  group?: string;
  author?: IUserMin;
  sharedBy?: string[];
  text?: string;
  image?: string;
  event?: string;
  comments?: string[];
  likes?: string[];
  created_at?: Date;
}

export default IPost;
